import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Timer, ShieldCheck, ChevronRight } from "lucide-react"

type Question = {
  q: string
  options: string[]
  correct: number
  explanation: string
}

const mockExam: Question[] = [
  {
    q: "Which outcome best defines a risk assessment?",
    options: [
      "A list of tools used by the team",
      "A prioritized view of threats and impacts",
      "A single score without context",
      "A set of policies that never change",
    ],
    correct: 1,
    explanation: "Risk assessment prioritizes threats by likelihood and impact to guide action.",
  },
  {
    q: "What’s the safest first action during an incident?",
    options: [
      "Post it on a public channel",
      "Wait until the next meeting",
      "Follow the escalation path and containment steps",
      "Delete logs to reduce noise",
    ],
    correct: 2,
    explanation: "Containment + escalation procedures reduce damage and improve response quality.",
  },
  {
    q: "When should a policy be reviewed?",
    options: ["Only once", "Never", "After major incidents and on a schedule", "Only when auditors ask"],
    correct: 2,
    explanation: "Review after incidents and regularly to keep controls aligned with risk.",
  },
]

const EXAM_SECONDS = 6 * 60

export default function AssessmentPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS)

  const courseId = typeof router.query.course === "string" ? router.query.course : "1"

  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [submitted])

  useEffect(() => {
    if (submitted) return
    if (timeLeft <= 0) setSubmitted(true)
  }, [timeLeft, submitted])

  const score = useMemo(() => {
    let correct = 0
    for (let i = 0; i < mockExam.length; i++) {
      if (selected[i] === mockExam[i]!.correct) correct++
    }
    return { correct, total: mockExam.length }
  }, [selected])

  const passed = submitted ? score.correct >= 2 : false

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading assessment...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Assessment Locked"
        description="Start a demo session to preview the assessment, or sign in to continue."
        onStartDemo={login}
      />
    )
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const ss = String(timeLeft % 60).padStart(2, "0")

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Assessment / Exam
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
              Certification Gate
            </h1>
            <p className="text-muted-foreground font-medium">
              Demo assessment UI (timer + feedback). Course: {courseId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-full border", "border-white/10 bg-white/70 dark:bg-white/5")}>
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-black tracking-widest">{mm}:{ss}</span>
            </div>
            {!submitted ? (
              <Button
                className="h-11 px-5 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
                onClick={() => setSubmitted(true)}
              >
                Submit
              </Button>
            ) : (
              <Button
                className="h-11 px-5 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
                onClick={() => router.push("/certifications")}
              >
                View Certs <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </header>

        <Card className="shadow-none border border-white/10">
          <CardContent className="p-8 space-y-6">
            {mockExam.map((q, qi) => {
              const chosen = selected[qi]
              return (
                <div key={q.q} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                      Question {qi + 1}
                    </div>
                    {submitted && (
                      <div className={cn("text-[10px] font-black uppercase tracking-widest", chosen === q.correct ? "text-[#1D9E75]" : "text-[#E24B4A]")}>
                        {chosen === q.correct ? "Correct" : "Incorrect"}
                      </div>
                    )}
                  </div>

                  <div className="text-lg font-black tracking-tight">{q.q}</div>

                  <div className="grid gap-3">
                    {q.options.map((opt, oi) => {
                      const isSelected = chosen === oi
                      const isCorrect = q.correct === oi
                      const show = submitted

                      const state =
                        show && isCorrect
                          ? "border-[#1D9E75] bg-[#1D9E75]/5"
                          : show && isSelected && !isCorrect
                            ? "border-[#E24B4A] bg-[#E24B4A]/5"
                            : isSelected
                              ? "border-[#7F77DD] bg-[#7F77DD]/5 ring-1 ring-[#7F77DD]"
                              : "border-white/10 bg-white/70 dark:bg-white/[0.03] hover:border-[#7F77DD]/40"

                      return (
                        <button
                          key={opt}
                          disabled={submitted}
                          onClick={() => setSelected((s) => ({ ...s, [qi]: oi }))}
                          className={cn(
                            "w-full text-left p-4 rounded-[12px] border transition-all flex items-center justify-between",
                            state
                          )}
                        >
                          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {opt}
                          </span>
                          {show && isCorrect && <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />}
                          {show && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-[#E24B4A]" />}
                        </button>
                      )
                    })}
                  </div>

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-[12px] border p-4",
                        chosen === q.correct ? "border-[#1D9E75]/30 bg-[#1D9E75]/10" : "border-[#E24B4A]/30 bg-[#E24B4A]/10"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-[#7F77DD]" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Feedback
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {q.explanation}
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {submitted && (
          <Card className="shadow-none border border-white/10">
            <CardContent className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className={cn("text-[10px] font-black uppercase tracking-widest", passed ? "text-[#1D9E75]" : "text-[#E24B4A]")}>
                  {passed ? "PASSED" : "NOT PASSED"}
                </div>
                <div className="text-2xl font-black uppercase tracking-tighter italic">
                  Score: {score.correct}/{score.total}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Demo-only: passing can unlock a certificate screen.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="h-11 px-5 font-black uppercase tracking-widest text-[11px]"
                  onClick={() => router.push(`/course-overview?id=${encodeURIComponent(courseId)}`)}
                >
                  Back to Course
                </Button>
                <Button
                  className="h-11 px-5 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
                  onClick={() => router.push("/certifications")}
                >
                  Certifications
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

