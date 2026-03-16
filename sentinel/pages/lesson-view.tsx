import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  TutorPanel, 
  KnowledgeCheck, 
  VideoPlayer, 
  ReadingContent 
} from "@/components/learning-view";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const mockLesson = {
  id: "lesson_1",
  title: "Risk Analysis Frameworks",
  module: "Module 2: Advanced Risk Assessment",
  totalLessons: 12,
  currentLessonIndex: 4,
  xpValue: 150,
  estimatedTime: "8 min",
  type: "knowledge_check",
  content: {
    question: "Which component of the NIST framework focuses on establishing the context for risk assessment?",
    options: [
      "Risk Identification",
      "Risk Framing",
      "Risk Response",
      "Risk Monitoring"
    ],
    correctAnswer: 1,
    explanation: "Risk Framing is the first step in the NIST RMF, setting the constraints and priorities for the rest of the process."
  }
};

const navigationItems = [
  { id: 1, title: "Foundations", time: "4m", status: "completed" },
  { id: 2, title: "Qualitative Methods", time: "6m", status: "completed" },
  { id: 3, title: "Quantitative Risk", time: "10m", status: "completed" },
  { id: 4, title: "Risk Frameworks", time: "8m", status: "active" },
  { id: 5, title: "Case Studies", time: "12m", status: "pending" },
  { id: 6, title: "Final Exam", time: "15m", status: "pending" },
];

export default function LessonView() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [sessionXp, setSessionXp] = useState(0);
  const [xpBursts, setXpBursts] = useState<{ id: number, amount: number }[]>([]);
  const [moduleProgress, setModuleProgress] = useState(65);

  const triggerXpBurst = (amount: number) => {
    const id = Date.now();
    setXpBursts(prev => [...prev, { id, amount }]);
    setSessionXp(prev => prev + amount);
    setTimeout(() => {
      setXpBursts(prev => prev.filter(b => b.id !== id));
    }, 900);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading lesson...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Lesson View Locked"
        description="Start a demo session to continue the lesson, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] dark:bg-zinc-950 overflow-hidden">
      {/* Top Bar (48px height) */}
      <header className="h-[48px] bg-white dark:bg-zinc-900 border-b flex items-center px-4 justify-between z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push("/my-courses")}
            aria-label="Back to courses"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">{mockLesson.module}</span>
            <span className="text-sm font-bold leading-tight">{mockLesson.title}</span>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3 max-w-md">
          <div className="flex justify-between w-full text-[10px] font-bold text-muted-foreground mb-1">
            <span>Lesson {mockLesson.currentLessonIndex} of {mockLesson.totalLessons}</span>
            <span>{moduleProgress}% Module Progress</span>
          </div>
          <Progress 
            value={moduleProgress} 
            className={`h-1.5 transition-colors duration-500 ${moduleProgress >= 100 ? 'bg-teal-500' : moduleProgress >= 70 ? 'bg-amber-500' : 'bg-zinc-100'}`}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.streakAtRisk ? 'bg-amber-100 text-[#BA7517] ring-1 ring-amber-400/50 animate-pulse' : 'bg-[#7F77DD]/10 text-[#7F77DD]'}`}>
            <Flame className="h-3.5 w-3.5" />
            <span>{user.streak}d</span>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7F77DD] text-white text-xs font-bold shadow-sm">
              <span>{sessionXp} XP</span>
            </div>
            {/* XP Burst Overlay */}
            <AnimatePresence>
              {xpBursts.map(burst => (
                <motion.div
                  key={burst.id}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -28, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 top-0 text-[#7F77DD] font-black text-sm pointer-events-none"
                >
                  +{burst.amount} XP
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Navigation Rail (180px) */}
        <aside className="w-[180px] bg-white dark:bg-zinc-900 border-r flex flex-col z-40">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Curriculum</h3>
            {navigationItems.map((item) => (
              <div key={item.id} className="flex gap-3 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.status === 'completed' ? 'bg-[#1D9E75]/10 border-[#1D9E75] text-[#1D9E75]' :
                    item.status === 'active' ? 'border-[#7F77DD] text-[#7F77DD]' :
                    'border-zinc-200 text-zinc-300'
                  }`}>
                    {item.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-bold">{item.id}</span>}
                  </div>
                  {item.id !== navigationItems.length && <div className="w-[2px] flex-1 bg-zinc-100 my-1" />}
                </div>
                <div className="flex flex-col overflow-hidden py-0.5">
                  <span className={`text-[11px] font-bold truncate ${item.status === 'active' ? 'text-[#7F77DD]' : 'text-zinc-600'}`}>
                    {item.title}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Rival Card */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Rival</span>
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-100 rounded-full flex items-center justify-center font-bold text-[10px]">JR</div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold truncate">Jordan R.</span>
                <span className="text-[10px] text-[#7F77DD] font-bold">140 XP ahead</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Column - Content Pane (Flex) */}
        <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-white dark:bg-zinc-950">
          <div className="w-full max-w-2xl">
            {mockLesson.type === 'knowledge_check' && (
              <KnowledgeCheck 
                content={mockLesson.content} 
                onCorrect={() => {
                  triggerXpBurst(50);
                  setModuleProgress(prev => Math.min(100, prev + 5));
                }}
                onWrong={() => {
                  triggerXpBurst(-15);
                }}
                onContinue={() => router.push("/post-lesson-summary")}
              />
            )}
          </div>
        </main>

        {/* Right Column - AI Tutor Panel (200px) */}
        <aside className="w-[240px] bg-[#7F77DD]/5 dark:bg-zinc-900 border-l flex flex-col z-40">
          <TutorPanel />
        </aside>
      </div>
    </div>
  );
}
