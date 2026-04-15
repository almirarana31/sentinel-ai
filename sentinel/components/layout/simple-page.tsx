import { ReactNode } from "react"
import { useRouter } from "next/router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useConsent } from "@/lib/consent-context"

type SimplePageProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function SimplePage({ title, description, children }: SimplePageProps) {
  const router = useRouter()
  const { openSettings } = useConsent()

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto pt-10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground font-medium">{description}</p>
          )}
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {children}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="ghost" onClick={() => router.push("/")}>
                Home
              </Button>
              <Button variant="ghost" onClick={() => router.push("/pricing")}>
                Pricing
              </Button>
              <Button variant="ghost" onClick={openSettings}>
                Manage Consent
              </Button>
              <Button variant="primary" onClick={() => router.push("/dashboard")}>
                Demo Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
