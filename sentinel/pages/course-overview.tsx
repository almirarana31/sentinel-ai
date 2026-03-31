import { useEffect } from "react"
import { useRouter } from "next/router"
import { Loader2 } from "lucide-react"

export default function CourseOverviewPage() {
  const router = useRouter()
  const courseId = typeof router.query.id === "string" ? router.query.id : "1"

  useEffect(() => {
    if (!router.isReady) return
    router.replace({ pathname: "/my-courses", query: { course: courseId } }, undefined, { shallow: true })
  }, [courseId, router])

  return (
    <div className="min-h-screen bg-transparent p-6 pt-12 flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/70 text-sm font-semibold">
        <Loader2 className="h-4 w-4 animate-spin" />
        Redirecting to Courses…
      </div>
    </div>
  )
}
