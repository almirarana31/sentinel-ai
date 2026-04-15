import type { NextApiRequest } from "next"
import { dbQuery, ensureSchema } from "@/lib/db/pool"
import { sha256 } from "@/lib/auth/token-utils"

export type AppRole = "admin" | "user"

export type SessionUser = {
  id: string
  email: string
  name: string | null
  role: AppRole
}

export function bearerToken(req: NextApiRequest) {
  const header = req.headers.authorization || ""
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1] || ""
}

export async function getSessionUser(req: NextApiRequest) {
  const token = bearerToken(req)
  if (!token) return null

  await ensureSchema()

  const result = await dbQuery<SessionUser>(
    `
      SELECT u.id, u.email, u.name, u.role
      FROM app_session s
      INNER JOIN app_user u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.expires_at > NOW()
      ORDER BY s.created_at DESC
      LIMIT 1;
    `,
    [sha256(token)]
  )

  return result.rows[0] ?? null
}