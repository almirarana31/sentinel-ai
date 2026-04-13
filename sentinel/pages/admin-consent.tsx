import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { readConsentAudit, writeConsentAudit, ConsentAuditEntry } from "@/lib/consent-audit"
import { cn } from "@/lib/utils"

type ConsentLatestRow = {
  key: string
  name: string
  email: string
  updatedAt: string
  codeCollectionPoint?: string
  marketing: boolean
  biometrics: boolean
  childData: boolean
  source: ConsentAuditEntry["source"]
}

function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString()
}

export default function AdminConsentPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [entries, setEntries] = useState<ConsentAuditEntry[]>([])
  const [dbRows, setDbRows] = useState<ConsentLatestRow[]>([])
  const [dbError, setDbError] = useState<string>("")
  const [query, setQuery] = useState("")

  const refresh = () => {
    setEntries(readConsentAudit().slice().reverse())
    fetch("/api/admin/consents")
      .then((r) => r.json())
      .then((data: any) => {
        if (!data?.ok) {
          setDbError(data?.error || "Failed to load DB consents")
          setDbRows([])
          return
        }
        setDbError("")
        const rows = (data.rows as any[]).map((r) => {
          const consents = Array.isArray(r?.payload?.consents) ? r.payload.consents : []
          const findAgree = (code: string) => {
            const item = consents.find((c: any) => c?.code_consent === code)
            return Boolean(item?.is_agree)
          }
          return {
            key: r.email,
            name: r.name || "Unknown",
            email: r.email || "—",
            updatedAt: r.created_at || "",
            codeCollectionPoint: r.code_collection_point,
            marketing: findAgree("MARKETING"),
            biometrics: findAgree("BIO_METRIK"),
            childData: findAgree("DATA_ANAK"),
            source: "persetujuan" as const,
          } satisfies ConsentLatestRow
        })
        setDbRows(rows)
      })
      .catch((e) => {
        setDbError(e instanceof Error ? e.message : "Failed to load DB consents")
        setDbRows([])
      })
  }

  useEffect(() => {
    refresh()
  }, [])

  const latestRows = useMemo<ConsentLatestRow[]>(() => {
    const byKey = new Map<string, ConsentAuditEntry>()
    for (const entry of entries.slice().reverse()) {
      const key = entry.actor?.email ?? entry.actor?.id ?? "anonymous"
      if (!byKey.has(key)) byKey.set(key, entry)
    }
    const rows: ConsentLatestRow[] = []
    byKey.forEach((entry, key) => {
      rows.push({
        key,
        name: entry.actor?.name ?? "Unknown",
        email: entry.actor?.email ?? "—",
        updatedAt: entry.updatedAt,
        marketing: entry.preferences.marketing,
        biometrics: entry.preferences.biometrics,
        childData: entry.preferences.childData,
        source: entry.source,
      })
    })
    rows.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    return rows
  }, [entries])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = dbRows.length > 0 ? dbRows : latestRows
    if (!q) return base
    return base.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q)
      )
    })
  }, [latestRows, dbRows, query])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading consent admin...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Admin Consent Locked"
        description="Start a demo session to view consent records, or sign in to continue."
        onStartDemo={login}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Consent Management</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Demo admin view (local browser data). Showing latest consent per user.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="font-bold uppercase tracking-widest text-xs h-10 border-white/15" onClick={() => router.push("/admin-dashboard")}>
              Back to Admin
            </Button>
            <Button variant="outline" className="font-bold uppercase tracking-widest text-xs h-10 border-white/15" onClick={refresh}>
              Refresh
            </Button>
            <Button
              variant="outline"
              className="font-bold uppercase tracking-widest text-xs h-10 border-white/15"
              onClick={() => {
                writeConsentAudit([])
                refresh()
              }}
            >
              Clear Log
            </Button>
          </div>
        </header>

        <Card className="shadow-none">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Consents</CardTitle>
              <CardDescription className="text-xs">
                Loads from Postgres if available; otherwise falls back to local browser audit log.
              </CardDescription>
            </div>
            <div className="w-full md:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name/email/source..."
                className="w-full h-10 px-3 rounded-[10px] border border-white/10 bg-white/70 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-white/35 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto border-t">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/60 dark:bg-white/5 border-b border-white/10">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Marketing</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Biometrik</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Data Anak</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Updated</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Collection</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.length === 0 ? (
                    <tr>
                      <td className="p-6 text-sm text-muted-foreground font-medium" colSpan={8}>
                        {dbError
                          ? `DB not available: ${dbError}`
                          : "No consent records yet. Complete Persetujuan to generate entries."}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.key} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="text-xs font-bold">{row.name}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {row.key === "anonymous" ? "Anonymous" : row.key}
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold">{row.email}</td>
                        <td className="p-4 text-center">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", row.marketing ? "text-[#1D9E75]" : "text-[#E24B4A]")}>
                            {row.marketing ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", row.biometrics ? "text-[#1D9E75]" : "text-[#E24B4A]")}>
                            {row.biometrics ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", row.childData ? "text-[#1D9E75]" : "text-[#E24B4A]")}>
                            {row.childData ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-muted-foreground">{formatDate(row.updatedAt)}</td>
                        <td className="p-4 text-xs font-bold text-muted-foreground">{row.codeCollectionPoint ?? "—"}</td>
                        <td className="p-4 text-xs font-bold">{row.source}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
