import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, CheckCircle2, ChevronRight } from "lucide-react"

const mockCourses = [
  { id: "1", title: "Risk Assessment Fundamentals" },
  { id: "2", title: "Neural Network Architecture" },
  { id: "3", title: "Industrial Safety Protocols" },
  { id: "4", title: "Data Ethics & Governance" },
]

const mockTeams = ["Operations", "Security", "Compliance", "Maintenance"]

export default function AdminAssignmentsPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [team, setTeam] = useState(mockTeams[0]!)
  const [course, setCourse] = useState(mockCourses[0]!)
  const [deadline, setDeadline] = useState("2026-03-20")
  const [required, setRequired] = useState(true)
  const [status, setStatus] = useState<"idle" | "done">("idle")

  const summary = useMemo(() => {
    return { team, course: course.title, deadline, required }
  }, [team, course, deadline, required])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading assignments...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Course Assignment Locked"
        description="Start a demo session to preview course assignments, or sign in to continue."
        onStartDemo={login}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Enterprise Admin
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Course Assignment</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Demo UI for assigning training to teams or individuals.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 font-black uppercase tracking-widest text-[10px]"
            onClick={() => router.push("/admin-dashboard")}
          >
            Back
          </Button>
        </header>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Assignment Builder</CardTitle>
            <CardDescription className="text-xs">
              Select a team, a course, and a deadline. Toggle required vs optional.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team</div>
                <div className="grid grid-cols-2 gap-2">
                  {mockTeams.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTeam(t)}
                      className={cn(
                        "px-3 py-2 rounded-[12px] border text-xs font-black uppercase tracking-widest transition-colors",
                        t === team
                          ? "border-[#7F77DD]/40 bg-[#7F77DD]/10 text-[#7F77DD]"
                          : "border-white/10 bg-white/70 dark:bg-white/[0.03] text-muted-foreground hover:border-[#7F77DD]/30"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course</div>
                <div className="space-y-2">
                  {mockCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCourse(c)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-[12px] border transition-colors",
                        c.id === course.id
                          ? "border-[#7F77DD]/40 bg-[#7F77DD]/10"
                          : "border-white/10 bg-white/70 dark:bg-white/[0.03] hover:border-[#7F77DD]/30"
                      )}
                    >
                      <div className={cn("text-sm font-bold", c.id === course.id ? "text-[#7F77DD]" : "text-zinc-900 dark:text-zinc-100")}>
                        {c.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-white/35 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Required</div>
                <button
                  onClick={() => setRequired((v) => !v)}
                  className={cn(
                    "w-full h-11 px-4 rounded-[12px] border flex items-center justify-between transition-colors",
                    required
                      ? "border-[#1D9E75]/30 bg-[#1D9E75]/10"
                      : "border-white/10 bg-white/70 dark:bg-white/[0.03]"
                  )}
                >
                  <div className="text-sm font-bold">{required ? "Required" : "Optional"}</div>
                  <div className={cn("text-[10px] font-black uppercase tracking-widest", required ? "text-[#1D9E75]" : "text-muted-foreground")}>
                    toggle
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-[14px] border border-white/10 bg-white/70 dark:bg-white/[0.03] p-4">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Summary
                </div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Assign <span className="font-black">{summary.course}</span> to{" "}
                  <span className="font-black">{summary.team}</span> by{" "}
                  <span className="font-black">{summary.deadline}</span>.
                </div>
              </div>
              <Button
                className="h-11 px-6 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
                onClick={() => setStatus("done")}
              >
                Assign
              </Button>
            </div>

            {status === "done" && (
              <div className="flex items-center justify-between rounded-[14px] border border-[#1D9E75]/30 bg-[#1D9E75]/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#1D9E75]/15 flex items-center justify-center text-[#1D9E75]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-bold text-[#1D9E75]">
                    Assignment created (demo).
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-[10px] font-black uppercase tracking-widest text-[#7F77DD]"
                  onClick={() => router.push("/admin-reports")}
                >
                  View Reports <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

