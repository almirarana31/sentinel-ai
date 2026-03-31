import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { AdminOnlyScreen } from "@/components/auth/admin-only-screen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import { TrendingUp } from "lucide-react"

const scoreDist = [
  { bucket: "0-49", count: 4 },
  { bucket: "50-69", count: 18 },
  { bucket: "70-84", count: 42 },
  { bucket: "85-100", count: 28 },
]

const timeOnTask = [
  { week: "W1", minutes: 120 },
  { week: "W2", minutes: 180 },
  { week: "W3", minutes: 210 },
  { week: "W4", minutes: 260 },
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

  if (user.role !== "admin") {
    return (
      <AdminOnlyScreen
        title="Analytics Locked"
        description="Only admins can access training analytics."
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
                  <Bar dataKey="count" radius={[8, 8, 8, 8]}>
                    {scoreDist.map((_, i) => (
                      <Cell key={i} fill={i >= 2 ? "#7F77DD" : "rgba(255,255,255,0.18)"} />
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
        </div>

        <Card className="shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[12px] bg-[#7F77DD]/10 border border-[#7F77DD]/20 flex items-center justify-center text-[#7F77DD]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-widest">Cohort Insights</div>
                <div className="text-sm text-muted-foreground font-medium">
                  Compare cohorts by team, role, or onboarding date (demo-only).
                </div>
              </div>
            </div>
            <Button className="h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#7F77DD]/20">
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
