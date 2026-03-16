import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Trophy, 
  Flame, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Star,
  Target,
  BarChart,
  Calendar,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

const mockLearningPath = {
  userWeaknesses: [
    { topic: "NIST Framework", score: 42, color: "#E24B4A" },
    { topic: "Risk Framing", score: 58, color: "#BA7517" },
    { topic: "Quantitative Analysis", score: 85, color: "#1D9E75" },
  ],
  nodes: [
    {
      id: "1",
      title: "Risk Governance II",
      reason: "Based on your 42% score in NIST Framework, this course will reinforce structural controls.",
      time: "45m",
      xp: "1,200 XP",
      status: "Recommended",
      current: true
    },
    {
      id: "2",
      title: "Advanced Threat Modeling",
      reason: "Master risk framing to progress towards your Senior Analyst certification.",
      time: "1h 20m",
      xp: "2,500 XP",
      status: "Locked",
      current: false
    },
    {
      id: "3",
      title: "Enterprise Resilience Strategy",
      reason: "Final requirement for Professional tier learning path.",
      time: "2h 10m",
      xp: "4,000 XP",
      status: "Locked",
      current: false
    }
  ]
};

export default function LearningPath() {
  const router = useRouter();
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading learning path...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Learning Path Locked"
        description="Start a demo session to view your AI-generated roadmap, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#7F77DD]" />
              <span className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Personalized Roadmap</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Your Learning Path</h1>
            <p className="text-muted-foreground text-sm font-medium">AI-generated strategy based on your latest performance and career goals.</p>
          </div>
          <div className="bg-[#7F77DD]/10 border border-[#7F77DD]/20 rounded-[12px] p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#7F77DD] flex items-center justify-center text-white font-black">
              {user.level}
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Current Tier</p>
              <p className="text-sm font-bold uppercase tracking-tight">Sentinel Analyst</p>
            </div>
          </div>
        </header>

        {/* Weakness Analysis */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <BarChart className="h-5 w-5 text-muted-foreground" /> Proficiency Analysis
          </h2>
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockLearningPath.userWeaknesses.map((w) => (
                <div key={w.topic} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground">{w.topic}</span>
                    <span className="text-sm font-black" style={{ color: w.color }}>{w.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out" 
                      style={{ width: `${w.score}%`, backgroundColor: w.color }} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Path Timeline */}
        <section className="space-y-8 relative">
          <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" /> Recommended Next Steps
          </h2>
          
          {/* Vertical line connector */}
          <div className="absolute left-[23px] top-[100px] bottom-0 w-[2px] bg-gradient-to-b from-[#7F77DD] to-transparent z-0" />

          <div className="space-y-12 relative z-10">
            {mockLearningPath.nodes.map((node, idx) => (
              <div key={node.id} className="flex gap-8 group">
                {/* Node indicator */}
                <div className="shrink-0">
                  <div className={cn(
                    "h-12 w-12 rounded-full border-[3px] flex items-center justify-center bg-white dark:bg-zinc-900 transition-all duration-500",
                    node.current ? "border-[#7F77DD] shadow-[0_0_15px_rgba(127,119,221,0.3)]" : "border-zinc-200"
                  )}>
                    {node.status === 'Locked' ? (
                      <Lock className="h-5 w-5 text-zinc-300" />
                    ) : node.status === 'Recommended' ? (
                      <div className="h-3 w-3 bg-[#7F77DD] rounded-full animate-pulse" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-[#1D9E75]" />
                    )}
                  </div>
                </div>

                {/* Node Content */}
                <div className="flex-1">
                  <Card className={cn(
                    "transition-all duration-300",
                    node.current ? "border-[#7F77DD] bg-[#7F77DD]/5" : "border-zinc-100 dark:border-zinc-800 opacity-60"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              node.current ? "text-[#7F77DD]" : "text-muted-foreground"
                            )}>
                              {node.status}
                            </span>
                            <span className="text-[10px] text-zinc-300">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{node.time} · {node.xp}</span>
                          </div>
                          <h3 className="text-xl font-black uppercase tracking-tight">{node.title}</h3>
                          <div className="flex gap-3 bg-zinc-950/5 dark:bg-white/5 p-3 rounded-[8px] border-[0.5px]">
                            <div className="h-6 w-6 rounded-full bg-[#7F77DD] flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">S</div>
                            <p className="text-sm font-medium text-muted-foreground leading-snug">"{node.reason}"</p>
                          </div>
                        </div>
                        {node.current && (
                          <Button
                            className="bg-[#7F77DD] text-white hover:bg-[#7F77DD]/90 font-black uppercase tracking-widest text-xs px-8 h-12 shadow-lg shadow-[#7F77DD]/20"
                            onClick={() => router.push("/my-courses")}
                          >
                            Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer info */}
        <div className="pt-10 pb-20 text-center">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">You're making great progress, Alex.</p>
          <div className="flex justify-center gap-10">
            <div className="text-center">
              <p className="text-2xl font-black italic tracking-tighter">84%</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Path Completion</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black italic tracking-tighter">12</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Badges Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black italic tracking-tighter">3</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Certifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
