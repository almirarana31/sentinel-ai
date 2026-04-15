import mysql from "mysql2/promise"
import { SCHEMA_SQL } from "@/lib/db/schema"

let pool: mysql.Pool | null = null
let schemaEnsured = false

function getDatabaseConfig() {
  const url = process.env.DATABASE_URL
  
  if (!url) {
    // Fallback for Hostinger environment variables
    return {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "u118172070_almirarana",
      password: process.env.DB_PASSWORD || "$entinelDB123",
      database: process.env.DB_NAME || "u118172070_sentinelsql",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }
  }
  
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port) || 3306,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.substring(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: url.includes("sslmode=") ? { rejectUnauthorized: false } : undefined
    }
  } catch (e) {
    return { uri: url }
  }
}

export function getPool() {
  if (!pool) {
    const config = getDatabaseConfig()
    if ("uri" in config) {
      pool = mysql.createPool((config as any).uri)
    } else {
      pool = mysql.createPool(config)
    }
  }
  return pool
}

export async function dbQuery<T = any>(text: string, values?: any[]) {
  const mysqlText = text.replace(/\$\d+/g, "?")
  const [rows] = await getPool().execute(mysqlText, values)
  return { rows: rows as T[] }
}

export async function ensureSchema() {
  if (schemaEnsured) return
  
  const statements = SCHEMA_SQL.split(";").filter(s => s.trim().length > 0)
  const connection = await getPool().getConnection()
  
  try {
    for (const statement of statements) {
      await connection.query(statement)
    }
    schemaEnsured = true
  } catch (err) {
    console.error("Schema initialization failed:", err)
  } finally {
    connection.release()
  }
}