import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, Maximize, Clock, FastForward, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  url: string;
  onComplete: () => void;
  onMilestone: (pct: number) => void;
}

export function VideoPlayer({ url, onComplete, onMilestone }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showComprehensionCheck, setShowComprehensionCheck] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [milestones, setMilestones] = useState<number[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);

      // Milestone pings at 25, 50, 75, 100
      [25, 50, 75, 100].forEach(m => {
        if (pct >= m && !milestones.includes(m)) {
          setMilestones(prev => [...prev, m]);
          onMilestone(m);
          if (m === 100) onComplete();
        }
      });

      // Pause every 5 minutes (300s) for comprehension check
      if (videoRef.current.currentTime - lastCheckTime >= 300) {
        setIsPlaying(false);
        videoRef.current.pause();
        setShowComprehensionCheck(true);
        setLastCheckTime(videoRef.current.currentTime);
      }
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative group rounded-[12px] overflow-hidden bg-black aspect-video shadow-2xl">
      <video
        ref={videoRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
      />

      {/* Custom Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="space-y-4">
          {/* Scrubber */}
          <div className="relative h-1.5 w-full bg-white/20 rounded-full cursor-pointer group/scrub">
            <div 
              className="absolute inset-y-0 left-0 bg-[#7F77DD] rounded-full"
              style={{ width: `${progress}%` }}
            />
            {/* Chapter markers */}
            {[25, 50, 75].map(m => (
              <div key={m} className="absolute inset-y-0 w-0.5 bg-white/30" style={{ left: `${m}%` }} />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:text-[#7F77DD] transition-colors">
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <button className="text-white hover:text-[#7F77DD] transition-colors">
                <RotateCcw className="h-5 w-5" />
              </button>
              <div className="text-xs font-bold text-white/80 tabular-nums">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-black uppercase text-white tracking-widest"
                >
                  {playbackSpeed}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 p-1 bg-zinc-900 border border-white/10 rounded-md flex flex-col min-w-[80px]">
                    {[0.75, 1, 1.25, 1.5, 2].map(s => (
                      <button 
                        key={s}
                        onClick={() => {
                          setPlaybackSpeed(s);
                          if (videoRef.current) videoRef.current.playbackRate = s;
                          setShowSpeedMenu(false);
                        }}
                        className={cn(
                          "px-3 py-1.5 text-[10px] font-bold text-left hover:bg-white/10 rounded",
                          playbackSpeed === s ? "text-[#7F77DD]" : "text-white"
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="text-white hover:text-[#7F77DD] transition-colors"><Volume2 className="h-5 w-5" /></button>
              <button className="text-white hover:text-[#7F77DD] transition-colors"><Maximize className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehension Check Overlay */}
      <AnimatePresence>
        {showComprehensionCheck && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-8 z-50"
          >
            <div className="max-w-md text-center space-y-6">
              <div className="h-12 w-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Comprehension Check</h3>
                <p className="text-zinc-400 text-sm">Quick check: We just covered Risk Framing. Is framing about defining the boundaries of the assessment?</p>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={() => {
                    setShowComprehensionCheck(false);
                    videoRef.current?.play();
                    setIsPlaying(true);
                  }}
                  className="flex-1 bg-white text-[#7F77DD] font-black uppercase tracking-widest text-xs h-12"
                >
                  Yes, continue
                </Button>
                <Button variant="outline" className="flex-1 border-white/20 bg-transparent text-white font-black uppercase tracking-widest text-xs h-12">
                  Rewatch last 30s
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
