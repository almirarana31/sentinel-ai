import { useMemo, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LockedScreen } from "@/components/auth/locked-screen"
import {
  Search,
  Filter,
  Clock,
  Calendar,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"
import { mockCourses } from "@/lib/mock-courses"

const tabs = ["All", "In Progress", "Completed", "Assigned"]

function CourseOverviewPanel({
  courseId,
  onClose,
}: {
  courseId: string
  onClose?: () => void
}) {
  const router = useRouter()
  const course = useMemo(() => mockCourses.find((c) => c.id === courseId), [courseId])

  if (!course) return null

  const primaryCtaLabel =
    course.status === "Completed" ? "Review Content" : course.progress === 0 ? "Start Lesson" : "Continue Learning"
  const primaryCtaHref = course.status === "Completed" ? "/post-lesson-summary" : `/lesson-view?course=${encodeURIComponent(course.id)}`

  return (
    <Card className="shadow-none border border-white/10">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F77DD]/10 border border-[#7F77DD]/20 text-[10px] font-black text-[#7F77DD] uppercase tracking-[0.22em]">
              <Sparkles className="h-3 w-3" />
              Overview
            </div>
            <div className="text-xl md:text-2xl font-black uppercase tracking-tighter italic leading-tight">
              {course.title}
            </div>
            <div className="text-xs font-bold text-white/60">{course.category}</div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-[12px] border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-colors"
              aria-label="Close overview"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/55">
              <Clock className="h-3.5 w-3.5" />
              Time
            </div>
            <div className="text-base font-black mt-1">{course.estTime}</div>
          </div>
          <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/55">
              <ShieldCheck className="h-3.5 w-3.5" />
              XP
            </div>
            <div className="text-base font-black mt-1">{course.xpValue}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Prerequisites</div>
          <div className="space-y-2">
            {course.prerequisites.map((p) => (
              <div
                key={p}
                className="rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/90"
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Syllabus</div>
          <div className="space-y-2">
            {course.syllabus.slice(0, 4).map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="h-8 w-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold text-white/90">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="h-11 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
            onClick={() => router.push(primaryCtaHref)}
          >
            {primaryCtaLabel} <BookOpen className="h-4 w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="h-11 font-black uppercase tracking-widest text-[11px]"
            onClick={() => router.push(`/assessment?course=${encodeURIComponent(course.id)}`)}
          >
            Try Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MyCourses() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [activeTab, setActiveTab] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")

  const selectedCourseId = typeof router.query.course === "string" ? router.query.course : undefined
  const selectedCourse = useMemo(() => {
    if (!selectedCourseId) return null
    return mockCourses.find((course) => course.id === selectedCourseId) ?? null
  }, [selectedCourseId])

  const setSelectedCourse = (courseId: string) => {
    router.push({ pathname: "/my-courses", query: { ...router.query, course: courseId } }, undefined, { shallow: true })
  }

  const clearSelectedCourse = () => {
    const query = { ...router.query } as Record<string, any>
    delete query.course
    router.push({ pathname: "/my-courses", query }, undefined, { shallow: true })
  }

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockCourses.filter((course) => {
      if (activeTab === "In Progress" && !(course.progress > 0 && course.progress < 100)) return false
      if (activeTab === "Completed" && course.progress !== 100) return false
      if (activeTab === "Assigned" && !course.assigned) return false
      if (activeTab !== "All" && !["In Progress", "Completed", "Assigned"].includes(activeTab)) return true
      if (!q) return true
      return course.title.toLowerCase().includes(q) || course.category.toLowerCase().includes(q)
    })
  }, [activeTab, search])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading courses...
      </div>
    )
  }

  if (!user) {
    return (
      <LockedScreen
        title="Courses Locked"
        description="Start a demo session to view your courses, or sign in to continue."
        onStartDemo={login}
      />
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Courses</div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-tight">
              My Courses
            </h1>
            <p className="text-sm text-white/60 font-medium">
              Browse, filter, and open an overview without leaving this page.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-9 h-11 rounded-[12px] border border-white/10 bg-white/[0.03] text-white/90 placeholder:text-white/35 text-sm font-medium focus:ring-2 focus:ring-[#7F77DD]/40 outline-none"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              aria-label="Filter (demo)"
            >
              <Filter className="h-4 w-4 text-white/70" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10">
              <div className="flex gap-6 overflow-x-auto pb-3">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-3 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                      activeTab === tab ? "text-[#7F77DD]" : "text-white/60 hover:text-white"
                    )}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7F77DD]" />}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pb-3">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-[10px] border transition-colors",
                    viewMode === "grid"
                      ? "bg-white/[0.06] border-white/10 text-[#7F77DD]"
                      : "bg-transparent border-transparent text-white/40 hover:text-white/70 hover:border-white/10"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-[10px] border transition-colors",
                    viewMode === "list"
                      ? "bg-white/[0.06] border-white/10 text-[#7F77DD]"
                      : "bg-transparent border-transparent text-white/40 hover:text-white/70 hover:border-white/10"
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className={cn(
                    "group cursor-pointer hover:border-[#7F77DD]/40 transition-all",
                    selectedCourseId === course.id && "border-[#7F77DD]/45 bg-[#7F77DD]/[0.06]",
                    viewMode === "list" && "flex min-h-[140px] overflow-hidden"
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCourse(course.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedCourse(course.id)
                  }}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden",
                      viewMode === "grid" ? "h-44 w-full rounded-t-[11px]" : "w-52 h-full shrink-0"
                    )}
                  >
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="px-2.5 py-1 bg-[#7F77DD] text-white text-[10px] font-black rounded uppercase tracking-wider shadow-lg shadow-[#7F77DD]/20">
                        {course.category}
                      </div>
                    </div>
                  </div>

                  <CardContent
                    className={cn("p-5 flex flex-col justify-between gap-4", viewMode === "list" && "flex-1")}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            course.status === "Completed" ? "text-[#1D9E75]" : "text-white/55"
                          )}
                        >
                          {course.status}
                        </span>
                        {course.deadline && (
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#E24B4A]">
                            <Clock className="h-3 w-3" />
                            {course.deadline}
                          </div>
                        )}
                      </div>
                      <h3 className="font-black text-base md:text-lg tracking-tight leading-tight line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 flex items-center justify-center shrink-0">
                          <svg className="h-11 w-11 -rotate-90">
                            <circle
                              cx="22"
                              cy="22"
                              r="19"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="text-white/10"
                            />
                            <circle
                              cx="22"
                              cy="22"
                              r="19"
                              fill="none"
                              stroke={course.progress === 100 ? "#1D9E75" : "#7F77DD"}
                              strokeWidth="3"
                              strokeDasharray={`${(course.progress / 100) * 119} 119`}
                              className="transition-all duration-700"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-black text-white/85">{course.progress}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white/55 uppercase tracking-widest">
                            {course.timeRemaining}
                          </span>
                          <span className="text-[11px] font-black text-[#7F77DD]">{course.xpValue} XP</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={course.status === "Completed" ? "success" : "primary"}
                        className="w-full text-[10px] font-black uppercase tracking-widest h-9"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(
                            course.status === "Completed"
                              ? "/post-lesson-summary"
                              : `/lesson-view?course=${encodeURIComponent(course.id)}`
                          )
                        }}
                      >
                        {course.status === "Completed" ? "Review Content" : "Continue Learning"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="py-14 text-center">
                <div className="h-20 w-20 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white/40">
                  <Calendar className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-black">No courses found</h3>
                <p className="text-white/60 text-sm font-medium">Try changing filters or browse the catalog.</p>
                <Button
                  className="mt-6 font-black uppercase tracking-widest text-xs h-11 shadow-lg shadow-[#7F77DD]/20"
                  onClick={() => router.push("/catalog")}
                >
                  Browse Catalog
                </Button>
              </div>
            )}
          </div>

          <div className="hidden xl:block xl:col-span-4">
            <div className="sticky top-20 space-y-4">
              {selectedCourse ? (
                <CourseOverviewPanel courseId={selectedCourse.id} />
              ) : (
                <Card className="shadow-none border border-white/10">
                  <CardContent className="p-6 space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/55">Overview</div>
                    <div className="text-xl font-black uppercase tracking-tighter italic">Select a course</div>
                    <p className="text-sm font-medium text-white/60">
                      Click a course card to preview the syllabus, prerequisites, and actions here.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="h-11 font-black uppercase tracking-widest text-[11px]"
                        onClick={() => setSelectedCourse(mockCourses[0]!.id)}
                      >
                        Open First
                      </Button>
                      <Button
                        className="h-11 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#7F77DD]/20"
                        onClick={() => router.push("/games")}
                      >
                        Try Games
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close overview"
            onClick={clearSelectedCourse}
          />
          <div className="relative w-full max-w-xl p-4">
            <CourseOverviewPanel courseId={selectedCourse.id} onClose={clearSelectedCourse} />
          </div>
        </div>
      )}
    </div>
  )
}
