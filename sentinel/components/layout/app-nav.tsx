import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import {
  Award,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Gamepad2,
  LayoutGrid,
  Library,
  LogOut,
  Menu,
  Play,
  Route,
  ShieldCheck,
  Trophy,
  User,
  X,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { PageBackButton } from "@/components/navigation/page-back-button"
import { cn } from "@/lib/utils"

type AppLink = {
  href: string
  label: string
  icon: typeof LayoutGrid
  section: "Learn" | "Progress" | "Workspace"
  matchPaths?: string[]
}

const appLinks: AppLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid, section: "Learn" },
  { href: "/learning-path", label: "Path", icon: Route, section: "Learn" },
  {
    href: "/my-courses",
    label: "Courses",
    icon: BookOpen,
    section: "Learn",
    matchPaths: ["/course-overview", "/assessment"],
  },
  { href: "/games", label: "Games", icon: Gamepad2, section: "Learn" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, section: "Progress" },
  { href: "/achievements", label: "Achievements", icon: Award, section: "Progress" },
  { href: "/certifications", label: "Certs", icon: ShieldCheck, section: "Progress" },
  {
    href: "/admin-dashboard",
    label: "Admin",
    icon: Building2,
    section: "Workspace",
    matchPaths: ["/admin-users", "/admin-assignments", "/admin-reports", "/admin-analytics", "/admin-library", "/admin-consent"],
  },
  { href: "/catalog", label: "Catalog", icon: Library, section: "Workspace" },
]

const navSections: AppLink["section"][] = ["Learn", "Progress", "Workspace"]

