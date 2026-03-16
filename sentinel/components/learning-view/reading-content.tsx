import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ReadingContentProps {
  title: string;
  body: string;
  onComplete: () => void;
  onAskSentinel: (text: string) => void;
}

export function ReadingContent({ title, body, onComplete, onAskSentinel }: ReadingContentProps) {
  const [tooltip, setTooltip] = useState<{ x: number, y: number, text: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTooltip({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 40,
        text: selection.toString().trim()
      });
    } else {
      setTooltip(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || hasCompleted) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight * 0.9) {
        setHasCompleted(true);
        onComplete();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasCompleted, onComplete]);

  return (
    <div 
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="space-y-8 pb-20 select-text relative"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#7F77DD]" />
          <span className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Reading Module</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">{title}</h1>
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <span>8 min read</span>
          <span>•</span>
          <span>Topic: Strategy</span>
        </div>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {body.split('\n\n').map((para, i) => (
          <p key={i} className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6">
            {para}
          </p>
        ))}
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            style={{ left: tooltip.x, top: tooltip.y }}
            onClick={() => {
              onAskSentinel(tooltip.text);
              setTooltip(null);
            }}
            className="fixed -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white rounded-[8px] text-[10px] font-bold uppercase tracking-widest shadow-xl ring-4 ring-black/5"
          >
            <Sparkles className="h-3 w-3 text-[#7F77DD]" />
            Ask Sentinel about this
          </motion.button>
        )}
      </AnimatePresence>

      {hasCompleted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-6 bg-teal-500/5 border border-teal-500/20 rounded-[12px] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-teal-700">Reading Complete</p>
              <p className="text-xs text-teal-600/80 font-medium">+50 XP Earned for focus</p>
            </div>
          </div>
          <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Scroll verified</div>
        </motion.div>
      )}
    </div>
  );
}
