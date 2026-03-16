import { ConsentPreferences, ConsentState } from "@/lib/consent-context"

export type ConsentAuditActor = {
  id?: string
  email?: string
  name?: string
}

export type ConsentAuditEntry = {
  id: string
  actor: ConsentAuditActor | null
  preferences: ConsentPreferences
  updatedAt: string
  source: "banner" | "settings" | "persetujuan" | "unknown" | "reset"
  consentVersion: ConsentState["version"]
}

const STORAGE_KEY = "sentinel_consent_audit_v1"
const MAX_ENTRIES = 500

function uuid() {
  const cryptoObj = globalThis.crypto as Crypto | undefined
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID()
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function safeParse(raw: string | null): ConsentAuditEntry[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(Boolean) as ConsentAuditEntry[]
  } catch {
    return []
  }
}

export function readConsentAudit(): ConsentAuditEntry[] {
  return safeParse(localStorage.getItem(STORAGE_KEY))
}

export function writeConsentAudit(entries: ConsentAuditEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)))
}

export function appendConsentAudit(entry: Omit<ConsentAuditEntry, "id">) {
  const entries = readConsentAudit()
  const next: ConsentAuditEntry = { id: uuid(), ...entry }
  writeConsentAudit([...entries, next])
  return next
}

