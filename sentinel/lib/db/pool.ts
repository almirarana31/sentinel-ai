import { Pool, type QueryResultRow } from "pg"
import { SCHEMA_SQL } from "@/lib/db/schema"

let pool: Pool | null = null
let schemaEnsured = false

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("Missing DATABASE_URL")
  return url
}

export function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: getDatabaseUrl() })
  }
  return pool
}

export async function dbQuery<T extends QueryResultRow = any>(text: string, values?: any[]) {
  if (!values) return await getPool().query<T>(text)
  return await getPool().query<T>(text, values)
}

export async function ensureSchema() {
  if (schemaEnsured) return
  // Important: schema SQL contains multiple statements; run it as a simple query (no params)
  await dbQuery(SCHEMA_SQL)
  schemaEnsured = true
}
