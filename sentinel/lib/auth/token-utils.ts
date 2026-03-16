import crypto from "node:crypto"

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url")
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex")
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

