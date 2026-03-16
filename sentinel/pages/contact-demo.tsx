import { Button } from "@/components/ui/button"
import { SimplePage } from "@/components/layout/simple-page"
import { useRouter } from "next/router"

export default function ContactDemoPage() {
  const router = useRouter()

  return (
    <SimplePage
      title="Contact Demo"
      description="Request a guided walkthrough (demo placeholder)."
    >
      <p className="text-sm text-muted-foreground font-medium">
        Demo requests aren’t wired up in this build yet. Use the demo login to
        explore the product.
      </p>
      <Button
        className="bg-[#7F77DD] text-white font-black uppercase tracking-widest text-xs h-10 px-6 shadow-lg shadow-[#7F77DD]/20"
        onClick={() => router.push("/login")}
      >
        Start Demo
      </Button>
    </SimplePage>
  )
}
