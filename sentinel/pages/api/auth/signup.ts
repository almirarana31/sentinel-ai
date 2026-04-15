import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "node:crypto"
import { ensureSchema, dbQuery } from "@/lib/db/pool"
import { normalizeEmail, sha256 } from "@/lib/auth/token-utils"
import { sendEmail } from "@/lib/email/mailer"

type SignupResponse =
  | { ok: true }
  | { ok: false; requiresVerification: true; message: string }
  | { ok: false; error: string }

const VERIFY_CODE_TTL_MINUTES = 15

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 32).toString("hex")
}

function randomVerificationCode() {
  return String(crypto.randomInt(100000, 1000000))
}

function appUrl(req: NextApiRequest) {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL
  if (fromEnv) return fromEnv.replace(/\/+$/, "")
  const proto = (req.headers["x-forwarded-proto"] as string) || "http"
  const host = req.headers.host || "localhost:3000"
  return \`\${proto}://\${host}\`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SignupResponse>) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" })

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    const email = normalizeEmail(String(body?.email || ""))
    const password = String(body?.password || "")
    const name = String(body?.name || "")

    if (!email.includes("@")) return res.status(400).json({ ok: false, error: "Invalid email" })
    if (name.trim().length < 2) return res.status(400).json({ ok: false, error: "Name is required" })
    if (password.length < 8) return res.status(400).json({ ok: false, error: "Password must be at least 8 characters" })

    await ensureSchema()

    const exists = await dbQuery<{ id: string; email_verified_at: any }>(
      \`SELECT id, email_verified_at FROM app_user WHERE email = ? LIMIT 1;\`,
      [email]
    )
    if (exists.rows.length > 0) {
      return res.status(409).json({ ok: false, error: "Account already exists. Please sign in." })
    }

    const salt = crypto.randomBytes(16).toString("hex")
    const passwordHash = hashPassword(password, salt)
    const userId = crypto.randomUUID()

    await dbQuery(
      \`INSERT INTO app_user(id, email, name, password_salt, password_hash)
       VALUES (?, ?, ?, ?, ?);\`,
      [userId, email, name.trim(), salt, passwordHash]
    )

    const code = randomVerificationCode()
    const tokenHash = sha256(code)
    const tokenId = crypto.randomUUID()
    await dbQuery(
      \`INSERT INTO email_verification_token(id, user_id, token_hash, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE));\`,
      [tokenId, userId, tokenHash, VERIFY_CODE_TTL_MINUTES]
    )

    const verifyPage = \`\${appUrl(req)}/verify-email?email=\${encodeURIComponent(email)}\`
    await sendEmail({
      to: email,
      subject: "Verify your email",
      text:
        \`Your Sentinel verification code is:\n\n\${code}\n\n\` +
        \`Enter it here:\n\${verifyPage}\n\n\` +
        \`This code expires in \${VERIFY_CODE_TTL_MINUTES} minutes.\`,
    })

    return res.status(201).json({
      ok: false,
      requiresVerification: true,
      message: "Verification code sent. Check your inbox.",
    })
  } catch (err) {
    console.error("/api/auth/signup error:", err)
    const message =
      process.env.NODE_ENV !== "production" && err instanceof Error
        ? err.message
        : "Internal server error"
    return res.status(500).json({ ok: false, error: message })
  }
}