import { type ReactNode, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Mail,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ArrowRight,
  Puzzle,
  Siren,
} from "lucide-react"

type PhishRound = {
  id: string
  from: string
  subject: string
  preview: string
  clue: string
  answer: "phishing" | "legit"
}

const phishingRounds: PhishRound[] = [
  {
    id: "p1",
    from: "IT Support <it-helpdesk@sentineI.local>",
    subject: "Action required: password expires today",
    preview:
      "Your password will expire in 2 hours. Keep access by confirming your account now.",
    clue: "Look closely: the domain uses a capital “I” instead of “l” (sentineI).",
    answer: "phishing",
  },
  {
    id: "p2",
    from: "Compliance Team <compliance@sentinel.local>",
    subject: "Updated Safety SOP v2.3 (read + acknowledge)",
    preview:
      "We published SOP v2.3. Please review and acknowledge in the training portal.",
    clue: "Matches internal domain + plausible request tied to training workflow.",
    answer: "legit",
  },
  {
    id: "p3",
    from: "Finance <finance@sentinel-payments.com>",
    subject: "Invoice overdue — final notice",
    preview:
      "Your invoice is overdue. Download the attached ZIP and pay immediately to avoid suspension.",
    clue: "External lookalike domain + urgency + ZIP attachment = high risk.",
    answer: "phishing",
  },
]

type Pair = { id: string; term: string; def: string }

const matchingPairs: Pair[] = [
  {
    id: "m1",
    term: "Least privilege",
    def: "Give users the minimum access needed to do their job.",
  },
  {
    id: "m2",
    term: "MFA",
    def: "Require an extra factor beyond password (e.g., app code).",
  },
  {
    id: "m3",
    term: "Containment",
    def: "Stop an incident from spreading while preserving evidence.",
  },
  {
    id: "m4",
    term: "Data minimization",
    def: "Collect and keep only the data you actually need.",
  },
]

type IncidentStep = {
  id: string
  title: string
  prompt: string
  options: { id: string; label: string; correct: boolean; feedback: string }[]
}

const incidentSteps: IncidentStep[] = [
  {
    id: "s1",
    title: "Unusual Login",
    prompt:
      "You see a successful login to an Ops account from a new country at 02:14. What do you do FIRST?",
    options: [
      {
        id: "o1",
        label: "Ignore it — could be a VPN.",
        correct: false,
        feedback:
          "Even if it’s a VPN, you should validate the event and reduce exposure quickly.",
      },
      {
        id: "o2",
        label: "Contain: disable the account and preserve logs.",
        correct: true,
        feedback:
          "Good. Contain the potential compromise and preserve evidence for investigation.",
      },
      {
        id: "o3",
        label: "Post a warning in a public channel immediately.",
        correct: false,
        feedback:
          "Coordinate comms through the incident process so details don’t leak or confuse responders.",
      },
    ],
  },
  {
    id: "s2",
    title: "Triage",
    prompt:
      "You’ve contained access. What’s the next best step for triage?",
    options: [
      {
        id: "o1",
        label: "Collect indicators: IP, device, and affected systems.",
        correct: true,
        feedback:
          "Correct. Collect IOCs, scope impact, and check for lateral movement.",
      },
      {
        id: "o2",
        label: "Re-enable the account to see what happens.",
        correct: false,
        feedback:
          "Don’t reintroduce risk. Keep containment until you know what happened.",
      },
      {
        id: "o3",
        label: "Wipe the endpoint immediately.",
        correct: false,
        feedback:
          "Wiping too early destroys evidence and can slow down root cause analysis.",
      },
    ],
  },
  {
    id: "s3",
    title: "Recovery",
    prompt:
      "You confirm credential theft. Which control most directly reduces recurrence?",
    options: [
      {
        id: "o1",
        label: "Enable MFA and rotate credentials.",
        correct: true,
        feedback:
          "Correct. MFA + rotation removes stolen credential value and raises the bar for attackers.",
      },
      {
        id: "o2",
        label: "Change the logo on the login page.",
        correct: false,
        feedback:
          "Cosmetic changes don’t address the attack path.",
      },
      {
        id: "o3",
        label: "Disable all alerts to reduce noise.",
        correct: false,
        feedback:
          "Alerts help you detect; tune them, don’t remove them.",
      },
    ],
  },
]

function GameHeader({
  icon,
  title,
  desc,
  action,
}: {
  icon: ReactNode
  title: string
  desc: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-[14px] border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#7F77DD]">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="text-lg font-black uppercase tracking-tight">{title}</div>
          <div className="text-sm font-medium text-white/60">{desc}</div>
        </div>
      </div>
      {action}
    </div>
  )
}

