import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type LockedScreenProps = {
  title?: string
  description?: string
  onStartDemo: () => void
}

export function LockedScreen({
  title = "Access Required",
  description = "Start a demo session (mock user) or sign in to continue.",
  onStartDemo,
}: LockedScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onStartDemo} variant="primary">
              Start Demo
            </Button>
            <Link
              href="/login"
              className="text-sm font-semibold text-[#7F77DD] hover:underline"
            >
              Go to login
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-white">
              Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

