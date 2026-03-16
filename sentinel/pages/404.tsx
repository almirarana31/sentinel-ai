import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Home, LayoutGrid, LogIn } from "lucide-react"
import { useRouter } from "next/router"

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              404
            </p>
            <h1 className="text-2xl font-black tracking-tight">
              This page does not exist.
            </h1>
            <p className="text-sm text-muted-foreground">
              The route you hit is not wired yet. Jump back into the app:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/")}
            >
              <Home className="h-4 w-4" /> Home
            </Button>
            <Button className="w-full justify-start gap-2" onClick={() => router.push("/dashboard")}>
              <LayoutGrid className="h-4 w-4" /> Dashboard
              <ArrowRight className="ml-auto h-4 w-4 opacity-70" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/login")}
            >
              <LogIn className="h-4 w-4" /> Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
