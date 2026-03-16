import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, Calendar } from "lucide-react"

const teams = ["Operations", "Security", "Compliance", "Maintenance"]
const courses = ["Risk Assessment", "Safety Protocols", "Data Governance", "Neural Architecture"]

function statusColor(s: string) {
  if (s === "Done") return "bg-[#1D9E75]/10 text-[#1D9E75] border-[#1D9E75]/30"
  if (s === "Overdue") return "bg-[#E24B4A]/10 text-[#E24B4A] border-[#E24B4A]/30"
  if (s === "In Progress") return "bg-[#BA7517]/10 text-[#BA7517] border-[#BA7517]/30"
  return "bg-white/70 dark:bg-white/5 text-muted-foreground border-white/10"
}

export default function AdminReportsPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [from, setFrom] = useState("2026-03-01")
  const [to, setTo] = useState("2026-03-31")

  const matrix = useMemo(() => {
    const status = ["Done", "In Progress", "Assigned", "Overdue"]
    return teams.map((t, ti) => ({
      team: t,
      cells: courses.map((_, ci) => status[(ti + ci) % status.length]!),
    }))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading reports...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Compliance Reports Locked"
        description="Start a demo session to preview compliance reports, or sign in to continue."
        onStartDemo={login}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Enterprise Admin
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Compliance Reports</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Demo UI for completion matrix, date filtering, and export actions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 font-black uppercase tracking-widest text-[10px]"
              onClick={() => router.push("/admin-dashboard")}
            >
              Back
            </Button>
            <Button className="h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#7F77DD]/20">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </header>

        <Card className="shadow-none">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Date Range</CardTitle>
              <CardDescription className="text-xs">Filter report results (demo-only).</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="h-10 pl-10 pr-3 rounded-[10px] border border-white/10 bg-white/70 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-white/35 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="h-10 pl-10 pr-3 rounded-[10px] border border-white/10 bg-white/70 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-white/35 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center">
                {from} → {to}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto border-t">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/60 dark:bg-white/5 border-b border-white/10">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team</th>
                    {courses.map((c) => (
                      <th
                        key={c}
                        className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {matrix.map((row) => (
                    <tr key={row.team} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm font-bold">{row.team}</td>
                      {row.cells.map((s, idx) => (
                        <td key={idx} className="p-4 text-center">
                          <span
                            className={cn(
                              "inline-flex px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                              statusColor(s)
                            )}
                          >
                            {s}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

