import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Trophy as TrophyIcon,
  Lock,
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBadgeVisual, type BadgeRarity } from "@/lib/badges";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Completion", "Streak", "Performance", "Social", "Seasonal"];

type BadgeProgress = { current: number; goal: number }

type Badge = {
  id: number
  name: string
  category: string
  earned: boolean
  date?: string
  xp: number
  description: string
  progress?: BadgeProgress
  rarity: BadgeRarity
}

const rarityTheme: Record<
  BadgeRarity,
  { label: string; accent: string; ring: string }
> = {
  Common: {
    label: "Common",
    accent: "#A3A3A3",
    ring: "rgba(255,255,255,0.10)",
  },
  Rare: {
    label: "Rare",
    accent: "#38BDF8",
    ring: "rgba(56,189,248,0.28)",
  },
  Epic: {
    label: "Epic",
    accent: "#7F77DD",
    ring: "rgba(127,119,221,0.30)",
  },
  Legendary: {
    label: "Legendary",
    accent: "#BA7517",
    ring: "rgba(186,117,23,0.28)",
  },
}

const mockBadges: Badge[] = [
  {
    id: 1,
    name: "Fast Learner",
    category: "Completion",
    earned: true,
    date: "2026-03-01",
    xp: 150,
    description: "Completed 5 lessons in a single day.",
    rarity: "Rare",
  },
  {
    id: 2,
    name: "Streak Master",
    category: "Streak",
    earned: true,
    date: "2026-03-12",
    xp: 300,
    description: "Maintained a 14-day learning streak.",
    rarity: "Epic",
  },
  {
    id: 3,
    name: "Quiz Whiz",
    category: "Performance",
    earned: true,
    date: "2026-03-05",
    xp: 500,
    description: "Achieved 100% on any major exam.",
    rarity: "Legendary",
  },
  {
    id: 4,
    name: "Team Player",
    category: "Social",
    earned: false,
    progress: { current: 3, goal: 5 },
    xp: 200,
    description: "Shared 5 learning resources with your team.",
    rarity: "Common",
  },
  {
    id: 5,
    name: "Winter Sprint",
    category: "Seasonal",
    earned: false,
    progress: { current: 2, goal: 10 },
    xp: 1000,
    description: "Complete 10 modules during the winter event.",
    rarity: "Epic",
  },
  {
    id: 6,
    name: "Risk Analyst I",
    category: "Performance",
    earned: true,
    date: "2026-03-14",
    xp: 400,
    description: "Mastered foundational risk assessment concepts.",
    rarity: "Epic",
  },
  {
    id: 7,
    name: "Safety First",
    category: "Performance",
    earned: true,
    date: "2026-02-28",
    xp: 250,
    description: "Passed all safety protocols on first attempt.",
    rarity: "Rare",
  },
  {
    id: 8,
    name: "Early Bird",
    category: "Social",
    earned: false,
    progress: { current: 8, goal: 10 },
    xp: 150,
    description: "Completed 10 lessons before 8:00 AM.",
    rarity: "Rare",
  },
  {
    id: 9,
    name: "Course Finisher",
    category: "Completion",
    earned: false,
    progress: { current: 2, goal: 6 },
    xp: 220,
    description: "Finish 6 full courses from start to completion.",
    rarity: "Common",
  },
  {
    id: 10,
    name: "Module Marathon",
    category: "Completion",
    earned: false,
    progress: { current: 11, goal: 20 },
    xp: 450,
    description: "Complete 20 modules in a single quarter.",
    rarity: "Rare",
  },
  {
    id: 11,
    name: "Speed Closer",
    category: "Completion",
    earned: false,
    progress: { current: 1, goal: 3 },
    xp: 650,
    description: "Finish 3 assigned courses before their deadline.",
    rarity: "Epic",
  },
  {
    id: 12,
    name: "Seven-Day Spark",
    category: "Streak",
    earned: false,
    progress: { current: 5, goal: 7 },
    xp: 120,
    description: "Keep your learning streak alive for 7 days straight.",
    rarity: "Common",
  },
  {
    id: 13,
    name: "Monthly Momentum",
    category: "Streak",
    earned: false,
    progress: { current: 14, goal: 30 },
    xp: 500,
    description: "Reach a 30-day continuous learning streak.",
    rarity: "Legendary",
  },
  {
    id: 14,
    name: "Weekend Warrior",
    category: "Streak",
    earned: false,
    progress: { current: 2, goal: 4 },
    xp: 180,
    description: "Study on four consecutive weekends.",
    rarity: "Rare",
  },
  {
    id: 15,
    name: "Policy Pro",
    category: "Performance",
    earned: false,
    progress: { current: 3, goal: 5 },
    xp: 260,
    description: "Score above 90% on 5 compliance assessments.",
    rarity: "Rare",
  },
  {
    id: 16,
    name: "Perfect Recall",
    category: "Performance",
    earned: false,
    progress: { current: 1, goal: 4 },
    xp: 700,
    description: "Get a perfect score in 4 different knowledge checks.",
    rarity: "Legendary",
  },
  {
    id: 17,
    name: "Incident Ace",
    category: "Performance",
    earned: false,
    progress: { current: 2, goal: 6 },
    xp: 380,
    description: "Complete 6 incident drills without a critical mistake.",
    rarity: "Epic",
  },
  {
    id: 18,
    name: "Discussion Starter",
    category: "Social",
    earned: false,
    progress: { current: 1, goal: 5 },
    xp: 160,
    description: "Start 5 team discussions around a learning topic.",
    rarity: "Common",
  },
  {
    id: 19,
    name: "Mentor Signal",
    category: "Social",
    earned: false,
    progress: { current: 0, goal: 3 },
    xp: 320,
    description: "Help 3 teammates finish a stalled assignment.",
    rarity: "Epic",
  },
  {
    id: 20,
    name: "Knowledge Courier",
    category: "Social",
    earned: false,
    progress: { current: 4, goal: 12 },
    xp: 260,
    description: "Share 12 useful resources with your workspace.",
    rarity: "Rare",
  },
  {
    id: 21,
    name: "Spring Protocol",
    category: "Seasonal",
    earned: false,
    progress: { current: 0, goal: 8 },
    xp: 540,
    description: "Complete the full spring readiness challenge set.",
    rarity: "Epic",
  },
  {
    id: 22,
    name: "Quarter Crusher",
    category: "Seasonal",
    earned: false,
    progress: { current: 6, goal: 12 },
    xp: 420,
    description: "Earn 12 seasonal challenge points this quarter.",
    rarity: "Rare",
  },
  {
    id: 23,
    name: "Holiday Watch",
    category: "Seasonal",
    earned: false,
    progress: { current: 0, goal: 1 },
    xp: 900,
    description: "Finish the limited-time holiday threat simulation event.",
    rarity: "Legendary",
  },
];

