import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "node:crypto"
import { ensureSchema, dbQuery } from "@/lib/db/pool"
import { normalizeEmail, sha256 } from "@/lib/auth/token-utils"
import { sendEmail } from "@/lib/email/mailer"

type ResendResponse = { ok: true } | { ok: false; error: string }

function appUrl(req: NextApiRequest) {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL
  if (fromEnv) return fromEnv.replace(/\/+$/, "")
  const proto = (req.headers["x-forwarded-proto"] as string) || "http"
  const host = req.headers.host || "localhost:3000"
  return \`\${proto}://\${host}\`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResendResponse>) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" })

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    const email = normalizeEmail(String(body?.email || ""))
    if (!email.includes("@")) return res.status(400).json({ ok: false, error: "Invalid email" })

    await ensureSchema()

    const out = await dbQuery<{ id: string; email_verified_at: any }>(
      \`SELECT id, email_verified_at FROM app_user WHERE email = ? LIMIT 1;\`,
      [email]
    )

    const row = out.rows[0]
    if (!row) return res.status(404).json({ ok: false, error: "User not found" })
    if (row.email_verified_at) return res.status(200).json({ ok: true })

    const code = String(crypto.randomInt(100000, 1000000))
    const tokenHash = sha256(code)
    const tokenId = crypto.randomUUID()
    await dbQuery(
      \`INSERT INTO email_verification_token(id, user_id, token_hash, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE));\`,
      [tokenId, row.id, tokenHash]
    )

    const link = \`\${appUrl(req)}/verify-email?email=\${encodeURIComponent(email)}\`
    await sendEmail({
      to: email,
      subject: "Verify your email",
      text: \`Your Sentinel verification code is:\n\n\${code}\n\nEnter it here:\n\${link}\n\nThis code expires in 15 minutes.\`,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("/api/auth/resend-verification error:", err)
    const message =
      process.env.NODE_ENV !== "production" && err instanceof Error
        ? err.message
        : "Internal server error"
    return res.status(500).json({ ok: false, error: message })
  }
}