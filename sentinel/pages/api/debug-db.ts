import type { NextApiRequest, NextApiResponse } from "next"
import { getDatabaseDebugInfo, dbQuery } from "@/lib/db/pool"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const info = getDatabaseDebugInfo()

  try {
    await dbQuery("SELECT 1 AS ok")
    return res.status(200).json({ connected: true, config: info })
  } catch (err) {
    return res.status(200).json({
      connected: false,
      config: info,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
