import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, FileText, LogOut, LayoutGrid, Search, Users } from "lucide-react"

const profileSelectors = [
  { id: 1, name: "Almira S.", role: "Ketua", status: "Online" },
  { id: 2, name: "Budi H.", role: "Sekretaris", status: "Offline" },
  { id: 3, name: "Citra D.", role: "Bendahara", status: "Away" },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, loading, login, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <LockedScreen title="Profile Terkunci" onStartDemo={login} />
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto pt-10 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic">
            Profil
          </h1>
          <p className="text-muted-foreground font-medium">
            Data sesi (email, nama) dan menu navigasi.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Email
              </div>
              <div className="text-sm font-bold">{user.email}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Nama
              </div>
              <div className="text-sm font-bold">{user.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Bearer Token (Demo)
              </div>
              <div className="text-xs font-bold break-all text-muted-foreground">
                {token ? `Bearer ${token}` : "—"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button variant="ghost" onClick={() => router.push("/home")} className="justify-start gap-2">
                <LayoutGrid className="h-4 w-4" /> Home
              </Button>
              <Button variant="primary" onClick={() => router.push("/persetujuan")} className="justify-start gap-2">
                <ShieldCheck className="h-4 w-4" /> Persetujuan
              </Button>
              <Button variant="ghost" onClick={() => router.push("/terms")} className="justify-start gap-2">
                <FileText className="h-4 w-4" /> Syarat & Ketentuan
              </Button>
              <Button variant="outline" onClick={() => logout()} className="justify-start gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


ctor Table */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Pilih Profil</CardTitle>
              <CardDescription className="text-xs">Ganti profil untuk simulasi behavior berbeda.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input 
                placeholder="Cari..." 
                className="h-8 pl-7 pr-3 rounded-[8px] border border-white/10 bg-white/5 text-[10px] outline-none w-40" 
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t divide-y">
              {profileSelectors.map((p) => (
                <div key={p.id} className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-[#7F77DD] transition-colors">
                      {p.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none mb-1">{p.name}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{p.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full animate-pulse",
                      p.status === "Online" ? "bg-[#1D9E75]" : p.status === "Away" ? "bg-[#BA7517]" : "bg-muted-foreground"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


