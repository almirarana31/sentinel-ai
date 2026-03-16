import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Sparkles, 
  Shield, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Mail,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  User,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useConsent } from "@/lib/consent-context";

const plans = [
  { 
    name: "Individual", 
    price: "$29", 
    period: "/mo", 
    description: "Perfect for career growth and certification prep.", 
    features: [
      "Access to all 45+ AI Missions",
      "Sentinel AI Tutor Companion",
      "Official Certifications",
      "Global Leaderboard Access",
      "Unlimited XP Earning",
    ],
    cta: "Start Free Trial",
    popular: false,
    icon: <User className="h-6 w-6" />
  },
  { 
    name: "Team", 
    price: "$19", 
    period: "/user/mo", 
    description: "Gamified training for mid-sized industrial teams.", 
    features: [
      "Everything in Individual",
      "Enterprise Admin Dashboard",
      "Bulk User Assignments",
      "Team Leaderboard & Private Stats",
      "Advanced Reporting & Audit Log",
      "Dedicated Onboarding",
    ],
    cta: "Start Team Trial",
    popular: true,
    icon: <Users className="h-6 w-6" />
  },
  { 
    name: "Enterprise", 
    price: "Custom", 
    period: "", 
    description: "Large scale deployment with full compliance tracking.", 
    features: [
      "Everything in Team",
      "Custom SCORM Package Uploads",
      "SSO & SAML Integration",
      "API Access for LMS Integration",
      "Custom Org Branding",
      "24/7 Priority Support",
    ],
    cta: "Book a Demo",
    popular: false,
    icon: <Building className="h-6 w-6" />
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const router = useRouter();
  const { openSettings } = useConsent();

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 font-sans selection:bg-[#7F77DD] selection:text-white">
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
            <Link href="/" className="hover:text-[#7F77DD] transition-colors">Home</Link>
            <a href="#features" className="hover:text-[#7F77DD] transition-colors">Features</a>
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
              onClick={() => router.push("/login")}
            >
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F77DD]/10 border border-[#7F77DD]/20 text-[10px] font-black text-[#7F77DD] uppercase tracking-[0.2em]">
            <Zap className="h-3 w-3" />
            Flexible Infrastructure
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
            Competitive Plans for <span className="text-[#7F77DD]">Ambitious</span> Teams.
          </h1>
          <p className="text-zinc-500 font-medium max-w-2xl mx-auto text-lg">Choose a plan that fits your learning pace, team size, and professional certification needs.</p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 pt-10">
            <span className={cn("text-xs font-black uppercase tracking-widest", !isAnnual ? "text-zinc-950 dark:text-zinc-100" : "text-zinc-400 dark:text-white/40")}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-zinc-100 dark:bg-zinc-900 rounded-full p-1 border-[0.5px] transition-all relative"
            >
              <div className={cn(
                "h-5.5 w-6 bg-[#7F77DD] rounded-full transition-all absolute top-1",
                isAnnual ? "right-1" : "left-1"
              )} />
            </button>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-black uppercase tracking-widest", isAnnual ? "text-zinc-950 dark:text-zinc-100" : "text-zinc-400 dark:text-white/40")}>Annual</span>
              <span className="px-2 py-0.5 bg-[#1D9E75]/10 text-[#1D9E75] text-[9px] font-black uppercase tracking-widest rounded-full">Save 20%</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-20">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                id={plan.name.toLowerCase()}
                className={cn(
                "scroll-mt-28 border-[2px] transition-all duration-300 relative overflow-hidden text-left flex flex-col shadow-none",
                plan.popular
                  ? "border-[#7F77DD] bg-white dark:bg-white/[0.03] scale-[1.05] z-10"
                  : "border-zinc-100 dark:border-white/10 bg-white dark:bg-white/[0.03]"
              )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 h-10 w-40 bg-[#7F77DD] text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest rotate-45 translate-x-12 translate-y-3">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                      plan.popular ? "bg-[#7F77DD] text-white" : "bg-zinc-50 dark:bg-white/10 text-zinc-400 dark:text-white/70"
                    )}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black uppercase tracking-tight italic mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black italic tracking-tighter">{plan.price}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">{plan.description}</p>
                  
                  <div className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-[#1D9E75] shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    onClick={() => router.push("/login")}
                    className={cn(
                    "w-full font-black uppercase tracking-widest text-xs h-14 shadow-lg shadow-[#7F77DD]/20",
                    plan.popular ? "bg-[#7F77DD] text-white" : "bg-zinc-950 text-white"
                  )}
                  >
                    {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-32 bg-zinc-50/50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-center">Feature Breakdown</h2>
          <Card className="shadow-none border-none overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/10">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Individual</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Team</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/10 bg-white/50 dark:bg-zinc-950/40">
                  {[
                    "AI Tutor Interaction", "Professional Certifications", "Leaderboard Access", "Admin Command Center", "Custom Course Upload", "SSO/SAML"
                  ].map((f, i) => (
                    <tr key={f} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-6 text-sm font-bold">{f}</td>
                      <td className="p-6 text-center"><Check className="h-4 w-4 text-[#1D9E75] mx-auto" /></td>
                      <td className="p-6 text-center"><Check className="h-4 w-4 text-[#1D9E75] mx-auto" /></td>
                      <td className="p-6 text-center"><Check className="h-4 w-4 text-[#1D9E75] mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-zinc-950 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7F77DD] rounded-[6px] flex items-center justify-center">
                <span className="font-black text-white text-lg italic">S</span>
              </div>
              <span className="font-black text-xl tracking-tighter uppercase italic">Sentinel</span>
            </div>
            <p className="text-zinc-500 font-medium max-w-sm">The world's first AI-powered gamified professional training platform for heavy industry.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Pricing</p>
            <ul className="space-y-2 text-sm font-bold text-zinc-400">
              <li><a href="#individual" className="hover:text-white transition-colors">Individual Plans</a></li>
              <li><a href="#team" className="hover:text-white transition-colors">Team Tiers</a></li>
              <li><a href="#enterprise" className="hover:text-white transition-colors">Enterprise Demos</a></li>
              <li><Link href="/contact-sales" className="hover:text-white transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#7F77DD] uppercase tracking-widest">Connect</p>
            <ul className="space-y-2 text-sm font-bold text-zinc-400">
              <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><Link href="/protocol-docs" className="hover:text-white transition-colors">Protocol Docs</Link></li>
              <li><Link href="/system-status" className="hover:text-white transition-colors">System Status</Link></li>
              <li>
                <button onClick={openSettings} className="hover:text-white transition-colors">
                  Manage Consent
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
