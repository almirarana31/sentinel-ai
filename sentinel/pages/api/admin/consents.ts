import type { NextApiRequest, NextApiResponse } from "next"
import { ensureSchema, dbQuery } from "@/lib/db/pool"
import { getSessionUser } from "@/lib/auth/session"

type AdminConsentRow = {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  code_collection_point: string
  payload: unknown
  created_at: string
}

type AdminConsentsResponse = { ok: true; rows: AdminConsentRow[] } | { ok: false; error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<AdminConsentsResponse>) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" })

  const sessionUser = await getSessionUser(req)
  if (!sessionUser) return res.status(401).json({ ok: false, error: "Missing or invalid admin session" })
  if (sessionUser.role !== "admin") return res.status(403).json({ ok: false, error: "Admin access required" })

  await ensureSchema()

  const out = await dbQuery<{
    id: string
    email: string
    name: string
    role: "admin" | "user" | null
    code_collection_point: string
    payload: any
    created_at: any
  }>(
    \`
    SELECT
      c.id,
      COALESCE(u.email, "anonymous") as email,
      COALESCE(u.name, "") as name,
      COALESCE(u.role, "user") as role,
      c.code_collection_point,
      c.payload,
      c.created_at
    FROM consent_submission c
    LEFT JOIN app_user u ON u.id = c.user_id
    ORDER BY c.created_at DESC
    LIMIT 500;
    \`
  )

  const rows = out.rows.map((r) => {
    return {
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role === "admin" ? "admin" : "user",
      code_collection_point: r.code_collection_point,
      payload: r.payload,
      created_at: String(r.created_at),
    } satisfies AdminConsentRow
  })

  return res.status(200).json({ ok: true, rows })
}