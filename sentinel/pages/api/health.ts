import type { NextApiRequest, NextApiResponse } from "next"
import { getPool } from "@/lib/db/pool"

type HealthResponse =
  | {
      ok: true
      database: "connected"
      timestamp: string
    }
  | {
      ok: false
      database: "error"
      error: string
      timestamp: string
    }

export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      database: "error",
      error: "Method not allowed",
      timestamp: new Date().toISOString(),
    })
  }

  try {
    await getPool().query("SELECT 1;")
    return res.status(200).json({
      ok: true,
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed"
    return res.status(500).json({
      ok: false,
      database: "error",
      error: message,
      timestamp: new Date().toISOString(),
    })
  }
}
