import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockedScreen } from "@/components/auth/locked-screen";
import { 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  ChevronRight,
  LayoutGrid,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

const mockCourses = [
  { 
    id: "1", 
    title: "Risk Assessment Fundamentals", 
    category: "Compliance",
    progress: 72, 
    timeRemaining: "45m left",
    xpValue: 1200,
    deadline: "2026-03-20",
    assigned: true,
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60"
  },
  { 
    id: "2", 
    title: "Neural Network Architecture", 
    category: "AI & ML",
    progress: 45, 
    timeRemaining: "2h 10m left",
    xpValue: 2500,
    deadline: null,
    assigned: false,
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60"
  },
  { 
    id: "3", 
    title: "Industrial Safety Protocols", 
    category: "Safety",
    progress: 100, 
    timeRemaining: "Completed",
    xpValue: 800,
    deadline: "2026-03-10",
    assigned: true,
    status: "Completed",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"
  },
  { 
    id: "4", 
    title: "Data Ethics & Governance", 
    category: "Compliance",
    progress: 0, 
    timeRemaining: "3h 30m",
    xpValue: 1500,
    deadline: "2026-04-01",
    assigned: true,
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60"
  }
];

const tabs = ["All", "In Progress", "Completed", "Assigned"];

export default function MyCourses() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading courses...
      </div>
    );
  }

  if (!user) {
    return (
      <LockedScreen
        title="Courses Locked"
        description="Start a demo session to view your courses, or sign in to continue."
        onStartDemo={login}
      />
    );
  }

  const filteredCourses = mockCourses.filter(course => {
    if (activeTab === "All") return true;
    if (activeTab === "In Progress") return course.progress > 0 && course.progress < 100;
    if (activeTab === "Completed") return course.progress === 100;
    if (activeTab === "Assigned") return course.assigned;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Courses</h1>
            <p className="text-sm text-muted-foreground">Manage your learning journey and track your progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="pl-9 h-10 w-[240px] rounded-[8px] border-[0.5px] bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-white/35 text-sm focus:ring-1 focus:ring-[#7F77DD] outline-none"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all relative",
                  activeTab === tab ? "text-[#7F77DD]" : "text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7F77DD]" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pb-4">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-1 rounded", viewMode === 'grid' ? "bg-white/5 border border-white/10 text-[#7F77DD]" : "text-white/40 hover:text-white/70")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1 rounded", viewMode === 'list' ? "bg-white/5 border border-white/10 text-[#7F77DD]" : "text-white/40 hover:text-white/70")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredCourses.map(course => (
            <Card key={course.id} className={cn(
              "group cursor-pointer hover:border-[#7F77DD]/50 transition-all",
              viewMode === 'list' && "flex h-32 overflow-hidden"
            )}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/course-overview?id=${encodeURIComponent(course.id)}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(`/course-overview?id=${encodeURIComponent(course.id)}`)
                }
              }}
            >
              <div className={cn(
                "relative overflow-hidden",
                viewMode === 'grid' ? "h-40 w-full rounded-t-[11px]" : "w-48 h-full shrink-0"
              )}>
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className="px-2 py-1 bg-[#7F77DD] text-white text-[10px] font-bold rounded uppercase tracking-wider">
                    {course.category}
                  </div>
                </div>
              </div>
              
              <CardContent className={cn(
                "p-4 flex flex-col justify-between",
                viewMode === 'list' && "flex-1"
              )}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-tighter",
                      course.status === 'Completed' ? "text-[#1D9E75]" : "text-muted-foreground"
                    )}>
                      {course.status}
                    </span>
                    {course.deadline && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#E24B4A]">
                        <Clock className="h-3 w-3" />
                        {course.deadline}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm mb-4 line-clamp-1">{course.title}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
                      <svg className="h-10 w-10 -rotate-90">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-100 dark:text-zinc-800" />
                        <circle 
                          cx="20" cy="20" r="18" fill="none" stroke={course.progress === 100 ? "#1D9E75" : "#7F77DD"} strokeWidth="3" 
                          strokeDasharray={`${(course.progress / 100) * 113} 113`} 
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold">{course.progress}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{course.timeRemaining}</span>
                      <span className="text-[10px] font-bold text-[#7F77DD]">{course.xpValue} XP Available</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={course.status === 'Completed' ? 'success' : 'primary'}
                    className="w-full text-[10px] font-black uppercase tracking-widest h-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(
                        course.status === "Completed"
                          ? "/post-lesson-summary"
                          : `/lesson-view?course=${encodeURIComponent(course.id)}`
                      )
                    }}
                  >
                    {course.status === 'Completed' ? 'Review Content' : 'Continue Learning'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-20 text-center">
            <div className="h-20 w-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold">No courses found</h3>
            <p className="text-muted-foreground text-sm">Try changing your filters or browse the catalog.</p>
            <Button
              variant="primary"
              className="mt-6 font-bold uppercase tracking-widest text-xs"
              onClick={() => router.push("/catalog")}
            >
              Browse Catalog
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
