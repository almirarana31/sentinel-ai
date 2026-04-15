import { useMemo } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Sparkles, ChevronRight, ShieldCheck, BookOpen } from "lucide-react"

const mockCourses = [
  {
    id: "1",
    title: "Risk Assessment Fundamentals",
    category: "Compliance",
    estTime: "2h 45m",
    xp: 1200,
    prerequisites: ["Basic safety orientation", "Company policy overview"],
    syllabus: [
      "Threat modeling basics",
      "Risk scoring frameworks",
      "Incident response playbook",
      "Case study: near-miss analysis",
      "Knowledge check + reflection",
    ],
  },
  {
    id: "2",
    title: "Neural Network Architecture",
    category: "AI & ML",
    estTime: "4h 10m",
    xp: 2500,
    prerequisites: ["Python fundamentals", "Linear algebra basics"],
    syllabus: [
      "Perceptrons and activation functions",
      "Backpropagation intuition",
      "CNNs in industrial vision",
      "RNNs and sequence data",
      "Knowledge check + mini assessment",
    ],
  },
  {
    id: "3",
    title: "Industrial Safety Protocols",
    category: "Safety",
    estTime: "1h 30m",
    xp: 800,
    prerequisites: ["PPE checklist", "Site induction"],
    syllabus: [
      "High-risk work permits",
      "Lockout/tagout procedures",
      "Hazard communication",
      "Emergency escalation ladder",
      "Knowledge check + recap",
    ],
  },
  {
    id: "4",
    title: "Data Ethics & Governance",
    category: "Compliance",
    estTime: "3h 05m",
    xp: 1500,
    prerequisites: ["Privacy basics", "Company data classification policy"],
    syllabus: [
      "Data minimization principles",
      "Consent and lawful basis",
      "Retention and deletion policies",
      "Audit-ready documentation",
      "Knowledge check + mini assessment",
    ],
  },
]

export default function CourseOverviewPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()

  const courseId = typeof router.query.id === "string" ? router.query.id : "1"

  const course = useMemo(() => {
    return mockCourses.find((c) => c.id === courseId) ?? mockCourses[0]!
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading course...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Course Locked"
        description="Start a demo session to preview the course overview, or sign in to continue."
        onStartDemo={login}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F77DD]/10 border border-[#7F77DD]/20 text-[10px] font-black text-[#7F77DD] uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3" />
              Course Overview
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              {course.title}
            </h1>
            <p className="text-muted-foreground font-medium max-w-3xl">
              Pre-lesson briefing: review the syllabus, time estimate, and XP rewards before you start.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-11 px-5 font-black uppercase tracking-widest text-[11px]"
              onClick={() => router.push("/my-courses")}
            >
              Back to Courses
            </Button>
            <Button
              className="h-11 px-5 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
              onClick={() => router.push(`/lesson-view?course=${encodeURIComponent(course.id)}`)}
            >
              Start Lesson <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 shadow-none border border-white/10">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-[14px] bg-white/80 dark:bg-white/5 border border-zinc-200/70 dark:border-white/10 flex items-center justify-center text-[#7F77DD]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {course.category}
                  </div>
                  <div className="text-xl font-black tracking-tight">Syllabus</div>
                </div>
              </div>

              <div className="space-y-3">
                {course.syllabus.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/[0.03] p-4"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-none border border-white/10">
              <CardContent className="p-8 space-y-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Quick Facts
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Time
                    </div>
                    <div className="text-base font-black mt-1">{course.estTime}</div>
                  </div>
                  <div className="rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      XP
                    </div>
                    <div className="text-base font-black mt-1">{course.xp}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Prerequisites
                  </div>
                  <div className="space-y-2">
                    {course.prerequisites.map((p) => (
                      <div
                        key={p}
                        className="rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-11 font-black uppercase tracking-widest text-[11px]"
                  onClick={() => router.push(`/assessment?course=${encodeURIComponent(course.id)}`)}
                >
                  Try Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
