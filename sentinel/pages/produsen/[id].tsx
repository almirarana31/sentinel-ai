import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Phone, Mail, Package } from "lucide-react"

export default function ProducerDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, loading, login } = useAuth()

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return <LockedScreen title="Akses Terkunci" onStartDemo={login} />

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 pt-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-[10px] font-black uppercase tracking-widest gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Button>

        <header className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#7F77DD]">
            ID Produsen: {id}
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Kelompok Produsen Sejahtera</h1>
          <p className="text-muted-foreground text-sm font-medium">Detail profil dan hasil komoditas produsen.</p>
        </header>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Jl. Raya Koperasi No. 45, Jawa Tengah</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+62 812 3456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>sejahtera@kopdes.com</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Komoditas Utama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Padi", qty: "12.5 Ton" },
                  { name: "Jagung", qty: "8.2 Ton" },
                ].map(c => (
                  <div key={c.name} className="p-4 bg-zinc-50 dark:bg-white/5 rounded-lg border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#7F77DD]" />
                      <span className="text-sm font-bold">{c.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#1D9E75]">{c.qty}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
