import mysql, {
  type Pool,
  type PoolOptions,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise"
import { SCHEMA_SQL } from "@/lib/db/schema"

type DatabaseRow = RowDataPacket & Record<string, any>

export type DbQueryResult<T = DatabaseRow> = {
  rows: T[]
  rowCount: number
  insertId?: number
}

export type DatabaseDebugInfo = {
  source: "db_vars" | "database_url" | "missing"
  host: string | null
  port: number | null
  database: string | null
  user: string | null
  hasPassword: boolean
  hasDatabaseUrl: boolean
  hasDbVars: {
    host: boolean
    port: boolean
    database: boolean
    user: boolean
    password: boolean
  }
}

let pool: Pool | null = null
let schemaPromise: Promise<void> | null = null

function parseBoolean(value?: string | null) {
  if (!value) return false
  return ["1", "true", "yes", "on"].includes(value.toLowerCase())
}

export function getDatabaseDebugInfo(): DatabaseDebugInfo {
  const host = process.env.DB_HOST || null
  const database = process.env.DB_NAME || process.env.DB_DATABASE || null
  const user = process.env.DB_USER || process.env.DB_USERNAME || null
  const password = process.env.DB_PASSWORD || ""
  const portRaw = process.env.DB_PORT || ""
  const databaseUrl = process.env.DATABASE_URL || ""

  if (host && database && user) {
    return {
      source: "db_vars",
      host,
      port: portRaw ? Number(portRaw) : 3306,
      database,
      user,
      hasPassword: password.length > 0,
      hasDatabaseUrl: Boolean(databaseUrl),
      hasDbVars: {
        host: Boolean(process.env.DB_HOST),
        port: Boolean(process.env.DB_PORT),
        database: Boolean(process.env.DB_NAME || process.env.DB_DATABASE),
        user: Boolean(process.env.DB_USER || process.env.DB_USERNAME),
        password: Boolean(process.env.DB_PASSWORD),
      },
    }
  }

  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl)
      return {
        source: "database_url",
        host: parsed.hostname || null,
        port: Number(parsed.port || "3306"),
        database: parsed.pathname.replace(/^\/+/, "") || null,
        user: parsed.username ? decodeURIComponent(parsed.username) : null,
        hasPassword: Boolean(parsed.password),
        hasDatabaseUrl: true,
        hasDbVars: {
          host: Boolean(process.env.DB_HOST),
          port: Boolean(process.env.DB_PORT),
          database: Boolean(process.env.DB_NAME || process.env.DB_DATABASE),
          user: Boolean(process.env.DB_USER || process.env.DB_USERNAME),
          password: Boolean(process.env.DB_PASSWORD),
        },
      }
    } catch {
      return {
        source: "database_url",
        host: null,
        port: null,
        database: null,
        user: null,
        hasPassword: false,
        hasDatabaseUrl: true,
        hasDbVars: {
          host: Boolean(process.env.DB_HOST),
          port: Boolean(process.env.DB_PORT),
          database: Boolean(process.env.DB_NAME || process.env.DB_DATABASE),
          user: Boolean(process.env.DB_USER || process.env.DB_USERNAME),
          password: Boolean(process.env.DB_PASSWORD),
        },
      }
    }
  }

  return {
    source: "missing",
    host: null,
    port: null,
    database: null,
    user: null,
    hasPassword: false,
    hasDatabaseUrl: false,
    hasDbVars: {
      host: Boolean(process.env.DB_HOST),
      port: Boolean(process.env.DB_PORT),
      database: Boolean(process.env.DB_NAME || process.env.DB_DATABASE),
      user: Boolean(process.env.DB_USER || process.env.DB_USERNAME),
      password: Boolean(process.env.DB_PASSWORD),
    },
  }
}

function getDatabaseConfig(): PoolOptions {
  const baseOptions: PoolOptions = {
    charset: "utf8mb4",
    connectionLimit: 10,
    dateStrings: true,
    enableKeepAlive: true,
    queueLimit: 0,
    supportBigNumbers: true,
    timezone: "Z",
    waitForConnections: true,
  }

  const host = process.env.DB_HOST
  const database = process.env.DB_NAME || process.env.DB_DATABASE
  const user = process.env.DB_USER || process.env.DB_USERNAME
  const password = process.env.DB_PASSWORD || ""
  const port = Number(process.env.DB_PORT || "3306")

  if (host && database && user) {
    return {
      ...baseOptions,
      host,
      port,
      user,
      password,
      database,
      ssl: parseBoolean(process.env.DB_SSL) ? { rejectUnauthorized: false } : undefined,
    }
  }

  const databaseUrl = process.env.DATABASE_URL
  if (databaseUrl) {
    const parsed = new URL(databaseUrl)
    if (!["mysql:", "mariadb:"].includes(parsed.protocol)) {
      throw new Error("DATABASE_URL must use a mysql:// or mariadb:// connection string")
    }

    const urlDatabase = parsed.pathname.replace(/^\/+/, "")
    if (!urlDatabase) throw new Error("DATABASE_URL is missing the database name")

    return {
      ...baseOptions,
      host: parsed.hostname,
      port: Number(parsed.port || "3306"),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: urlDatabase,
      ssl: parseBoolean(parsed.searchParams.get("ssl")) ? { rejectUnauthorized: false } : undefined,
    }
  }

  throw new Error("Missing database configuration. Set DB_HOST/DB_NAME/DB_USER or DATABASE_URL.")
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDatabaseConfig())
  }

  return pool
}

export async function dbQuery<T = DatabaseRow>(
  text: string,
  values: unknown[] = []
): Promise<DbQueryResult<T>> {
  const [result] = await getPool().query(text, values)

  if (Array.isArray(result)) {
    return {
      rows: result as T[],
      rowCount: result.length,
    }
  }

  const header = result as ResultSetHeader
  return {
    rows: [],
    rowCount: header.affectedRows ?? 0,
    insertId: header.insertId,
  }
}

function getSchemaStatements() {
  return SCHEMA_SQL.split(";")
    .map((statement) => statement.trim())
    .filter(Boolean)
}

export async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      for (const statement of getSchemaStatements()) {
        await dbQuery(statement)
      }
    })().catch((error) => {
      schemaPromise = null
      throw error
    })
  }

  await schemaPromise
}
