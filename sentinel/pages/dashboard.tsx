import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Flame, 
  ChevronRight, 
  LayoutGrid, 
  GraduationCap, 
  Trophy, 
  Settings,
  Bell
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const xpData = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 210 },
  { day: "Wed", xp: 450 },
  { day: "Thu", xp: 300 },
  { day: "Fri", xp: 180 },
  { day: "Sat", xp: 90 },
  { day: "Sun", xp: 340 },
];

const mockCourses = [
  { 
    id: "1", 
    title: "Risk Assessment Fundamentals", 
    progress: 72, 
    deadline: "3 days left",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60"
  },
  { 
    id: "2", 
    title: "Neural Network Architecture", 
    progress: 45, 
    deadline: null,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60"
  },
  { 
    id: "3", 
    title: "Industrial Safety Protocols", 
    progress: 10, 
    deadline: "Tomorrow",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"
  },
];

export default function Dashboard() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return <LockedScreen title="Dashboard Locked" onStartDemo={login} />;
  }

  const xpProgress = (user.xp / user.nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6">
      {/* Top Navigation / Strip */}
      <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#7F77DD] rounded-full flex items-center justify-center text-white font-bold text-sm">
              Lvl {user.level}
            </div>
            <div className="w-48">
              <div className="flex justify-between text-[11px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                <span>Next: Specialist</span>
                <span>{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <Progress value={xpProgress} className="h-1.5" />
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${user.streakAtRisk ? 'border-[#BA7517] bg-[#BA7517]/10' : 'border-white/10 bg-white/5'}`}>
            <Flame className={`h-4 w-4 ${user.streakAtRisk ? 'text-[#BA7517]' : 'text-[#7F77DD]'}`} />
            <span className="text-sm font-bold">{user.streak}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-100 rounded-full flex items-center justify-center font-bold">
            {user.avatar}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Assigned Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Continue Learning</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7F77DD]"
                onClick={() => router.push("/my-courses")}
              >
                See all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {mockCourses.map((course) => (
                <Card
                  key={course.id}
                  className="min-w-[280px] group cursor-pointer hover:border-[#7F77DD]/50 transition-colors"
                  onClick={() => router.push(`/course-overview?id=${encodeURIComponent(course.id)}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/course-overview?id=${encodeURIComponent(course.id)}`)
                    }
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative h-32 w-full overflow-hidden rounded-t-[11px]">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20" />
                      {course.deadline && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-bold text-[#E24B4A] uppercase tracking-wider">
                          {course.deadline}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-3 line-clamp-1">{course.title}</h3>
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex items-center justify-center">
                          <svg className="h-12 w-12 -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-100 dark:text-zinc-800" />
                            <circle 
                              cx="24" cy="24" r="20" fill="none" stroke="#7F77DD" strokeWidth="4" 
                              strokeDasharray={`${(course.progress / 100) * 125.6} 125.6`} 
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-bold">{course.progress}%</span>
                        </div>
                        <Button
                          size="sm"
                          className="w-full text-xs uppercase tracking-wider font-bold"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/course-overview?id=${encodeURIComponent(course.id)}`)
                          }}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Recommended */}
          <Card className="bg-[#7F77DD] text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="relative z-10 flex justify-between items-center">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center text-[#7F77DD]">
                      <span className="text-[10px] font-black">S</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">Sentinel Insight</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Based on your performance, your next best step is <span className="underline decoration-white/30">Data Compliance II</span>.</h2>
                  <p className="text-white/80 text-sm mb-6">You've mastered basic risk assessment. This course will bridge your knowledge gap in enterprise governance.</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white text-[#7F77DD] hover:bg-white/90 font-bold uppercase tracking-wider text-xs px-6"
                      onClick={() => router.push("/course-overview?id=4")}
                    >
                      Start now
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider"
                      onClick={() => router.push("/learning-path")}
                    >
                      See full path
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="h-32 w-32 border-4 border-white/20 rounded-full flex items-center justify-center">
                    <LayoutGrid className="h-12 w-12 opacity-50" />
                  </div>
                </div>
              </div>
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <section>
            <h2 className="text-lg font-bold mb-4">Weekly Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={xpData}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#94a3b8'}} 
                        dy={10}
                      />
                      <Bar dataKey="xp" radius={[4, 4, 4, 4]}>
                        {xpData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 6 ? '#7F77DD' : '#F1F5F9'} 
                            className={index === 6 ? 'shadow-sm' : ''}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Leaderboard Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Leaderboard</h2>
                <Trophy className="h-4 w-4 text-[#BA7517]" />
              </div>
              <div className="space-y-4 mb-6">
                {[
                  { rank: 1, name: "Sarah K.", xp: "3,420", current: false },
                  { rank: 2, name: "Michael R.", xp: "3,150", current: false },
                  { rank: 3, name: "Jessica W.", xp: "2,980", current: false },
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4">{player.rank}</span>
                      <div className="h-8 w-8 bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-100 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{player.name}</span>
                    </div>
                    <span className="text-xs font-bold">{player.xp} XP</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between bg-[#7F77DD]/5 -mx-6 px-6 py-3 border-y">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#7F77DD] w-4">12</span>
                  <div className="h-8 w-8 bg-[#7F77DD] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {user.avatar}
                  </div>
                  <span className="text-sm font-bold">You</span>
                </div>
                <span className="text-xs font-bold text-[#7F77DD]">{user.xp} XP</span>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-[#7F77DD] text-xs font-bold uppercase tracking-widest"
                onClick={() => router.push("/leaderboard")}
              >
                Full Leaderboard
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Recent Badges</h2>
              <div className="grid grid-cols-2 gap-3">
                {user.badges.slice(0, 4).map((badge) => (
                  <div key={badge} className="flex flex-col items-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border-[0.5px]">
                    <div className="h-8 w-8 mb-2 text-[#7F77DD]">
                      <GraduationCap className="h-full w-full" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">{badge}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total XP</p>
                <p className="text-xl font-bold">{user.xp}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Courses</p>
                <p className="text-xl font-bold">12</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
