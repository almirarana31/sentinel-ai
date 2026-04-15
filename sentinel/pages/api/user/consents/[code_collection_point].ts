import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "node:crypto"
import { ensureSchema, dbQuery } from "@/lib/db/pool"
import { sha256 } from "@/lib/auth/token-utils"

type PostConsentResponse = { ok: true } | { ok: false; error: string }

function bearerToken(req: NextApiRequest) {
  const header = req.headers.authorization || ""
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1] || ""
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PostConsentResponse>) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" })

  const code = String(req.query.code_collection_point || "")
  if (!code) return res.status(400).json({ ok: false, error: "Missing code_collection_point" })

  const token = bearerToken(req)
  if (!token) return res.status(401).json({ ok: false, error: "Missing Authorization Bearer token" })

  await ensureSchema()

  const tokenHash = sha256(token)
  const sessionOut = await dbQuery<{ user_id: string }>(
    `
    SELECT user_id
    FROM app_session
    WHERE token_hash = ?
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    `,
    [tokenHash]
  )

  const sessionRow = sessionOut.rows[0]
  if (!sessionRow) return res.status(401).json({ ok: false, error: "Invalid or expired session" })

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body

  await dbQuery(
    `INSERT INTO consent_submission(id, user_id, code_collection_point, payload)
     VALUES (?, ?, ?, ?);`,
    [crypto.randomUUID(), sessionRow.user_id, code, JSON.stringify(body ?? {})]
  )

  return res.status(200).json({ ok: true })
}
