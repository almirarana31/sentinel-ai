import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Mail,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  Library
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { cn } from "@/lib/utils";

const kpiData = [
  { 
    title: "Overall Completion %", 
    value: "84.2%", 
    trend: "+12.4%", 
    trendType: "up",
    icon: <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />
  },
  { 
    title: "Overdue Learners", 
    value: "12", 
    trend: "+3", 
    trendType: "down", 
    icon: <AlertTriangle className="h-4 w-4 text-[#E24B4A]" />
  },
  { 
    title: "Average Score", 
    value: "78/100", 
    trend: "+5.1%", 
    trendType: "up",
    icon: <TrendingUp className="h-4 w-4 text-[#7F77DD]" />
  },
  { 
    title: "Active This Week", 
    value: "142", 
    trend: "+14.2%", 
    trendType: "up",
    icon: <Users className="h-4 w-4 text-zinc-500" />
  },
];

const completionTrend = [
  { name: "Week 1", rate: 65 },
  { name: "Week 2", rate: 72 },
  { name: "Week 3", rate: 78 },
  { name: "Week 4", rate: 84 },
];

const atRiskLearners = [
  { name: "Jordan R.", team: "Operations", overdue: "1 course", deadline: "3d ago", avatar: "JR" },
  { name: "Lisa M.", team: "Security", overdue: "2 courses", deadline: "5d ago", avatar: "LM" },
  { name: "David K.", team: "Compliance", overdue: "1 course", deadline: "1w ago", avatar: "DK" },
];

export default function AdminDashboard() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading admin dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Enterprise Command Locked"
        description="Start a demo session to view the enterprise dashboard, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Enterprise Command</h1>
            <p className="text-muted-foreground text-sm font-medium">Monitoring training health for <span className="text-[#7F77DD] font-bold">Sentinel Global Corp</span>.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="font-bold uppercase tracking-widest text-xs h-10 border-white/15"
              onClick={() => router.push("/admin-consent")}
            >
              Consent Log
            </Button>
            <Button
              variant="outline"
              className="font-bold uppercase tracking-widest text-xs h-10 border-white/15"
              onClick={() => router.push("/admin-reports")}
            >
              Export Report
            </Button>
            <Button
              className="bg-[#7F77DD] font-bold uppercase tracking-widest text-xs h-10 shadow-lg shadow-[#7F77DD]/20"
              onClick={() => router.push("/admin-users")}
            >
              Invite Team
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "User Management",
              desc: "Invite, roles, groups",
              icon: <Users className="h-4 w-4 text-[#7F77DD]" />,
              href: "/admin-users",
            },
            {
              title: "Course Assignment",
              desc: "Deadlines + required",
              icon: <ClipboardList className="h-4 w-4 text-[#BA7517]" />,
              href: "/admin-assignments",
            },
            {
              title: "Compliance Reports",
              desc: "Completion matrix",
              icon: <ShieldCheck className="h-4 w-4 text-[#1D9E75]" />,
              href: "/admin-reports",
            },
            {
              title: "Analytics",
              desc: "Cohorts, scores, time",
              icon: <BarChart3 className="h-4 w-4 text-[#BA7517]" />,
              href: "/admin-analytics",
            },
            {
              title: "Content Library",
              desc: "Courses + assets",
              icon: <Library className="h-4 w-4 text-cyan-300" />,
              href: "/admin-library",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="shadow-none cursor-pointer hover:border-[#7F77DD]/50 transition-colors"
              onClick={() => router.push(item.href)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") router.push(item.href)
              }}
            >
              <CardContent className="p-6 space-y-3">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg w-fit">{item.icon}</div>
                <div className="space-y-1">
                  <div className="text-sm font-black uppercase tracking-widest">{item.title}</div>
                  <div className="text-xs text-muted-foreground font-medium">{item.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className="shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg">{kpi.icon}</div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter",
                    kpi.trendType === 'up' ? "text-[#1D9E75]" : "text-[#E24B4A]"
                  )}>
                    {kpi.trendType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{kpi.title}</p>
                <p className="text-2xl font-black italic tracking-tighter leading-none">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Completion Trend Chart */}
          <Card className="lg:col-span-8 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Completion Trend</CardTitle>
                <CardDescription className="text-xs">Overall completion rate over 30 days.</CardDescription>
              </div>
              <div className="flex gap-2">
                {["30d", "60d", "90d"].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border-[0.5px]",
                    t === "30d" ? "bg-[#7F77DD] text-white border-[#7F77DD]" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/7"
                  )}>{t}</button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#7F77DD" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#7F77DD', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 6, fill: '#7F77DD' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Team Completion Heatmap Placeholder */}
          <Card className="lg:col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Team Breakdown</CardTitle>
              <CardDescription className="text-xs">Performance by department.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { name: "Operations", rate: 92 },
                { name: "Security", rate: 45 },
                { name: "Compliance", rate: 88 },
                { name: "Engineering", rate: 64 },
              ].map(team => (
                <div key={team.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{team.name}</span>
                    <span className="text-xs font-black">{team.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        team.rate > 80 ? "bg-[#1D9E75]" : team.rate > 60 ? "bg-[#7F77DD]" : "bg-[#BA7517]"
                      )} 
                      style={{ width: `${team.rate}%` }} 
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full text-[10px] font-black uppercase tracking-widest text-[#7F77DD]"
                onClick={() => router.push("/admin-reports")}
              >
                See Details <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
          {/* At-Risk Learners Table */}
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">At-Risk Learners</CardTitle>
                <CardDescription className="text-xs">Learners who are overdue or inactive.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-[#E24B4A] font-bold text-[10px] uppercase tracking-widest">Remind All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t">
                {atRiskLearners.map((learner) => (
                  <div key={learner.name} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-100 rounded-full flex items-center justify-center font-black text-[10px]">{learner.avatar}</div>
                      <div>
                        <p className="text-xs font-bold leading-none mb-1">{learner.name}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{learner.team}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#E24B4A] uppercase tracking-tighter leading-none mb-1">{learner.overdue} OVERDUE</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{learner.deadline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-white/15">
                          <Mail className="h-3.5 w-3.5 text-[#7F77DD]" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-white/15">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity / Audit Log */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Certification Audit</CardTitle>
              <CardDescription className="text-xs">Latest certificates issued across the org.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t">
                {[
                  { name: "Sarah K.", cert: "Risk Analyst I", date: "2m ago" },
                  { name: "Michael R.", cert: "Industrial Safety", date: "15m ago" },
                  { name: "Jessica W.", cert: "Neural Specialist", date: "1h ago" },
                ].map((item) => (
                  <div key={item.name} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#1D9E75]/10 rounded-full flex items-center justify-center text-[#1D9E75]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-none mb-1">{item.name}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Earned <span className="text-zinc-950 dark:text-zinc-100 font-bold">{item.cert}</span></p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{item.date}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white/5 border-t border-white/10 flex justify-center">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#7F77DD]">View Full Audit Trail</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
