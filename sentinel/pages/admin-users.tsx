import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search, UserPlus, Shield, Users } from "lucide-react"

const mockUsers = [
  { name: "Sarah K.", email: "sarah@sentinel.demo", role: "Learner", team: "Ops", status: "Active" },
  { name: "Michael R.", email: "michael@sentinel.demo", role: "Learner", team: "Security", status: "Active" },
  { name: "Jessica W.", email: "jessica@sentinel.demo", role: "Manager", team: "Compliance", status: "Active" },
  { name: "David L.", email: "david@sentinel.demo", role: "Admin", team: "Platform", status: "Active" },
]

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockUsers
    return mockUsers.filter((u) => `${u.name} ${u.email} ${u.role} ${u.team}`.toLowerCase().includes(q))
  }, [query])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading users...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="User Management Locked"
        description="Start a demo session to preview user management, or sign in to continue."
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
            <h1 className="text-3xl font-black uppercase tracking-tighter">User Management</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Demo UI for inviting, grouping, and managing roles.
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
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Users
            </Button>
          </div>
        </header>

        <Card className="shadow-none">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Directory</CardTitle>
              <CardDescription className="text-xs">Filter by name, email, role, or team.</CardDescription>
            </div>
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-3 rounded-[10px] border border-white/10 bg-white/70 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-white/35 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
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
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map((row) => (
                    <tr key={row.email} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-white/80 dark:bg-white/10 border border-zinc-200/60 dark:border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-900 dark:text-white">
                            {row.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="text-sm font-bold">{row.name}</div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-muted-foreground">{row.email}</td>
                      <td className="p-4">
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            row.role === "Admin"
                              ? "border-[#7F77DD]/30 bg-[#7F77DD]/10 text-[#7F77DD]"
                              : row.role === "Manager"
                                ? "border-[#BA7517]/30 bg-[#BA7517]/10 text-[#BA7517]"
                                : "border-white/10 bg-white/60 dark:bg-white/5 text-muted-foreground"
                          )}
                        >
                          {row.role === "Admin" ? <Shield className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                          {row.role}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold">{row.team}</td>
                      <td className="p-4 text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1D9E75]">
                          {row.status}
                        </span>
                      </td>
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

           {/* Pagination Placeholder */}
            <div className="p-4 border-t flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Menampilkan 1-10 dari {filtered.length} anggota</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest" disabled>Prev</Button>
                <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest" disabled>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

