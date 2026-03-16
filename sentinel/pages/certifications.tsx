import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  ShieldCheck, 
  Download, 
  Share2, 
  ExternalLink, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Search,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockCerts = [
  { 
    id: 1, 
    name: "Risk Assessment Professional", 
    issueDate: "2026-03-14", 
    expiryDate: "2027-03-14", 
    status: "Active", 
    score: "92/100",
    url: "#"
  },
  { 
    id: 2, 
    name: "Industrial Security Lead", 
    issueDate: "2025-11-20", 
    expiryDate: "2026-11-20", 
    status: "Active", 
    score: "88/100",
    url: "#"
  },
  { 
    id: 3, 
    name: "Factory Data Compliance", 
    issueDate: "2024-05-10", 
    expiryDate: "2025-05-10", 
    status: "Expired", 
    score: "95/100",
    url: "#"
  },
  { 
    id: 4, 
    name: "Neural Network Governance", 
    issueDate: "Pending", 
    expiryDate: "N/A", 
    status: "In Progress", 
    score: "Currently at 84%",
    url: "#"
  }
];

export default function Certifications() {
  const { user, loading, login } = useAuth();
  const [filter, setFilter] = useState("All");

  const filteredCerts = mockCerts.filter(cert => {
    if (filter === "All") return true;
    return cert.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading certifications...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Certifications Locked"
        description="Start a demo session to view your certifications, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#1D9E75]" />
              <span className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest">Verified Credentials</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Certifications</h1>
            <p className="text-muted-foreground text-sm font-medium">Manage and share your industry-standard professional certifications.</p>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-[10px] border-[0.5px]">
            {["All", "Active", "Expired", "In Progress"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[8px] transition-all",
                  filter === f
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-[#7F77DD]"
                    : "text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <Card key={cert.id} className={cn(
              "group transition-all duration-300 relative",
              cert.status === 'Expired' ? "opacity-60" : "hover:border-[#7F77DD]/50"
            )}>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                    cert.status === 'Active' ? "bg-[#1D9E75]/10 text-[#1D9E75]" : 
                    cert.status === 'Expired' ? "bg-white/5 text-white/40" : "bg-[#7F77DD]/10 text-[#7F77DD]"
                  )}>
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                    cert.status === 'Active' ? "bg-[#1D9E75]/10 text-[#1D9E75]" : 
                    cert.status === 'Expired' ? "bg-[#E24B4A]/10 text-[#E24B4A]" : "bg-[#7F77DD]/10 text-[#7F77DD]"
                  )}>
                    {cert.status}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight line-clamp-2 min-h-[3rem] leading-tight group-hover:text-[#7F77DD] transition-colors">{cert.name}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Score</span>
                      <span className="text-xs font-bold">{cert.score}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Issued</span>
                      <span className="text-xs font-bold">{cert.issueDate}</span>
                    </div>
                  </div>
                </div>

                {cert.status === 'Expired' && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-[12px] flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-[#BA7517] shrink-0" />
                    <p className="text-[10px] font-bold text-[#BA7517] uppercase tracking-tighter">Expires in 60 days. Renew to maintain compliance.</p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex gap-2">
                  {cert.status === 'Expired' ? (
                    <Button className="flex-1 bg-[#7F77DD] text-white font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-[#7F77DD]/10">
                      <RotateCcw className="h-3.5 w-3.5 mr-2" /> Renew Cert
                    </Button>
                  ) : cert.status === 'Active' ? (
                    <>
                      <Button variant="outline" className="flex-1 border-white/15 font-black uppercase tracking-widest text-[10px] h-10">
                        <Download className="h-3.5 w-3.5 mr-2 text-[#7F77DD]" /> Download
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 border-white/15">
                        <Share2 className="h-3.5 w-3.5 text-[#7F77DD]" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="flex-1 border-white/15 font-black uppercase tracking-widest text-[10px] h-10" disabled>
                      Processing results...
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Catalog Link */}
        <div className="pt-20 pb-20 flex flex-col items-center gap-6">
          <div className="h-1.5 w-40 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#7F77DD] w-1/3" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] max-w-sm text-center">Ready to unlock your next credential?</p>
          <Button variant="primary" size="lg" className="bg-[#7F77DD] text-white font-black uppercase tracking-widest text-xs h-14 px-12 shadow-2xl shadow-[#7F77DD]/20">
            Browse Certificate Catalog <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