function PhishingSpotter() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<null | { pick: "phishing" | "legit"; correct: boolean }>(null)

  const round = phishingRounds[index]!
  const done = index >= phishingRounds.length

  if (done) {
    return (
      <Card className="shadow-none border border-white/10">
        <CardContent className="p-6 space-y-5">
          <GameHeader
            icon={<Mail className="h-5 w-5" />}
            title="Phishing Spotter"
            desc="Train your gut: spot suspicious emails fast."
            action={
              <Button
                variant="outline"
                className="h-10 font-black uppercase tracking-widest text-[10px]"
                onClick={() => {
                  setIndex(0)
                  setScore(0)
                  setAnswered(null)
                }}
              >
                Restart <RefreshCcw className="h-4 w-4 ml-2" />
              </Button>
            }
          />

          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Result</div>
            <div className="text-2xl font-black uppercase tracking-tighter italic mt-1">
              {score} / {phishingRounds.length}
            </div>
            <div className="text-white/60 text-sm font-medium mt-2">
              Tip: check sender domain, urgency, attachments, and where links actually go.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const pick = (choice: "phishing" | "legit") => {
    if (answered) return
    const correct = choice === round.answer
    setAnswered({ pick: choice, correct })
    if (correct) setScore((s) => s + 1)
  }

  return (
    <Card className="shadow-none border border-white/10">
      <CardContent className="p-6 space-y-5">
        <GameHeader
          icon={<Mail className="h-5 w-5" />}
          title="Phishing Spotter"
          desc="Decide if the email is phishing or legit."
          action={
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">
              Round {index + 1}/{phishingRounds.length} · Score {score}
            </div>
          }
        />

        <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
          <div className="absolute inset-0 opacity-100 bg-[radial-gradient(520px_circle_at_30%_20%,rgba(127,119,221,0.18)_0%,transparent_60%),radial-gradient(520px_circle_at_70%_80%,rgba(16,185,129,0.10)_0%,transparent_65%)]" />
          <div className="relative space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">From</div>
            <div className="text-sm font-bold text-white/90">{round.from}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55 mt-3">Subject</div>
            <div className="text-base font-black">{round.subject}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55 mt-3">Preview</div>
            <div className="text-sm font-medium text-white/70">{round.preview}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            className={cn(
              "h-12 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-black/30",
              answered && answered.pick === "legit" && !answered.correct && "bg-[#E24B4A]"
            )}
            onClick={() => pick("legit")}
          >
            Legit
          </Button>
          <Button
            variant="danger"
            className={cn(
              "h-12 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-black/30",
              answered && answered.pick === "phishing" && answered.correct && "bg-[#1D9E75]"
            )}
            onClick={() => pick("phishing")}
          >
            Phishing
          </Button>
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "rounded-[16px] border p-5",
                answered.correct
                  ? "border-[#1D9E75]/30 bg-[#1D9E75]/10"
                  : "border-[#E24B4A]/30 bg-[#E24B4A]/10"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={cn("h-9 w-9 rounded-full flex items-center justify-center", answered.correct ? "bg-[#1D9E75]/15 text-[#1D9E75]" : "bg-[#E24B4A]/15 text-[#E24B4A]")}>
                    {answered.correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1">
                    <div className={cn("text-sm font-black uppercase tracking-widest", answered.correct ? "text-[#1D9E75]" : "text-[#E24B4A]")}>
                      {answered.correct ? "Correct" : "Not quite"}
                    </div>
                    <div className="text-sm font-medium text-white/80">{round.clue}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="h-10 font-black uppercase tracking-widest text-[10px]"
                  onClick={() => {
                    setAnswered(null)
                    setIndex((i) => i + 1)
                  }}
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function MatchingGame() {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<null | { ok: boolean; text: string }>(null)
  const [moves, setMoves] = useState(0)

  const terms = useMemo(() => matchingPairs.map((p) => ({ id: p.id, label: p.term })), [])
  const defs = useMemo(() => matchingPairs.map((p) => ({ id: p.id, label: p.def })), [])

  const matchedCount = Object.values(matched).filter(Boolean).length

  const reset = () => {
    setSelectedTerm(null)
    setMatched({})
    setStatus(null)
    setMoves(0)
  }

  const pickDef = (pairId: string) => {
    if (!selectedTerm) return
    if (matched[selectedTerm] || matched[pairId]) return
    setMoves((m) => m + 1)
    const ok = selectedTerm === pairId
    setStatus(ok ? { ok: true, text: "Match!" } : { ok: false, text: "Nope—try again." })
    if (ok) {
      setMatched((prev) => ({ ...prev, [pairId]: true }))
      setSelectedTerm(null)
    }
  }

  return (
    <Card className="shadow-none border border-white/10">
      <CardContent className="p-6 space-y-5">
        <GameHeader
          icon={<Puzzle className="h-5 w-5" />}
          title="Match the Concept"
          desc="Click a term, then click its definition."
          action={
            <Button
              variant="outline"
              className="h-10 font-black uppercase tracking-widest text-[10px]"
              onClick={reset}
            >
              Reset <RefreshCcw className="h-4 w-4 ml-2" />
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Terms</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {terms.map((t) => {
                const isMatched = !!matched[t.id]
                const isSelected = selectedTerm === t.id
                return (
                  <button
                    key={t.id}
                    disabled={isMatched}
                    onClick={() => setSelectedTerm(t.id)}
                    className={cn(
                      "px-4 py-3 rounded-[14px] border text-left transition-colors",
                      isMatched
                        ? "border-[#1D9E75]/30 bg-[#1D9E75]/10 text-white/85"
                        : isSelected
                          ? "border-[#7F77DD]/40 bg-[#7F77DD]/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/80 hover:border-[#7F77DD]/30"
                    )}
                  >
                    <div className="text-sm font-black">{t.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Definitions</div>
            <div className="space-y-2">
              {defs.map((d) => {
                const isMatched = !!matched[d.id]
                return (
                  <button
                    key={d.id}
                    disabled={isMatched}
                    onClick={() => pickDef(d.id)}
                    className={cn(
                      "w-full px-4 py-3 rounded-[14px] border text-left transition-colors",
                      isMatched
                        ? "border-[#1D9E75]/30 bg-[#1D9E75]/10 text-white/85"
                        : "border-white/10 bg-white/[0.03] text-white/70 hover:border-[#7F77DD]/30"
                    )}
                  >
                    <div className="text-sm font-semibold">{d.label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] p-4">
          <div className="text-sm font-semibold text-white/80">
            Matched <span className="font-black">{matchedCount}</span> / {matchingPairs.length} · Moves{" "}
            <span className="font-black">{moves}</span>
          </div>
          {status && (
            <div
              className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                status.ok ? "text-[#1D9E75]" : "text-[#E24B4A]"
              )}
            >
              {status.text}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function IncidentSim() {
  const [stepIdx, setStepIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<null | { optionId: string; ok: boolean; feedback: string }>(null)

  const step = incidentSteps[stepIdx]!
  const finished = stepIdx >= incidentSteps.length

  const reset = () => {
    setStepIdx(0)
    setScore(0)
    setPicked(null)
  }

  if (finished) {
    return (
      <Card className="shadow-none border border-white/10">
        <CardContent className="p-6 space-y-5">
          <GameHeader
            icon={<Siren className="h-5 w-5" />}
            title="Incident Response Drill"
            desc="Choose the best next action at each step."
            action={
              <Button
                variant="outline"
                className="h-10 font-black uppercase tracking-widest text-[10px]"
                onClick={reset}
              >
                Restart <RefreshCcw className="h-4 w-4 ml-2" />
              </Button>
            }
          />

          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Score</div>
            <div className="text-2xl font-black uppercase tracking-tighter italic mt-1">
              {score} / {incidentSteps.length}
            </div>
            <div className="text-white/60 text-sm font-medium mt-2">
              Nice. Next time: practice faster containment and clearer escalation.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const choose = (optId: string) => {
    if (picked) return
    const opt = step.options.find((o) => o.id === optId)
    if (!opt) return
    setPicked({ optionId: optId, ok: opt.correct, feedback: opt.feedback })
    if (opt.correct) setScore((s) => s + 1)
  }

  return (
    <Card className="shadow-none border border-white/10">
      <CardContent className="p-6 space-y-5">
        <GameHeader
          icon={<Siren className="h-5 w-5" />}
          title="Incident Response Drill"
          desc={`${step.title} · Step ${stepIdx + 1}/${incidentSteps.length}`}
          action={
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">
              Score {score}
            </div>
          }
        />

        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#BA7517]">
            <ShieldAlert className="h-4 w-4" />
            Scenario
          </div>
          <div className="text-base font-semibold text-white/90 mt-2">{step.prompt}</div>
        </div>

        <div className="space-y-2">
          {step.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              disabled={!!picked}
              className={cn(
                "w-full px-4 py-3 rounded-[14px] border text-left transition-colors",
                "border-white/10 bg-white/[0.03] text-white/85 hover:border-[#7F77DD]/30 disabled:opacity-80"
              )}
            >
              <div className="text-sm font-bold">{opt.label}</div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {picked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "rounded-[16px] border p-5",
                picked.ok ? "border-[#1D9E75]/30 bg-[#1D9E75]/10" : "border-[#E24B4A]/30 bg-[#E24B4A]/10"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className={cn("text-[10px] font-black uppercase tracking-widest", picked.ok ? "text-[#1D9E75]" : "text-[#E24B4A]")}>
                    {picked.ok ? "Good call" : "Risky choice"}
                  </div>
                  <div className="text-sm font-medium text-white/80">{picked.feedback}</div>
                </div>
                <Button
                  variant="outline"
                  className="h-10 font-black uppercase tracking-widest text-[10px]"
                  onClick={() => {
                    setPicked(null)
                    setStepIdx((i) => i + 1)
                  }}
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default function GamesPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading games...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Games Locked"
        description="Start a demo session to play mini-games."
        onStartDemo={login}
      />
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">
              Mini-Games
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
              Practice With Games
            </h1>
            <p className="text-white/60 text-sm font-medium max-w-2xl">
              Quick drills that reinforce the same concepts you see in lessons—built as interactive demos.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-11 font-black uppercase tracking-widest text-[11px]"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <PhishingSpotter />
          <MatchingGame />
          <IncidentSim />
        </div>
      </div>
    </div>
  )
}
