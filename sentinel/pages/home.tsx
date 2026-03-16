import { useRouter } from "next/router"
import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { cn } from "@/lib/utils"
import { ShieldCheck, FileText, User, LogOut, LayoutDashboard } from "lucide-react"

function MenuCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <Card
      className={cn(
        "group cursor-pointer shadow-none",
        "border border-white/10 bg-white/60 dark:bg-white/5",
        "transition-all hover:-translate-y-0.5 hover:border-[#7F77DD]/50 hover:bg-white/80 dark:hover:bg-white/10",
        "hover:shadow-xl hover:shadow-[#7F77DD]/10"
      )}
      onClick={onClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick()
      }}
    >
      <CardContent className="p-8 space-y-4">
        <div className="h-14 w-14 rounded-[14px] bg-gradient-to-br from-[#7F77DD]/20 to-[#7F77DD]/5 text-[#7F77DD] flex items-center justify-center ring-1 ring-[#7F77DD]/10 group-hover:ring-[#7F77DD]/25">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="text-base font-black uppercase tracking-widest">{title}</div>
          <div className="text-base text-muted-foreground font-medium">{description}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { user, loading, login, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <LockedScreen title="Home Terkunci" onStartDemo={() => login()} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F9FAFB] dark:bg-zinc-950 p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/2 h-[30rem] w-[70rem] -translate-x-1/2 rounded-full bg-[#7F77DD]/20 dark:bg-[#7F77DD]/25 blur-3xl" />
        <div className="absolute top-28 -left-44 h-[26rem] w-[26rem] rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-44 h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 dark:bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-0 [background-image:linear-gradient(to_right,rgba(0,0,0,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.25)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_75%)]" />
        <div className="absolute inset-0 opacity-0 dark:opacity-[0.09] [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_75%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto pt-14 space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Home
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic">
              Selamat Datang, {user.name}.
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Pilih menu untuk melanjutkan.
            </p>
          </div>

          <Button
            className="h-12 px-6 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MenuCard
            title="Profil"
            description="Lihat data sesi"
            icon={<User className="h-6 w-6" />}
            onClick={() => router.push("/profile")}
          />
          <MenuCard
            title="Persetujuan"
            description="Atur consent"
            icon={<ShieldCheck className="h-6 w-6" />}
            onClick={() => router.push("/persetujuan")}
          />
          <MenuCard
            title="Syarat & Ketentuan"
            description="Baca ketentuan"
            icon={<FileText className="h-6 w-6" />}
            onClick={() => router.push("/terms")}
          />
          <MenuCard
            title="Logout"
            description="Keluar dari sesi"
            icon={<LogOut className="h-6 w-6" />}
            onClick={() => logout()}
          />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-white/10 bg-white/70 dark:bg-white/5 shadow-none">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Next Step
                  </div>
                  <div className="text-2xl font-black uppercase tracking-tighter italic">
                    Lengkapi Persetujuan
                  </div>
                  <p className="text-base text-muted-foreground font-medium">
                    Atur preferensi consent untuk Marketing, Bio Metrik, dan Data Anak.
                  </p>
                </div>
                <Button
                  className="h-12 px-6 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
                  onClick={() => router.push("/persetujuan")}
                >
                  Buka Persetujuan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/70 dark:bg-white/5 shadow-none">
            <CardContent className="p-8 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Signed In
              </div>
              <div className="text-base font-semibold text-muted-foreground">Email</div>
              <div className="text-lg font-black tracking-tight break-all">{user.email}</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
