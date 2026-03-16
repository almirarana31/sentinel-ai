import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Trophy, 
  Flame, 
  ChevronRight, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/router";

const mockSummary = {
  courseTitle: "Risk Assessment Fundamentals",
  moduleName: "Module 2: Advanced Risk Assessment",
  earnedXp: 310,
  correctAnswers: 8,
  totalQuestions: 10,
  confidenceBonus: "2.4x",
  streakCount: 14,
  unlockedBadge: {
    name: "Risk Analyst I",
    icon: <Trophy className="h-10 w-10 text-[#7F77DD]" />,
    description: "Successfully mastered foundational risk modeling concepts."
  },
  aiInsight: "You excelled at identifying structural vulnerabilities, but watch your confidence on NIST framing—it's still your weakest area. You're currently 140 XP behind Jordan R. on the leaderboard. Keep this pace up to overtake them by Tuesday!"
};

export default function PostLessonSummary() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [xpDisplay, setXpDisplay] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Initial celebration
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7F77DD', '#1D9E75', '#BA7517']
    });

    // Animate XP count-up (800ms)
    const startTime = performance.now();
    const duration = 800;
    const targetXp = mockSummary.earnedXp;

    const animateXp = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setXpDisplay(Math.round(easedProgress * targetXp));

      if (progress < 1) {
        requestAnimationFrame(animateXp);
      } else {
        setShowContent(true);
      }
    };

    requestAnimationFrame(animateXp);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading summary...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Summary Locked"
        description="Start a demo session to view your post-lesson summary, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7F77DD]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl w-full relative z-10 space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7F77DD]/20 border border-[#7F77DD]/30 rounded-full text-xs font-bold text-[#7F77DD] uppercase tracking-widest mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Module Complete
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic"
          >
            Mission Accomplished
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 font-medium text-lg"
          >
            {mockSummary.courseTitle} · {mockSummary.moduleName}
          </motion.p>
        </div>

        {/* XP Counter Section */}
        <div className="text-center py-10 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative inline-block"
          >
            <span className="text-8xl md:text-9xl font-black tracking-tighter text-[#7F77DD] drop-shadow-[0_0_30px_rgba(127,119,221,0.4)]">
              {xpDisplay}
            </span>
            <span className="absolute -right-12 bottom-6 text-2xl font-black text-white/50 uppercase italic">XP</span>
          </motion.div>
        </div>

        {/* Stat Cards Grid */}
        <AnimatePresence>
          {showContent && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden group">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="h-10 w-10 bg-[#1D9E75]/20 rounded-full flex items-center justify-center mx-auto text-[#1D9E75] mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Accuracy</p>
                  <p className="text-2xl font-black">{mockSummary.correctAnswers}/{mockSummary.totalQuestions}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="h-10 w-10 bg-[#BA7517]/20 rounded-full flex items-center justify-center mx-auto text-[#BA7517] mb-2">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Multiplier</p>
                  <p className="text-2xl font-black">{mockSummary.confidenceBonus}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="h-10 w-10 bg-[#7F77DD]/20 rounded-full flex items-center justify-center mx-auto text-[#7F77DD] mb-2">
                    <Flame className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Streak</p>
                  <p className="text-2xl font-black">{mockSummary.streakCount}d</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge Unlocked Section */}
        {showContent && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-[#7F77DD]/20 to-transparent border-[#7F77DD]/40 border-[2px] backdrop-blur-md p-1">
              <CardContent className="p-6 flex items-center gap-6">
                <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(127,119,221,0.3)]">
                  {mockSummary.unlockedBadge.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-3 w-3 text-[#7F77DD] fill-[#7F77DD]" />
                    <span className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">New Badge Unlocked</span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-1">{mockSummary.unlockedBadge.name}</h3>
                  <p className="text-white/60 text-sm leading-snug">{mockSummary.unlockedBadge.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sentinel Insight */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="p-6 flex gap-4">
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950 font-black shrink-0 mt-1">
                  S
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-2">Sentinel Insight</span>
                  <p className="text-sm font-medium text-amber-100 italic leading-relaxed">
                    "{mockSummary.aiInsight}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTAs */}
        {showContent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col md:flex-row gap-4 pt-4"
          >
            <Button
              size="lg"
              className="flex-1 bg-white text-[#7F77DD] hover:bg-zinc-100 font-black uppercase tracking-widest text-sm h-14"
              onClick={() => router.push("/learning-path")}
            >
              Continue to Risk Governance II <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent hover:bg-white/5 font-black uppercase tracking-widest text-sm h-14"
              onClick={() => window.open("https://www.linkedin.com", "_blank")}
            >
              <Share2 className="h-5 w-5 mr-2" /> Share on LinkedIn
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
