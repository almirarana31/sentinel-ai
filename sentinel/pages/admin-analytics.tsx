import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
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
  PieChart,
  Pie,
  Legend,
} from "recharts"
import { TrendingUp, Map as MapIcon, Calendar, Leaf } from "lucide-react"
import { useState } from "react"

const commodityDist = [
  { name: "Padi", value: 45, color: "#7F77DD" },
  { name: "Jagung", value: 25, color: "#1D9E75" },
  { name: "Kedelai", value: 20, color: "#BA7517" },
  { name: "Gandum", value: 10, color: "#E24B4A" },
]

const harvestData = [
  { month: "Jan", status: "Planting" },
  { month: "Feb", status: "Growing" },
  { month: "Mar", status: "Harvest" },
  { month: "Apr", status: "Dormant" },
  { month: "May", status: "Planting" },
  { month: "Jun", status: "Growing" },
  { month: "Jul", status: "Harvest" },
  { month: "Aug", status: "Growing" },
  { month: "Sep", status: "Harvest" },
  { month: "Oct", status: "Planting" },
  { month: "Nov", status: "Growing" },
  { month: "Dec", status: "Harvest" },
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


ulse shadow-lg shadow-[#BA7517]/50" style={{ animationDelay: '1s' }} />
            </CardContent>
          </Card>
        </div>

        {/* Harvest Calendar */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Jadwal Panen Raya</CardTitle>
              <CardDescription className="text-xs">Estimasi waktu panen berdasarkan siklus tanam.</CardDescription>
            </div>
            <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-[10px] border border-white/10">
              {(["Day", "Week", "Month", "Year"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-4 py-1.5 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all",
                    view === v ? "bg-white dark:bg-white/10 shadow-sm text-[#7F77DD]" : "text-muted-foreground hover:text-white"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-x-auto">
            <div className="grid grid-cols-12 gap-2 min-w-[800px]">
              {harvestData.map((item) => (
                <div key={item.month} className="space-y-2">
                  <div className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.month}</div>
                  <div className={cn(
                    "h-24 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all hover:scale-105",
                    item.status === "Harvest" 
                      ? "bg-[#1D9E75]/10 border-[#1D9E75]/30 text-[#1D9E75]" 
                      : item.status === "Planting"
                        ? "bg-[#7F77DD]/10 border-[#7F77DD]/30 text-[#7F77DD]"
                        : item.status === "Growing"
                          ? "bg-[#BA7517]/10 border-[#BA7517]/30 text-[#BA7517]"
                          : "bg-zinc-50 dark:bg-white/5 border-white/10 text-muted-foreground"
                  )}>
                    {item.status === "Harvest" ? <Leaf className="h-4 w-4" /> : item.status === "Planting" ? <Calendar className="h-4 w-4" /> : null}
                    <span className="text-[8px] font-black uppercase tracking-tighter">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[12px] bg-[#7F77DD]/10 border border-[#7F77DD]/20 flex items-center justify-center text-[#7F77DD]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-widest">Laporan Produksi</div>
                <div className="text-sm text-muted-foreground font-medium">
                  Ekspor data statistik komoditas untuk keperluan pelaporan tahunan.
                </div>
              </div>
            </div>
            <Button className="h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#7F77DD]/20">
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


