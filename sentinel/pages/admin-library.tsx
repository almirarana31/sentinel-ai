import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { AdminOnlyScreen } from "@/components/auth/admin-only-screen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload, Search, FileText, Video } from "lucide-react"

const mockLibrary = [
  { id: "c1", title: "Risk Assessment Fundamentals", type: "Course", updated: "2d ago" },
  { id: "c2", title: "Industrial Safety Protocols", type: "Course", updated: "1w ago" },
  { id: "v1", title: "Lockout/Tagout Walkthrough", type: "Video", updated: "3d ago" },
  { id: "d1", title: "Emergency Escalation SOP", type: "Document", updated: "5d ago" },
]

export default function AdminLibraryPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockLibrary
    return mockLibrary.filter((i) => `${i.title} ${i.type}`.toLowerCase().includes(q))
  }, [query])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading library...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Content Library Locked"
        description="Start a demo session to preview the content library, or sign in to continue."
        onStartDemo={login}
      />
    )
  }

  if (user.role !== "admin") {
    return (
      <AdminOnlyScreen
        title="Content Library Locked"
        description="Only admins can manage the shared content library."
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
            <h1 className="text-3xl font-black uppercase tracking-tighter">Content Library</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Demo UI for course uploads, documents, and media assets.
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
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 shadow-none">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Assets</CardTitle>
                <CardDescription className="text-xs">Search and manage content (demo-only).</CardDescription>
              </div>
              <div className="w-full md:w-80 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search assets..."
                  className="w-full h-10 pl-10 pr-3 rounded-[10px] border border-white/10 bg-white/70 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-white/35 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t">
                {filtered.map((item) => {
                  const Icon = item.type === "Video" ? Video : FileText
                  return (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-[12px] border flex items-center justify-center",
                            item.type === "Video"
                              ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                              : item.type === "Document"
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                                : "border-[#7F77DD]/20 bg-[#7F77DD]/10 text-[#7F77DD]"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{item.title}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {item.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Updated {item.updated}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-none">
              <CardContent className="p-6 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Quick Actions
                </div>
                <Button className="w-full h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#7F77DD]/20">
                  Create Course
                </Button>
                <Button variant="outline" className="w-full h-10 font-black uppercase tracking-widest text-[10px]">
                  Upload Document
                </Button>
                <Button variant="outline" className="w-full h-10 font-black uppercase tracking-widest text-[10px]">
                  Upload Video
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Tip
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  In production, this area would include editing, versioning, and SCORM imports.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
