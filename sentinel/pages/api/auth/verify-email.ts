import type { NextApiRequest, NextApiResponse } from "next"
import { ensureSchema, dbQuery } from "@/lib/db/pool"
import { normalizeEmail, sha256 } from "@/lib/auth/token-utils"

type VerifyResponse = { ok: true } | { ok: false; error: string }

const MAX_ATTEMPTS = 10

export default async function handler(req: NextApiRequest, res: NextApiResponse<VerifyResponse>) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" })

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
  const email = normalizeEmail(String(body?.email || ""))
  const code = String(body?.code || "")
  if (!email.includes("@")) return res.status(400).json({ ok: false, error: "Invalid email" })
  if (!code) return res.status(400).json({ ok: false, error: "Missing code" })

  await ensureSchema()

  const userOut = await dbQuery<{ id: string }>(\`SELECT id FROM app_user WHERE email = ? LIMIT 1;\`, [email])
  const userRow = userOut.rows[0]
  if (!userRow) return res.status(404).json({ ok: false, error: "User not found" })

  const tokenOut = await dbQuery<{ id: string; token_hash: string; attempts: number }>(
    \`
    SELECT id, token_hash, attempts
    FROM email_verification_token
    WHERE user_id = ?
      AND used_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    \`,
    [userRow.id]
  )

  const token = tokenOut.rows[0]
  if (!token) return res.status(400).json({ ok: false, error: "Invalid or expired code" })
  if (token.attempts >= MAX_ATTEMPTS) {
    return res.status(429).json({ ok: false, error: "Too many attempts. Please resend a new code." })
  }

  const tokenHash = sha256(code)
  if (tokenHash !== token.token_hash) {
    await dbQuery(\`UPDATE email_verification_token SET attempts = attempts + 1 WHERE id = ?;\`, [token.id])
    return res.status(400).json({ ok: false, error: "Invalid or expired code" })
  }

  await dbQuery(\`UPDATE app_user SET email_verified_at = NOW() WHERE id = ?;\`, [userRow.id])
  await dbQuery(\`UPDATE email_verification_token SET used_at = NOW() WHERE id = ?;\`, [token.id])

  return res.status(200).json({ ok: true })
}