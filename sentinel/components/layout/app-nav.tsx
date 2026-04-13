import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { LayoutGrid, Route, BookOpen, Trophy, Award, ShieldCheck, ChevronDown, LogOut, User, Building2, Library } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const appLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/learning-path", label: "Path", icon: Route },
  { href: "/my-courses", label: "Courses", icon: BookOpen },
  { href: "/course-overview", label: "Overview", icon: BookOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/achievements", label: "Achievements", icon: Award },
  { href: "/certifications", label: "Certs", icon: ShieldCheck },
  { href: "/admin-dashboard", label: "Admin", icon: Building2 },
  { href: "/catalog", label: "Catalog", icon: Library },
]

export function AppNav() {
  const router = useRouter()
  const { user, login, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (target && menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [menuOpen])

  useEffect(() => {
    const close = () => setMenuOpen(false)
    router.events.on("routeChangeStart", close)
    return () => router.events.off("routeChangeStart", close)
  }, [router.events])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-[10px] bg-[#7F77DD] shadow-lg shadow-[#7F77DD]/20 flex items-center justify-center">
              <span className="text-white font-black italic">S</span>
            </div>
            <span className="font-black tracking-tight uppercase italic text-sm text-white/90">
              Sentinel
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {appLinks.map((item) => {
              const active = router.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors",
                    active
                      ? "bg-white/6 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-white px-3 py-2 rounded-[10px] hover:bg-white/5"
                >
                  Login
                </Link>
                <Button
                  size="sm"
                  onClick={() => login()}
                  className="h-9 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#7F77DD]/20"
                >
                  Start Demo
                </Button>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/85">
                    {user.avatar}
                  </div>
                  <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                    Lvl {user.level}
                  </div>
                </div>
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-[10px] hover:bg-white/5 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/85">
                      {user.avatar}
                    </div>
                    <ChevronDown className="h-4 w-4 text-white/55" />
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-64 rounded-[12px] border border-white/10 bg-black/55 backdrop-blur-md shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-xs font-black uppercase tracking-widest text-white/80">
                          {user.name}
                        </div>
                        <div className="text-xs font-bold text-white/55">
                          {user.email}
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link
                          href="/profile"
                          role="menuitem"
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest transition-colors",
                            "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/persetujuan"
                          role="menuitem"
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest transition-colors",
                            "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Persetujuan
                        </Link>
                        <Link
                          href="/terms"
                          role="menuitem"
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest transition-colors",
                            "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <Route className="h-4 w-4" />
                          Syarat & Ketentuan
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => logout()}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest transition-colors text-left",
                            "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
