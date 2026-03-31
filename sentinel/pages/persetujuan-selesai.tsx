import { useRouter } from "next/router"
import { CheckCircle2 } from "lucide-react"
import { PageBackButton } from "@/components/navigation/page-back-button"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PersetujuanSelesaiPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black/95 p-6 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        <PageBackButton
          fallbackHref="/persetujuan"
          variant="ghost"
          className="border border-white/10 bg-white/[0.03] text-white/75 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
        />
        <Card className="border border-white/10 bg-black/35 backdrop-blur-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#1D9E75]/10 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-[#1D9E75]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white/90">Terima Kasih</h1>
              <p className="text-sm text-white/65 font-medium">
                Terima kasih atas persetujuan yang diberikan.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" onClick={() => router.push("/home")}>
                Ke Home
              </Button>
              <Button variant="outline" className="flex-1 border-white/15 text-white/85" onClick={() => router.push("/persetujuan")}>
                Ubah Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
