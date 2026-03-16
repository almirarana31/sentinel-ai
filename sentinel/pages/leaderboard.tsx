import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Trophy, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  TrendingUp,
  Users,
  Globe,
  Medal
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["This Week", "This Month", "All Time"];
const subTabs = ["My Team", "Global"];

const mockLeaderboard = [
  { rank: 1, name: "Sarah K.", level: 12, xp: "3,420", trend: "up", avatar: "SK" },
  { rank: 2, name: "Michael R.", level: 11, xp: "3,150", trend: "same", avatar: "MR" },
  { rank: 3, name: "Jessica W.", level: 10, xp: "2,980", trend: "down", avatar: "JW" },
  { rank: 4, name: "David L.", level: 9, xp: "2,740", trend: "up", avatar: "DL" },
  { rank: 5, name: "Emma S.", level: 9, xp: "2,610", trend: "up", avatar: "ES" },
  { rank: 6, name: "Chris P.", level: 8, xp: "2,450", trend: "down", avatar: "CP" },
  { rank: 7, name: "Olivia M.", level: 8, xp: "2,320", trend: "same", avatar: "OM" },
  { rank: 8, name: "Daniel H.", level: 7, xp: "2,180", trend: "up", avatar: "DH" },
  { rank: 9, name: "Sophia R.", level: 7, xp: "2,050", trend: "down", avatar: "SR" },
  { rank: 10, name: "James B.", level: 6, xp: "1,920", trend: "up", avatar: "JB" },
];

export default function Leaderboard() {
  const { user, loading, login } = useAuth();
  const [activeTab, setActiveTab] = useState("This Week");
  const [activeSubTab, setActiveSubTab] = useState("My Team");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading leaderboard...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Leaderboard Locked"
        description="Start a demo session to enter the competitive arena, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#BA7517]" />
            <span className="text-[10px] font-black text-[#BA7517] uppercase tracking-widest">Competitive Arena</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Leaderboard</h1>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-[10px] border-[0.5px]">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[8px] transition-all",
                    activeTab === tab
                      ? "bg-white dark:bg-zinc-800 shadow-sm text-[#7F77DD]"
                      : "text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-[10px] border-[0.5px]">
              {subTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[8px] transition-all flex items-center gap-2",
                    activeSubTab === tab
                      ? "bg-white dark:bg-zinc-800 shadow-sm text-[#7F77DD]"
                      : "text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {tab === "My Team" ? <Users className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 items-end pt-10 pb-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-16 w-16 bg-zinc-200 dark:bg-white/10 text-zinc-900 dark:text-white rounded-full flex items-center justify-center font-black text-lg border-4 border-zinc-100 dark:border-white/10 shadow-lg">MR</div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-zinc-400 rounded-full flex items-center justify-center text-white text-[10px] font-black">2</div>
            </div>
            <div className="text-center">
              <p className="text-sm font-black truncate max-w-[100px]">Michael R.</p>
              <p className="text-[10px] font-bold text-[#7F77DD]">3,150 XP</p>
            </div>
            <div className="w-full h-16 bg-zinc-100 dark:bg-zinc-900 rounded-t-lg border-t border-x border-zinc-200 dark:border-white/10" />
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-20 w-20 bg-amber-100 dark:bg-amber-500/15 text-amber-950 dark:text-white rounded-full flex items-center justify-center font-black text-xl border-4 border-amber-50 dark:border-amber-500/25 border-amber-500/20 shadow-xl shadow-amber-500/10">SK</div>
              <div className="absolute -top-3 -right-3 h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-[12px] font-black ring-4 ring-white dark:ring-zinc-950">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-black truncate max-w-[120px]">Sarah K.</p>
              <p className="text-[10px] font-bold text-[#7F77DD]">3,420 XP</p>
            </div>
            <div className="w-full h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-t-lg border-t-2 border-x border-amber-500/20" />
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-16 w-16 bg-orange-100 dark:bg-orange-500/15 text-orange-950 dark:text-white rounded-full flex items-center justify-center font-black text-lg border-4 border-orange-50 dark:border-orange-500/25 shadow-lg">JW</div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-[10px] font-black">3</div>
            </div>
            <div className="text-center">
              <p className="text-sm font-black truncate max-w-[100px]">Jessica W.</p>
              <p className="text-[10px] font-bold text-[#7F77DD]">2,980 XP</p>
            </div>
            <div className="w-full h-12 bg-orange-100/30 dark:bg-orange-900/10 rounded-t-lg border-t border-x border-orange-200/60 dark:border-orange-500/15" />
          </div>
        </div>

        {/* List View */}
        <Card className="shadow-none border-[0.5px]">
          <CardContent className="p-0">
            <div className="divide-y">
              {mockLeaderboard.map((player) => (
                <div 
                  key={player.rank} 
                  className={cn(
                    "p-4 flex items-center justify-between transition-colors",
                    player.rank === 12 ? "bg-[#7F77DD]/5" : "hover:bg-zinc-50 dark:hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center text-xs font-black text-muted-foreground">{player.rank}</span>
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-100 rounded-full flex items-center justify-center font-black text-xs border-[0.5px] border-zinc-200 dark:border-white/10">{player.avatar}</div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{player.name}</span>
                        <div className="px-1.5 py-0.5 bg-[#7F77DD]/10 text-[#7F77DD] text-[9px] font-bold rounded uppercase tracking-tighter">Lvl {player.level}</div>
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Sentinel Analyst</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-1.5">
                      {player.trend === "up" && <ArrowUp className="h-3 w-3 text-[#1D9E75]" />}
                      {player.trend === "down" && <ArrowDown className="h-3 w-3 text-[#E24B4A]" />}
                      {player.trend === "same" && <Minus className="h-3 w-3 text-zinc-300" />}
                    </div>
                    <span className="text-sm font-black italic tracking-tighter w-20 text-right">{player.xp} <span className="text-[10px] text-muted-foreground uppercase not-italic">XP</span></span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Persistent User Rank Overlay */}
        <div className="sticky bottom-6 left-0 right-0 z-20">
          <Card className="bg-[#7F77DD] text-white shadow-2xl border-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-black">12</span>
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center font-black text-xs ring-2 ring-white/30">AT</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">You (Alex Trainee)</span>
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">140 XP behind James B.</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <ArrowUp className="h-4 w-4 text-white/50" />
                <span className="text-sm font-black italic tracking-tighter">1,250 <span className="text-[10px] text-white/50 uppercase not-italic">XP</span></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Improved Section */}
        <section className="pt-10 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#7F77DD]" />
            <h2 className="text-sm font-black uppercase tracking-widest">Most Improved This Week</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
            {[
              { name: "Kevin T.", growth: "+84%", avatar: "KT" },
              { name: "Rachel G.", growth: "+62%", avatar: "RG" },
              { name: "Mark V.", growth: "+51%", avatar: "MV" },
              { name: "Chloe L.", growth: "+44%", avatar: "CL" },
            ].map((p, idx) => (
              <Card key={idx} className="shadow-none bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white dark:bg-white/10 text-zinc-900 dark:text-white rounded-full flex items-center justify-center text-[10px] font-black border-[0.5px] border-zinc-200 dark:border-white/10">{p.avatar}</div>
                    <span className="text-xs font-bold">{p.name}</span>
                  </div>
                  <span className="text-xs font-black text-[#1D9E75] italic">{p.growth} growth</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
