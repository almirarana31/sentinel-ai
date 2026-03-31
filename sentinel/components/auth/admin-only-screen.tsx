import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type AdminOnlyScreenProps = {
  title?: string
  description?: string
}

export function AdminOnlyScreen({
  title = "Admin Access Required",
  description = "This area is only available to users with the admin role.",
}: AdminOnlyScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-sm font-semibold text-[#7F77DD] hover:underline">
              Back to home
            </Link>
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-white">
              Profile
            </Link>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
