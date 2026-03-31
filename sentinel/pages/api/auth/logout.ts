import type { NextApiRequest, NextApiResponse } from "next"
import { ensureSchema, dbQuery } from "@/lib/db/pool"
import { sha256 } from "@/lib/auth/token-utils"

type LogoutResponse = { ok: true } | { ok: false; error: string }

function bearerToken(req: NextApiRequest) {
  const header = req.headers.authorization || ""
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1] || ""
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<LogoutResponse>) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" })

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    const token = bearerToken(req) || String(body?.token || "")
    if (!token) return res.status(400).json({ ok: false, error: "Missing session token" })

    await ensureSchema()

    await dbQuery(`DELETE FROM app_session WHERE token_hash = $1;`, [sha256(token)])

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("/api/auth/logout error:", err)
    const message =
      process.env.NODE_ENV !== "production" && err instanceof Error
        ? err.message
        : "Internal server error"
    return res.status(500).json({ ok: false, error: message })
  }
}