type AppNavProps = {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function AppNav({ collapsed, onToggleCollapse }: AppNavProps) {
  const router = useRouter()
  const { user, login, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const mobileRef = useRef<HTMLDivElement | null>(null)

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
    if (!mobileOpen) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (target && mobileRef.current && !mobileRef.current.contains(target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [mobileOpen])

  useEffect(() => {
    const close = () => setMenuOpen(false)
    router.events.on("routeChangeStart", close)
    return () => router.events.off("routeChangeStart", close)
  }, [router.events])

  useEffect(() => {
    const close = () => setMobileOpen(false)
    router.events.on("routeChangeStart", close)
    return () => router.events.off("routeChangeStart", close)
  }, [router.events])

  const accountLinks = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/persetujuan", label: "Persetujuan", icon: ShieldCheck },
    { href: "/terms", label: "Terms", icon: Route },
  ]

  const desktopWidthClass = collapsed ? "md:w-24" : "md:w-72"
  const visibleAppLinks = appLinks.filter((item) => item.href !== "/admin-dashboard" || user?.role === "admin")
  const isActiveRoute = (item: AppLink) => {
    if (router.pathname === item.href) return true
    return item.matchPaths?.includes(router.pathname) ?? false
  }

  const renderNavLinks = (mode: "desktop" | "mobile") =>
    navSections.map((section) => {
      const items = visibleAppLinks.filter((item) => item.section === section)
      if (!items.length) return null

      return (
        <div key={section} className={cn("space-y-2", mode === "desktop" && collapsed && "flex flex-col items-center")}>
          {mode === "desktop" && !collapsed ? (
            <div className="px-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              {section}
            </div>
          ) : null}

          {mode === "desktop" && collapsed ? <div className="h-px w-8 bg-white/10 my-1" /> : null}

          {items.map((item) => {
            const active = isActiveRoute(item)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={mode === "desktop" && collapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center rounded-[14px] border transition-colors",
                  mode === "desktop" && collapsed ? "justify-center h-12 w-12 px-0" : "gap-3 h-12 px-4",
                  active
                    ? "border-[#7F77DD]/35 bg-[#7F77DD]/12 text-white shadow-[0_0_0_1px_rgba(127,119,221,0.1)]"
                    : "border-transparent text-white/60 hover:text-white hover:border-white/10 hover:bg-white/[0.05]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {(mode !== "desktop" || !collapsed) && (
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>
      )
    })

  return (
    <>
      <header className="md:hidden fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-md">
        <div className="h-14 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PageBackButton
              fallbackHref="/dashboard"
              label="Back"
              size="icon"
              showLabel={false}
              variant="ghost"
              className="h-9 w-9 rounded-[10px] border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white"
            />
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="h-9 w-9 rounded-[10px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center justify-center"
            >
              <Menu className="h-4 w-4 text-white/80" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[10px] bg-[#7F77DD] shadow-lg shadow-[#7F77DD]/20 flex items-center justify-center">
                <span className="text-white font-black italic">S</span>
              </div>
              <span className="font-black tracking-tight uppercase italic text-sm text-white/90">
                Sentinel
              </span>
            </Link>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-[10px] hover:bg-white/5 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/85">
                {user.avatar}
              </div>
            </button>
          ) : (
            <Button
              size="sm"
              onClick={() => login()}
              className="h-9 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#7F77DD]/20"
            >
              Start Demo
            </Button>
          )}
        </div>
      </header>

      <aside
        className={cn(
          "hidden md:block shrink-0 self-stretch border-r border-white/10 bg-black/45 backdrop-blur-xl transition-[width] duration-300 overflow-hidden relative",
          desktopWidthClass
        )}
      >
        <div className="flex h-full min-h-screen w-full flex-col p-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(320px_circle_at_20%_0%,rgba(127,119,221,0.18),transparent_58%),radial-gradient(260px_circle_at_80%_10%,rgba(16,185,129,0.10),transparent_55%)]" />
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-3")}>
            <Link href="/" className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              <div className="h-10 w-10 rounded-[12px] bg-[#7F77DD] shadow-lg shadow-[#7F77DD]/20 flex items-center justify-center shrink-0">
                <span className="text-white font-black italic">S</span>
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="font-black tracking-tight uppercase italic text-sm text-white/90">Sentinel</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Workspace</div>
                </div>
              )}
            </Link>

            {!collapsed && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                className="h-10 w-10 rounded-[12px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center justify-center"
              >
                <ChevronsLeft className="h-4 w-4 text-white/75" />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="mt-4 h-10 w-10 self-center rounded-[12px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center justify-center"
            >
              <ChevronsRight className="h-4 w-4 text-white/75" />
            </button>
          )}

          <PageBackButton
            fallbackHref="/dashboard"
            label="Back"
            size={collapsed ? "icon" : "sm"}
            showLabel={!collapsed}
            className={cn(
              "mt-4 w-full border-white/10 bg-white/[0.03] text-white/75 hover:border-white/15 hover:bg-white/[0.06] hover:text-white",
              collapsed && "mx-auto w-10"
            )}
          />

          {user && (
            <div
              className={cn(
                "mt-6 rounded-[18px] border border-white/10 bg-white/[0.04]",
                collapsed ? "p-2 flex justify-center" : "p-4"
              )}
            >
              {collapsed ? (
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/85">
                  {user.avatar}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-black text-white/85">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-widest text-white/85 truncate">{user.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Lvl {user.level}</div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
                        user.role === "admin"
                          ? "border-[#BA7517]/30 bg-[#BA7517]/10 text-[#BA7517]"
                          : "border-white/10 bg-white/[0.04] text-white/55"
                      )}>
                        {user.role}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!collapsed && user && (
            <div className="mt-5 rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">Quick Start</div>
              <div className="mt-2 text-sm font-semibold text-white/80">
                Jump back into courses or open a faster practice drill.
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  className="h-10 text-[10px] font-black uppercase tracking-widest"
                  onClick={() => router.push("/my-courses")}
                >
                  Resume
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 text-[10px] font-black uppercase tracking-widest"
                  onClick={() => router.push("/games")}
                >
                  Drill <Play className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          <nav className="mt-6 flex flex-1 min-h-0 flex-col overflow-y-auto pr-1">
            <div className={cn("flex flex-1 flex-col gap-4 pb-4", !collapsed && "justify-between")}>
              {renderNavLinks("desktop")}
            </div>
          </nav>

          <div className="mt-auto pt-4 border-t border-white/10">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={cn(
                    "w-full rounded-[14px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors",
                    collapsed ? "h-12 flex items-center justify-center" : "px-4 py-3 flex items-center justify-between gap-3"
                  )}
                >
                  <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/85">
                      {user.avatar}
                    </div>
                    {!collapsed && (
                      <div className="text-left min-w-0">
                        <div className="text-[11px] font-black uppercase tracking-widest text-white/85 truncate">
                          Account
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] font-bold text-white/45 truncate">{user.email}</div>
                          <div className={cn(
                            "px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest shrink-0",
                            user.role === "admin"
                              ? "border-[#BA7517]/30 bg-[#BA7517]/10 text-[#BA7517]"
                              : "border-white/10 bg-white/[0.04] text-white/55"
                          )}>
                            {user.role}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!collapsed && <ChevronDown className="h-4 w-4 text-white/55" />}
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className={cn(
                      "absolute bottom-16 rounded-[14px] border border-white/10 bg-black/75 backdrop-blur-md shadow-2xl overflow-hidden",
                      collapsed ? "left-16 w-56" : "left-0 right-0"
                    )}
                  >
                    <div className="p-2 space-y-1">
                      {accountLinks.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className={cn(
                    "flex items-center rounded-[14px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-white/75",
                    collapsed ? "justify-center h-12" : "gap-3 px-4 h-12"
                  )}
                >
                  <User className="h-4 w-4" />
                  {!collapsed && <span className="text-[11px] font-black uppercase tracking-widest">Login</span>}
                </Link>
                <Button
                  onClick={() => login()}
                  className={cn(
                    "w-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#7F77DD]/20",
                    collapsed ? "h-12 px-0" : "h-12"
                  )}
                >
                  {collapsed ? "Go" : "Start Demo"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50" ref={mobileRef}>
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[88vw] max-w-sm border-r border-white/10 bg-black/85 backdrop-blur-xl p-4 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-[#7F77DD] shadow-lg shadow-[#7F77DD]/20 flex items-center justify-center">
                  <span className="text-white font-black italic">S</span>
                </div>
                <div>
                  <div className="font-black tracking-tight uppercase italic text-sm text-white/90">Sentinel</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Workspace</div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-10 w-10 rounded-[12px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4 text-white/80" />
              </button>
            </div>

            {user && (
              <div className="mt-6 rounded-[18px] border border-white/10 bg-white/[0.04] p-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-black text-white/85">
                  {user.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest text-white/85 truncate">{user.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Lvl {user.level}</div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
                      user.role === "admin"
                        ? "border-[#BA7517]/30 bg-[#BA7517]/10 text-[#BA7517]"
                        : "border-white/10 bg-white/[0.04] text-white/55"
                    )}>
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <nav className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
              {renderNavLinks("mobile")}
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-2">
              {user ? (
                <>
                  {accountLinks.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 h-12 px-4 rounded-[14px] border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08] transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                      </Link>
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 h-12 px-4 rounded-[14px] border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 h-12 px-4 rounded-[14px] border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Login</span>
                  </Link>
                  <Button
                    onClick={() => login()}
                    className="w-full h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#7F77DD]/20"
                  >
                    Start Demo
                  </Button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
