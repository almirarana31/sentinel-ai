import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Trophy, 
  Flame, 
  GraduationCap, 
  Trophy as TrophyIcon,
  Shield,
  Zap,
  Star,
  Lock,
  Calendar,
  ChevronRight,
  Info,
  Users,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Completion", "Streak", "Performance", "Social", "Seasonal"];

const mockBadges = [
  { id: 1, name: "Fast Learner", category: "Completion", icon: <Zap />, earned: true, date: "2026-03-01", xp: 150, description: "Completed 5 lessons in a single day." },
  { id: 2, name: "Streak Master", category: "Streak", icon: <Flame />, earned: true, date: "2026-03-12", xp: 300, description: "Maintained a 14-day learning streak." },
  { id: 3, name: "Quiz Whiz", category: "Performance", icon: <GraduationCap />, earned: true, date: "2026-03-05", xp: 500, description: "Achieved 100% on any major exam." },
  { id: 4, name: "Team Player", category: "Social", icon: <Users />, earned: false, progress: "3 of 5", xp: 200, description: "Shared 5 learning resources with your team." },
  { id: 5, name: "Winter Sprint", category: "Seasonal", icon: <Star />, earned: false, progress: "2 of 10", xp: 1000, description: "Complete 10 modules during the winter event." },
  { id: 6, name: "Risk Analyst I", category: "Performance", icon: <Trophy />, earned: true, date: "2026-03-14", xp: 400, description: "Mastered foundational risk assessment concepts." },
  { id: 7, name: "Safety First", category: "Compliance", icon: <Shield />, earned: true, date: "2026-02-28", xp: 250, description: "Passed all safety protocols on first attempt." },
  { id: 8, name: "Early Bird", category: "Social", icon: <Clock />, earned: false, progress: "8 of 10", xp: 150, description: "Completed 10 lessons before 8:00 AM." },
];

export default function Achievements() {
  const { user, loading, login } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-[#7F77DD]" />
              <span className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Hall of Fame</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Your Achievements</h1>
            <p className="text-muted-foreground text-sm font-medium">Tracking milestones on your path to becoming a Sentinel Elite.</p>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-center">
              <p className="text-2xl font-black italic tracking-tighter">14</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Badges Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black italic tracking-tighter">3,250</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">XP from Badges</p>
            </div>
          </div>
        </header>

        {categories.map((cat) => (
          <section key={cat} className="space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7F77DD] rounded-full" /> {cat}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {mockBadges.filter(b => b.category === cat || (cat === "Performance" && b.category === "Compliance")).map((badge) => (
                <motion.div 
                  key={badge.id} 
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="cursor-pointer group"
                >
                  <Card className={cn(
                    "aspect-square flex flex-col items-center justify-center p-4 transition-all duration-300 relative overflow-hidden",
                    badge.earned ? "border-[#7F77DD]/70 bg-white/[0.04]" : "border-white/10 bg-white/[0.02] opacity-60 grayscale"
                  )}>
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center mb-3 transition-colors",
                      badge.earned ? "bg-[#7F77DD]/12 text-[#7F77DD]" : "bg-white/5 text-white/35"
                    )}>
                      {badge.icon}
                    </div>
                    <span className="text-[10px] font-black text-center uppercase tracking-tighter leading-tight">{badge.name}</span>
                    {!badge.earned && (
                      <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white/25" style={{ width: '40%' }} />
                      </div>
                    )}
                    {badge.earned && (
                      <div className="absolute top-0 right-0 h-8 w-8 bg-[#7F77DD] flex items-center justify-center -mr-4 -mt-4 rotate-45">
                        <Star className="h-3 w-3 text-white -rotate-45" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
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
                className="bg-white dark:bg-zinc-900 rounded-[20px] max-w-md w-full overflow-hidden border-[0.5px] border-zinc-200 shadow-2xl"
              >
                <div className="bg-[#7F77DD] p-8 flex flex-col items-center text-white relative">
                  <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-[#7F77DD] mb-6 shadow-xl">
                    {selectedBadge.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-1">{selectedBadge.name}</h3>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30 mb-2">
                    {selectedBadge.category}
                  </div>
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className="absolute top-4 right-4 h-8 w-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</p>
                    <p className="text-sm font-medium leading-relaxed">{selectedBadge.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-[12px] border-[0.5px]">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">XP Value</p>
                      <p className="text-lg font-black text-[#7F77DD] italic">{selectedBadge.xp} XP</p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-[12px] border-[0.5px]">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Earned On</p>
                      <p className="text-lg font-black italic">{selectedBadge.date || "Locked"}</p>
                    </div>
                  </div>

                  {!selectedBadge.earned && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{selectedBadge.progress}</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  )}

                  <Button className="w-full bg-[#7F77DD] text-white font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#7F77DD]/20">
                    Share Achievement
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
