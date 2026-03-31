import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getBadgeVisual } from "@/lib/badges";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Flame, 
  ChevronRight, 
  LayoutGrid, 
  Trophy, 
  Settings,
  Bell
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  ResponsiveContainer, 
  Cell,
  Tooltip,
  Rectangle,
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

function WeeklyActivityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-[14px] border border-white/10 bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-md">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">{label}</div>
      <div className="mt-1 text-lg font-black italic text-white">{payload[0]?.value} XP</div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  
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
                  onClick={() => router.push(`/my-courses?course=${encodeURIComponent(course.id)}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/my-courses?course=${encodeURIComponent(course.id)}`)
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
                          router.push(`/my-courses?course=${encodeURIComponent(course.id)}`)
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
                      onClick={() => router.push("/my-courses?course=4")}
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
                    <BarChart
                      data={xpData}
                      margin={{ top: 8, right: 4, left: 4, bottom: 4 }}
                      onMouseLeave={() => setActiveBarIndex(null)}
                    >
                      <defs>
                        <linearGradient id="weekly-bar-default" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#7F77DD" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="weekly-bar-active" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#7F77DD" />
                          <stop offset="100%" stopColor="#C4B5FD" />
                        </linearGradient>
                        <linearGradient id="weekly-bar-muted" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#94a3b8'}} 
                        dy={10}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(127,119,221,0.08)" }}
                        content={<WeeklyActivityTooltip />}
                      />
                      <Bar
                        dataKey="xp"
                        radius={[10, 10, 6, 6]}
                        animationDuration={900}
                        activeBar={(props: any) => (
                          <g>
                            <Rectangle
                              {...props}
                              radius={[12, 12, 8, 8]}
                              fill="url(#weekly-bar-active)"
                              stroke="#C4B5FD"
                              strokeWidth={1.5}
                            />
                            <Rectangle
                              x={props.x - 2}
                              y={props.y}
                              width={props.width + 4}
                              height={props.height}
                              radius={[12, 12, 8, 8]}
                              fill="rgba(196,181,253,0.12)"
                            />
                          </g>
                        )}
                      >
                        {xpData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              activeBarIndex === null
                                ? index === 6
                                  ? "url(#weekly-bar-default)"
                                  : "url(#weekly-bar-muted)"
                                : activeBarIndex === index
                                  ? "url(#weekly-bar-active)"
                                  : "url(#weekly-bar-muted)"
                            }
                            onMouseEnter={() => setActiveBarIndex(index)}
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Badges</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#7F77DD] text-[10px] font-black uppercase tracking-widest"
                  onClick={() => router.push("/achievements")}
                >
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {user.badges.slice(0, 4).map((badge) => {
                  const visual = getBadgeVisual(badge, "Epic");
                  const Icon = visual.icon;

                  return (
                    <motion.div
                      key={badge}
                      className="relative overflow-hidden rounded-[14px] border border-white/10 p-4 flex flex-col items-center text-center gap-2"
                      style={{ backgroundImage: visual.panelBackground }}
                      whileHover={{
                        y: visual.hover.y,
                        rotate: visual.hover.rotate,
                        scale: visual.hover.scale,
                      }}
                      transition={{ type: "spring", stiffness: 240, damping: 18 }}
                    >
                      <div
                        className="absolute inset-2 rounded-[12px] border border-white/5 opacity-80"
                        style={{ backgroundImage: visual.patternBackground }}
                      />
                      {visual.sparkles.map((sparkle, index) => (
                        <motion.span
                          key={`${badge}-sparkle-${index}`}
                          className="absolute rounded-full bg-white/80 blur-[1px]"
                          style={{
                            top: sparkle.top,
                            left: sparkle.left,
                            width: sparkle.size,
                            height: sparkle.size,
                            boxShadow: `0 0 14px ${visual.accent}`,
                          }}
                          animate={{
                            x: [0, sparkle.driftX * 0.75, 0],
                            y: [0, sparkle.driftY * 0.75, 0],
                            opacity: [0.2, 0.75, 0.2],
                            scale: [0.9, 1.1, 0.9],
                          }}
                          transition={{
                            duration: sparkle.duration,
                            delay: sparkle.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                      <motion.div
                        className="relative flex items-center justify-center"
                        whileHover={{ rotate: visual.hover.iconRotate, scale: visual.hover.iconScale }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      >
                        <div className={`absolute inset-0 border ${visual.crestClassName} ${visual.accentClassName}`} />
                        <div className={`relative h-10 w-10 ${visual.crestClassName} border border-white/10 bg-white/[0.06] flex items-center justify-center shadow-lg shadow-black/30`}>
                          <Icon className="h-5 w-5" style={{ color: visual.iconTint }} />
                        </div>
                      </motion.div>
                      <span className="relative text-[10px] font-black uppercase tracking-tight leading-tight text-white/90 line-clamp-2">
                        {badge}
                      </span>
                      <span className="relative rounded-full border border-white/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/65">
                        {visual.title}
                      </span>
                    </motion.div>
                  );
                })}
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

          {/* Games */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mini-Games</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#7F77DD]">New</div>
              </div>
              <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-100 bg-[radial-gradient(420px_circle_at_20%_0%,rgba(127,119,221,0.22)_0%,transparent_58%),radial-gradient(420px_circle_at_80%_100%,rgba(16,185,129,0.12)_0%,transparent_60%)]" />
                <div className="relative space-y-2">
                  <div className="text-base font-black">Practice faster</div>
                  <div className="text-sm font-medium text-white/60">
                    Phishing spotter, matching, and incident drills—short and interactive.
                  </div>
                  <Button
                    className="mt-3 h-11 w-full font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
                    onClick={() => router.push("/games")}
                  >
                    Play Games
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
