import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Zap, 
  Trophy, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Play,
  CheckCircle2,
  Lock
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useConsent } from "@/lib/consent-context";

export default function LandingPage() {
  const router = useRouter();
  const { openSettings } = useConsent();
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-[#7F77DD] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7F77DD] rounded-[6px] flex items-center justify-center shadow-lg shadow-[#7F77DD]/20">
              <span className="font-black text-white text-lg italic">S</span>
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">Sentinel</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-widest text-zinc-500">
            <a href="#features" className="hover:text-[#7F77DD] transition-colors">Features</a>
            <a href="#solutions" className="hover:text-[#7F77DD] transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-[#7F77DD] transition-colors">Pricing</a>
            <Link href="/catalog" className="hover:text-[#7F77DD] transition-colors">Catalog</Link>
            <Link href="/dashboard" className="text-[#7F77DD]">Demo Dashboard</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-xs font-black uppercase tracking-widest"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              className="bg-[#7F77DD] text-white font-black uppercase tracking-widest text-xs h-10 px-6 shadow-lg shadow-[#7F77DD]/20"
              onClick={() => router.push("/pricing")}
            >
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F77DD]/10 border border-[#7F77DD]/20 text-[10px] font-black text-[#7F77DD] uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3" />
              The Future of Professional Training
            </div>
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] italic">
              Master the Art of <span className="text-[#7F77DD]">AI-Driven</span> Industrial Intelligence.
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Sentinel is the world's first gamified training platform for heavy industry. Train your team on neural link protocols, predictive maintenance, and autonomous logistics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-[#7F77DD] text-white font-black uppercase tracking-widest text-sm h-14 px-10 shadow-2xl shadow-[#7F77DD]/30"
                onClick={() => router.push("/login")}
              >
                Start Training <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-200 font-black uppercase tracking-widest text-sm h-14 px-10"
                onClick={() => router.push("/pricing")}
              >
                Train Your Team
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-zinc-100">
              <div>
                <p className="text-2xl font-black italic tracking-tighter">12k+</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Trainees</p>
              </div>
              <div>
                <p className="text-2xl font-black italic tracking-tighter">45</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">AI Missions</p>
              </div>
              <div>
                <p className="text-2xl font-black italic tracking-tighter">98%</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Success Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[24px] overflow-hidden border-[8px] border-zinc-100 shadow-2xl shadow-zinc-200 aspect-[4/3] group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Sb94f-cbhYCSKhpKNwUu3kD4PiBDQF5a4_Lm91hq4gKWmZcBMuJw3UkcSZKfd664u3l1AAU807ylWiNlqE3c_T_LcegWnMbBVNITSI7A-5j6xboGtLPWu-w8dXRkP1opVO2JLauIo4lma1EjgBx-QdPWEPNn-ImlxuiJoS8j187cU5pM4TklS-jHuGdgNez6N8UdWsNIDUieWigNVvADeN42NLhyIkVVQ3e8xxPQ4nEnBI72fBHBTflkI_8woAkmrSpGz4YBLQci" 
                alt="Sentinel Platform"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#7F77DD]/10 group-hover:bg-transparent transition-colors" />
              
              {/* Floating UI elements */}
              <div className="absolute top-8 left-8 p-4 bg-white/90 backdrop-blur-md rounded-[12px] shadow-xl border border-white/50 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-[#1D9E75] rounded-full flex items-center justify-center text-white">
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">XP Earned</p>
                    <p className="text-lg font-black text-[#1D9E75] italic tracking-tighter">+450 XP</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 p-4 bg-zinc-900/90 backdrop-blur-md rounded-[12px] shadow-2xl border border-white/10 max-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-[#7F77DD] animate-pulse" />
                  <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Neural Link Active</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7F77DD] w-3/4" />
                </div>
              </div>
            </div>
            
            {/* Background blur */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#7F77DD]/20 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 border-y border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-12">Powering Global Industrial Teams</p>
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <span className="text-2xl font-black italic tracking-tighter">ROBOCORE</span>
            <span className="text-2xl font-black italic tracking-tighter">IRONCLOUD</span>
            <span className="text-2xl font-black italic tracking-tighter">NEURALFAB</span>
            <span className="text-2xl font-black italic tracking-tighter">STEELMIND</span>
            <span className="text-2xl font-black italic tracking-tighter">OMNI-DRIVE</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Gamified Compliance. <br/>AI-Driven Excellence.</h2>
            <p className="text-zinc-500 dark:text-zinc-300 font-medium">Sentinel transforms mandatory training from a chore into a high-stakes competitive arena.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/10 p-4 shadow-none">
              <CardContent className="space-y-6 pt-6">
                <div className="h-12 w-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-[#7F77DD] shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight">AI Tutor Companion</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">Meet Sentinel, your personal AI training partner. It knows your weaknesses, tracks your rivals, and keeps you focused.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#7F77DD]/5 p-4 border-2 border-[#7F77DD]/20">
              <CardContent className="space-y-6 pt-6">
                <div className="h-12 w-12 bg-[#7F77DD] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#7F77DD]/20">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight">Competitive Arena</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">Climb real-time leaderboards, unlock high-rarity badges, and earn XP multipliers through consistent daily performance.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/10 p-4 shadow-none">
              <CardContent className="space-y-6 pt-6">
                <div className="h-12 w-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-[#1D9E75] shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight">Enterprise Compliance</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">Full SCORM/xAPI support, bulk assignments, and detailed audit trails for mandatory safety and regulatory training.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7F77DD] rounded-[6px] flex items-center justify-center">
                <span className="font-black text-white text-lg italic">S</span>
              </div>
              <span className="font-black text-xl tracking-tighter uppercase italic">Sentinel</span>
            </div>
            <p className="text-zinc-500 font-medium max-w-sm">The world's first AI-powered gamified professional training platform for heavy industry and factory intelligence.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Product</p>
            <ul className="space-y-2 text-sm font-bold text-zinc-400">
              <li><Link href="/lesson-view" className="hover:text-white transition-colors">AI Tutor</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboards</Link></li>
              <li><Link href="/admin-dashboard" className="hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link href="/certifications" className="hover:text-white transition-colors">Certifications</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Connect</p>
            <ul className="space-y-2 text-sm font-bold text-zinc-400">
              <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><Link href="/protocol-docs" className="hover:text-white transition-colors">Protocol Docs</Link></li>
              <li><Link href="/system-status" className="hover:text-white transition-colors">System Status</Link></li>
              <li><Link href="/contact-demo" className="hover:text-white transition-colors">Contact Demo</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">© 2026 Sentinel Platforms Inc. All neural links reserved.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/compliance-api" className="hover:text-white transition-colors">Compliance API</Link>
            <button onClick={openSettings} className="hover:text-white transition-colors">
              Manage Consent
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

    </div>
  );
}






lassName="hover:text-white transition-colors">
              Manage Consent
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

    </div>
  );
}









lassName="hover:text-white transition-colors">
              Manage Consent
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

    </div>
  );
}












