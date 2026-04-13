import type { NextApiRequest, NextApiResponse } from "next"
import { ensureSchema, dbQuery } from "@/lib/db/pool"

type AdminConsentRow = {
  email: string
  name: string
  code_collection_point: string
  payload: unknown
  created_at: string
}

type AdminConsentsResponse = { ok: true; rows: AdminConsentRow[] } | { ok: false; error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<AdminConsentsResponse>) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" })

  await ensureSchema()

  const out = await dbQuery<{
    email: string
    name: string
    code_collection_point: string
    payload_text: string
    created_at: string
  }>(
    `
    SELECT DISTINCT ON (COALESCE(u.email, 'anonymous'))
      COALESCE(u.email, 'anonymous') as email,
      COALESCE(u.name, '') as name,
      c.code_collection_point,
      c.payload::text as payload_text,
      c.created_at::text as created_at
    FROM consent_submission c
    LEFT JOIN app_user u ON u.id = c.user_id
    ORDER BY COALESCE(u.email, 'anonymous'), c.created_at DESC
    LIMIT 500;
    `
  )

  const rows = out.rows.map((r: { email: string; name: string; code_collection_point: string; payload_text: string; created_at: string }) => {
    let payload: unknown = {}
    try {
      payload = JSON.parse(r.payload_text || "{}")
    } catch {
      payload = { raw: r.payload_text }
    }
    return {
      email: r.email,
      name: r.name,
      code_collection_point: r.code_collection_point,
      payload,
      created_at: r.created_at,
    } satisfies AdminConsentRow
  })

  return res.status(200).json({ ok: true, rows })
}
