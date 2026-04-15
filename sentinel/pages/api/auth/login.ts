import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "node:crypto"
import { ensureSchema, dbQuery } from "@/lib/db/pool"
import { normalizeEmail, randomToken, sha256 } from "@/lib/auth/token-utils"
import { sendEmail } from "@/lib/email/mailer"

type LoginResponse =
  | { ok: true; token: string; user: { id: string; email: string; name: string } }
  | { ok: false; requiresVerification: true; message: string }
  | { ok: false; error: string }

const DEMO_EMAIL = "almira@gmail.com"
const DEMO_PASSWORD = "Almira"
const VERIFY_CODE_TTL_MINUTES = 15

function randomVerificationCode() {
  return String(crypto.randomInt(100000, 1000000))
}

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 32).toString("hex")
}

function appUrl(req: NextApiRequest) {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL
  if (fromEnv) return fromEnv.replace(/\/+$/, "")
  const proto = (req.headers["x-forwarded-proto"] as string) || "http"
  const host = req.headers.host || "localhost:3000"
  return \`\${proto}://\${host}\`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" })

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    const emailRaw = String(body?.email || "")
    const password = String(body?.password || "")
    const name = String(body?.name || "User")

    const email = normalizeEmail(emailRaw)
    if (!email.includes("@")) return res.status(400).json({ ok: false, error: "Invalid email" })
    if (password.length < 1) return res.status(400).json({ ok: false, error: "Missing password" })

    await ensureSchema()

    const isDemo = email === DEMO_EMAIL && password === DEMO_PASSWORD

    const existing = await dbQuery<{
      id: string
      email: string
      name: string | null
      password_salt: string | null
      password_hash: string | null
      email_verified_at: any
    }>(
      \`SELECT id, email, name, password_salt, password_hash, email_verified_at
       FROM app_user
       WHERE email = ?
       LIMIT 1;\`,
      [email]
    )

    let userId: string
    let userName: string
    let verifiedNow = false

    if (existing.rows.length === 0) {
      if (!isDemo) {
        return res.status(404).json({ ok: false, error: "Account not found. Please sign up first." })
      }

      const salt = crypto.randomBytes(16).toString("hex")
      const passwordHash = hashPassword(password, salt)
      userId = crypto.randomUUID()
      userName = name

      await dbQuery(
        \`INSERT INTO app_user(id, email, name, password_salt, password_hash, email_verified_at)
         VALUES (?, ?, ?, ?, ?, NOW());\`,
        [userId, email, userName, salt, passwordHash]
      )

      verifiedNow = true
    } else {
      const u = existing.rows[0]!
      userId = u.id
      userName = u.name || name

      if (!u.password_salt || !u.password_hash) {
        return res.status(400).json({ ok: false, error: "Password not set for this account" })
      }

      const computed = hashPassword(password, u.password_salt)
      const ok = crypto.timingSafeEqual(
        Buffer.from(computed, "hex"),
        Buffer.from(u.password_hash, "hex")
      )
      if (!ok) return res.status(401).json({ ok: false, error: "Invalid email or password" })

      if (!u.email_verified_at && isDemo) {
        await dbQuery(\`UPDATE app_user SET email_verified_at = NOW() WHERE id = ?;\`, [userId])
        verifiedNow = true
      } else {
        verifiedNow = Boolean(u.email_verified_at)
      }
    }

    if (!verifiedNow) {
      const code = randomVerificationCode()
      const tokenHash = sha256(code)
      const tokenId = crypto.randomUUID()
      await dbQuery(
        \`INSERT INTO email_verification_token(id, user_id, token_hash, expires_at)
         VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE));\`,
        [tokenId, userId, tokenHash, VERIFY_CODE_TTL_MINUTES]
      )

      const link = \`\${appUrl(req)}/verify-email?email=\${encodeURIComponent(email)}\`
      await sendEmail({
        to: email,
        subject: "Verify your email",
        text:
          \`Your Sentinel verification code is:\n\n\${code}\n\n\` +
          \`Enter it here:\n\${link}\n\n\` +
          \`This code expires in \${VERIFY_CODE_TTL_MINUTES} minutes.\`,
      })

      return res.status(202).json({
        ok: false,
        requiresVerification: true,
        message: "Verification email sent. Check your inbox.",
      })
    }

    const sessionToken = randomToken(32)
    const sessionHash = sha256(sessionToken)
    const sessionId = crypto.randomUUID()
    await dbQuery(
      \`INSERT INTO app_session(id, user_id, token_hash, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY));\`,
      [sessionId, userId, sessionHash]
    )

    return res.status(200).json({
      ok: true,
      token: sessionToken,
      user: { id: userId, email, name: userName },
    })
  } catch (err) {
    console.error("/api/auth/login error:", err)
    const message =
      process.env.NODE_ENV !== "production" && err instanceof Error
        ? err.message
        : "Internal server error"
    return res.status(500).json({ ok: false, error: message })
  }
}