import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Timer, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface KnowledgeCheckProps {
  content: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onCorrect: () => void;
  onWrong: () => void;
  onContinue?: () => void;
}

export function KnowledgeCheck({ content, onCorrect, onWrong, onContinue }: KnowledgeCheckProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confidence, setConfidence] = useState<'Sure' | 'Unsure' | 'Guessing'>('Sure');
  const [timerProgress, setTimerProgress] = useState(100);
  const [xpBonus, setXpBonus] = useState(25);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimerProgress(prev => {
        const next = Math.max(0, prev - 0.2);
        if (next < 40) setXpBonus(prevBonus => Math.max(0, prevBonus - 0.1));
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === content.correctAnswer) {
      onCorrect();
    } else {
      onWrong();
    }
  };

  const timerColor = timerProgress < 15 ? 'bg-[#E24B4A]' : timerProgress < 40 ? 'bg-[#BA7517]' : 'bg-[#1D9E75]';

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#7F77DD] uppercase tracking-widest">Knowledge Check</span>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#7F77DD]">+{Math.round(xpBonus)} XP BONUS</span>
              <div className="w-24 h-1.5 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-300", timerColor)} 
                  style={{ width: `${timerProgress}%` }} 
                />
              </div>
            </div>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            {['Guessing', 'Unsure', 'Sure'].map((tier) => (
              <button
                key={tier}
                disabled={isSubmitted}
                onClick={() => setConfidence(tier as any)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold border-[0.5px] transition-all",
                  confidence === tier
                    ? "bg-[#7F77DD] border-[#7F77DD] text-white"
                    : "bg-white/80 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white/70 hover:border-[#7F77DD]/50",
                  isSubmitted && "opacity-50 cursor-not-allowed"
                )}
              >
                {tier} · {tier === 'Sure' ? '3×' : tier === 'Unsure' ? '1.5×' : '1×'} XP
              </button>
            ))}
          </div>

          <h2 className="text-lg font-bold leading-tight">{content.question}</h2>

          <div className="grid gap-3">
            {content.options.map((option, idx) => {
              const isCorrect = idx === content.correctAnswer;
              const isSelected = idx === selectedOption;
              
              let cardStyle = "border-zinc-200 dark:border-white/10 hover:border-[#7F77DD]/50";
              if (isSubmitted) {
                if (isCorrect) cardStyle = "border-[#1D9E75] bg-[#1D9E75]/5 text-[#1D9E75]";
                else if (isSelected) cardStyle = "border-[#E24B4A] bg-[#E24B4A]/5 text-[#E24B4A]";
                else cardStyle = "border-zinc-100 dark:border-white/10 opacity-50";
              } else if (isSelected) {
                cardStyle = "border-[#7F77DD] bg-[#7F77DD]/5 ring-1 ring-[#7F77DD]";
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={cn(
                    "w-full p-4 rounded-[12px] border-[0.5px] text-left transition-all flex items-center justify-between bg-white/70 dark:bg-white/[0.03]",
                    cardStyle
                  )}
                >
                  <span className="text-sm font-medium">{option}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-[#E24B4A]" />}
                </button>
              );
            })}
          </div>
        </div>

        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-[12px] border-[0.5px]",
              selectedOption === content.correctAnswer ? "bg-[#1D9E75]/10 border-[#1D9E75]/30" : "bg-[#E24B4A]/10 border-[#E24B4A]/30"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              {selectedOption === content.correctAnswer ? (
                <span className="text-xs font-bold text-[#1D9E75]">EXCELLENT</span>
              ) : (
                <span className="text-xs font-bold text-[#E24B4A]">INCORRECT</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{content.explanation}</p>
            {selectedOption !== content.correctAnswer && confidence === 'Sure' && (
              <p className="text-[10px] font-bold text-[#E24B4A] mt-2 uppercase tracking-tighter">Penalty: Confidence was 'Sure' and wrong (-15 XP)</p>
            )}
          </motion.div>
        )}

        <div className="flex justify-end pt-4">
          {!isSubmitted ? (
            <Button 
              disabled={selectedOption === null} 
              onClick={handleSubmit}
              className="px-8 font-bold uppercase tracking-widest text-xs"
            >
              Check Answer
            </Button>
          ) : (
            <Button className="px-8 font-bold uppercase tracking-widest text-xs" onClick={() => onContinue?.()}>
              Continue <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