export default function Achievements() {
  const { user, loading, login } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const earnedBadges = mockBadges.filter((badge) => badge.earned);
  const totalBadgeXp = earnedBadges.reduce((sum, badge) => sum + badge.xp, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading achievements...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Achievements Locked"
        description="Start a demo session to view your badges and progress, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-[#7F77DD]" />
              <span className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Hall of Fame</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Your Achievements</h1>
            <p className="text-white/60 text-sm font-medium">Tracking milestones on your path to becoming a Sentinel Elite.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:gap-10">
            <div className="text-center">
              <p className="text-2xl font-black italic tracking-tighter">
                {earnedBadges.length}/{mockBadges.length}
              </p>
              <p className="text-[10px] font-black text-white/55 uppercase tracking-widest">Badges Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black italic tracking-tighter">{totalBadgeXp}</p>
              <p className="text-[10px] font-black text-white/55 uppercase tracking-widest">XP from Badges</p>
            </div>
          </div>
        </header>

        {categories.map((cat) => (
          <section key={cat} className="space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7F77DD] rounded-full" /> {cat}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {mockBadges.filter(b => b.category === cat).map((badge) => {
                const theme = rarityTheme[badge.rarity]
                const visual = getBadgeVisual(badge.name, badge.rarity)
                const Icon = visual.icon
                const progressPct = badge.progress ? Math.min(100, Math.round((badge.progress.current / badge.progress.goal) * 100)) : 0
                return (
                <motion.div 
                  key={badge.id} 
                  whileHover={{
                    y: visual.hover.y,
                    scale: visual.hover.scale,
                    rotate: visual.hover.rotate,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="cursor-pointer group"
                >
                  <Card className={cn(
                    "aspect-square flex flex-col items-center justify-center p-4 transition-all duration-300 relative overflow-hidden border",
                    badge.earned
                      ? "border-white/10"
                      : "border-white/10 bg-black/30 grayscale-[0.35] opacity-90"
                  )}>
                    <div
                      className={cn("absolute inset-0 opacity-100", !badge.earned && "saturate-0 brightness-[0.72]")}
                      style={{
                        backgroundImage: visual.panelBackground,
                      }}
                    />
                    <div
                      className={cn("absolute inset-3 rounded-[26px] border border-white/5 opacity-80", !badge.earned && "opacity-50")}
                      style={{ backgroundImage: visual.patternBackground }}
                    />
                    {!badge.earned && (
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.10)_0%,rgba(3,7,18,0.34)_100%)]" />
                    )}
                    {badge.earned &&
                      visual.sparkles.map((sparkle, index) => (
                        <motion.span
                          key={`${badge.id}-sparkle-${index}`}
                          className="absolute rounded-full bg-white/80 blur-[1px]"
                          style={{
                            top: sparkle.top,
                            left: sparkle.left,
                            width: sparkle.size,
                            height: sparkle.size,
                            boxShadow: `0 0 18px ${visual.accent}`,
                          }}
                          animate={{
                            x: [0, sparkle.driftX, 0],
                            y: [0, sparkle.driftY, 0],
                            opacity: [0.25, 0.9, 0.25],
                            scale: [0.9, 1.15, 0.9],
                          }}
                          transition={{
                            duration: sparkle.duration,
                            delay: sparkle.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className="absolute -inset-10 rotate-12 -translate-x-[60%] group-hover:translate-x-[60%] transition-transform duration-700 ease-out"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%)",
                        }}
                      />
                    </div>

                    <motion.div
                      className={cn(
                        "relative h-14 w-14 flex items-center justify-center mb-3 transition-all border shadow-2xl",
                        visual.crestClassName,
                        badge.earned ? "text-white" : "text-white/55"
                      )}
                      style={{
                        background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)`,
                        borderColor: badge.earned ? theme.ring : "rgba(255,255,255,0.10)",
                        boxShadow: badge.earned ? `0 0 0 1px ${theme.ring}, 0 14px 40px rgba(0,0,0,0.45)` : undefined,
                      }}
                      whileHover={badge.earned ? { rotate: visual.hover.iconRotate, scale: visual.hover.iconScale } : { scale: 1.04 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <div
                        className={cn(
                          "absolute inset-[5px] border",
                          visual.crestClassName,
                          badge.earned ? visual.accentClassName : "bg-white/5 border-white/10"
                        )}
                      />
                      <Icon
                        className="relative h-6 w-6"
                        style={{ color: badge.earned ? visual.iconTint : "rgba(255,255,255,0.55)" }}
                      />
                    </motion.div>

                    <div className="relative w-full space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[9px] font-black uppercase tracking-widest"
                          style={{ color: badge.earned ? theme.accent : "rgba(255,255,255,0.45)" }}
                        >
                          {theme.label}
                        </span>
                        {badge.earned ? (
                          <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white/65">
                            <Sparkles className="h-3 w-3" />
                            Earned
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white/45">
                            <Lock className="h-3 w-3" />
                            Available
                          </div>
                        )}
                      </div>

                      <span className="block text-[10px] font-black text-center uppercase tracking-tighter leading-tight text-white/90">
                        {badge.name}
                      </span>
                      <div className="flex justify-center">
                        <span
                          className="rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.28em] text-white/70"
                          style={{ borderColor: badge.earned ? theme.ring : "rgba(255,255,255,0.10)" }}
                        >
                          {badge.earned ? visual.title : "Earn Next"}
                        </span>
                      </div>

                      {!badge.earned && badge.progress && (
                        <div className="mt-1.5 w-full">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/45 mb-1">
                            <span>Progress</span>
                            <span>
                              {badge.progress.current}/{badge.progress.goal}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                            <div
                              className="h-full"
                              style={{
                                width: `${progressPct}%`,
                                backgroundImage: `linear-gradient(90deg, ${theme.accent} 0%, rgba(255,255,255,0.40) 100%)`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )})}
            </div>
          </section>
        ))}

        <AnimatePresence>
          {selectedBadge && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-black/70 rounded-[20px] max-w-md w-full overflow-hidden border border-white/10 shadow-2xl"
              >
                {(() => {
                  const theme = rarityTheme[selectedBadge.rarity]
                  const visual = getBadgeVisual(selectedBadge.name, selectedBadge.rarity)
                  const Icon = visual.icon
                  const progressPct = selectedBadge.progress
                    ? Math.min(100, Math.round((selectedBadge.progress.current / selectedBadge.progress.goal) * 100))
                    : 0
                  return (
                    <>
                      <div
                        className="p-8 flex flex-col items-center text-white relative border-b border-white/10"
                        style={{
                          backgroundImage: visual.panelBackground,
                        }}
                      >
                        <div
                          className="absolute inset-4 rounded-[22px] border border-white/5 opacity-90"
                          style={{ backgroundImage: visual.patternBackground }}
                        />
                        <motion.div
                          className={cn("relative h-20 w-20 flex items-center justify-center mb-5 shadow-2xl border", visual.crestClassName)}
                          style={{
                            background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
                            borderColor: theme.ring,
                            boxShadow: `0 0 0 1px ${theme.ring}, 0 18px 60px rgba(0,0,0,0.55)`,
                          }}
                          animate={selectedBadge.earned ? { y: [0, -4, 0], rotate: [0, visual.hover.iconRotate / 2, 0] } : undefined}
                          transition={selectedBadge.earned ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" } : undefined}
                        >
                          <div
                            className={cn("absolute inset-[10px] border opacity-90", visual.crestClassName, visual.accentClassName)}
                          />
                          <Icon className="relative h-9 w-9" style={{ color: visual.iconTint }} />
                        </motion.div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-1">
                          {selectedBadge.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                            style={{ borderColor: theme.ring, color: "rgba(255,255,255,0.90)" }}
                          >
                            {selectedBadge.category}
                          </div>
                          <div
                            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                            style={{ borderColor: theme.ring, color: theme.accent }}
                          >
                            {theme.label}
                          </div>
                          <div
                            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                            style={{ borderColor: theme.ring, color: "rgba(255,255,255,0.78)" }}
                          >
                            {visual.title}
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedBadge(null)}
                          className="absolute top-4 right-4 h-9 w-9 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center transition-colors"
                          aria-label="Close badge details"
                        >
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </button>
                      </div>

                      <div className="p-8 space-y-6">
                  <div className="space-y-2">
                          <p className="text-[10px] font-black text-white/55 uppercase tracking-widest">Description</p>
                          <p className="text-sm font-medium leading-relaxed text-white/85">{selectedBadge.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/[0.03] rounded-[14px] border border-white/10">
                            <p className="text-[9px] font-black text-white/55 uppercase tracking-widest mb-1">XP Value</p>
                            <p className="text-lg font-black italic" style={{ color: theme.accent }}>
                              {selectedBadge.xp} XP
                            </p>
                    </div>
                          <div className="p-4 bg-white/[0.03] rounded-[14px] border border-white/10">
                            <p className="text-[9px] font-black text-white/55 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-lg font-black italic">
                              {selectedBadge.earned ? selectedBadge.date : "Locked"}
                            </p>
                    </div>
                  </div>

                  {!selectedBadge.earned && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-white/70">Progress</span>
                              <span className="text-white/70">
                                {selectedBadge.progress?.current}/{selectedBadge.progress?.goal}
                              </span>
                      </div>
                            <Progress value={progressPct} className="h-2" />
                    </div>
                  )}

                        <Button
                          className="w-full text-white font-black uppercase tracking-widest text-xs h-12 shadow-lg"
                          style={{
                            backgroundImage: `linear-gradient(90deg, ${theme.accent} 0%, rgba(255,255,255,0.22) 100%)`,
                            boxShadow: `0 18px 60px rgba(0,0,0,0.55), 0 0 0 1px ${theme.ring}`,
                          }}
                        >
                          {selectedBadge.earned ? "Share Achievement" : "Keep Going"}
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
