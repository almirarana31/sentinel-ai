import { useRouter } from "next/router"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, BookOpen, Sparkles, ArrowRight } from "lucide-react"

const mockCatalog = [
  { id: "1", title: "Risk Assessment Fundamentals", category: "Compliance", lessons: 12, estTime: "2h 45m", xp: 1200 },
  { id: "2", title: "Neural Network Architecture", category: "AI & ML", lessons: 18, estTime: "4h 10m", xp: 2500 },
  { id: "3", title: "Industrial Safety Protocols", category: "Safety", lessons: 9, estTime: "1h 30m", xp: 800 },
  { id: "4", title: "Data Ethics & Governance", category: "Compliance", lessons: 14, estTime: "3h 05m", xp: 1500 },
]

export default function CatalogPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F77DD]/10 border border-[#7F77DD]/20 text-[10px] font-black text-[#7F77DD] uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3" />
              Course Catalog Preview
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Explore Courses
            </h1>
            <p className="text-muted-foreground font-medium max-w-2xl">
              Browse a preview of the training catalog. Sign in to enroll, track progress, and earn certifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-11 px-5 font-black uppercase tracking-widest text-[11px]"
              onClick={() => router.push("/pricing")}
            >
              View Pricing
            </Button>
            <Button
              className="h-11 px-5 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
              onClick={() => router.push("/login")}
            >
              Sign In <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {mockCatalog.map((course) => (
            <Card key={course.id} className="shadow-none border border-white/10">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-[14px] bg-white/70 dark:bg-white/5 border border-zinc-200/70 dark:border-white/10 flex items-center justify-center text-[#7F77DD]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/70">
                    <Lock className="h-3.5 w-3.5" />
                    Preview
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {course.category}
                  </div>
                  <div className="text-lg font-black tracking-tight">{course.title}</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/[0.03] p-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Lessons
                    </div>
                    <div className="text-sm font-black">{course.lessons}</div>
                  </div>
                  <div className="rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/[0.03] p-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Time
                    </div>
                    <div className="text-sm font-black">{course.estTime}</div>
                  </div>
                  <div className="rounded-[12px] border border-white/10 bg-white/70 dark:bg-white/[0.03] p-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      XP
                    </div>
                    <div className="text-sm font-black">{course.xp}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="block text-center w-full rounded-[10px] bg-white/80 dark:bg-white/5 border border-zinc-200/70 dark:border-white/10 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:border-[#7F77DD]/40 hover:text-[#7F77DD] transition-colors"
                  >
                    Sign in to enroll
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="shadow-none border border-white/10">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-black uppercase tracking-widest">Want the full experience?</div>
              <div className="text-sm text-muted-foreground font-medium">
                Sign in to unlock courses, track progress, and access the AI tutor.
              </div>
            </div>
            <Button
              className="h-11 px-6 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

