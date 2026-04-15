import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingUp } from "lucide-react"

const scoreDist = [
  { bucket: "<60", count: 12 },
  { bucket: "60-69", count: 24 },
  { bucket: "70-79", count: 41 },
  { bucket: "80-89", count: 58 },
  { bucket: "90+", count: 31 },
]

const timeOnTask = [
  { week: "W1", minutes: 95 },
  { week: "W2", minutes: 124 },
  { week: "W3", minutes: 118 },
  { week: "W4", minutes: 146 },
  { week: "W5", minutes: 173 },
  { week: "W6", minutes: 161 },
]

const commodityDist = [
  { name: "Padi", value: 45, color: "#7F77DD" },
  { name: "Jagung", value: 25, color: "#1D9E75" },
  { name: "Kedelai", value: 20, color: "#BA7517" },
  { name: "Gandum", value: 10, color: "#E24B4A" },
]

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading analytics...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Analytics Locked"
        description="Start a demo session to preview analytics, or sign in to continue."
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
            <h1 className="text-3xl font-black uppercase tracking-tighter">Analytics</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Demo UI for score distributions, time-on-task, and cohort insights.
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-6 shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Score Distribution</CardTitle>
              <CardDescription className="text-xs">How learners performed across exams.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDist}>
                  <XAxis dataKey="bucket" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,0.06)" }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {scoreDist.map((_, index) => (
                      <Cell key={index} fill={index >= 2 ? "#7F77DD" : "rgba(127,119,221,0.35)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-6 shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Time on Task</CardTitle>
              <CardDescription className="text-xs">Weekly minutes spent learning.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeOnTask}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                  <Line type="monotone" dataKey="minutes" stroke="#1D9E75" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Cohort Mix</CardTitle>
              <CardDescription className="text-xs">Sample learner composition by program.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={commodityDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {commodityDist.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Cohort Insights</CardTitle>
              <CardDescription className="text-xs">
                Compare cohorts by team, role, or onboarding date.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-[#7F77DD]/10 border border-[#7F77DD]/20 flex items-center justify-center text-[#7F77DD]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-widest">Trend Summary</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Completion rates are strongest in cohorts with higher weekly engagement.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-white/5 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Completion
                  </div>
                  <div className="mt-2 text-2xl font-black">86%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-white/5 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Avg. Score
                  </div>
                  <div className="mt-2 text-2xl font-black">81</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-white/5 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Weekly Active
                  </div>
                  <div className="mt-2 text-2xl font-black">143</div>
                </div>
              </div>

              <Button className="h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#7F77DD]/20">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
