import { SimplePage } from "@/components/layout/simple-page"

export default function TermsPage() {
  return (
    <SimplePage title="Syarat & Ketentuan" description="Halaman statis (demo).">
      <div className="space-y-2 text-sm text-muted-foreground font-medium">
        <p>
          Aplikasi ini adalah demo UI untuk evaluasi dan prototyping. Tidak ada
          jaminan terkait ketersediaan, akurasi, atau kesesuaian untuk tujuan
          tertentu.
        </p>
        <p>
          Ganti konten halaman ini dengan syarat & ketentuan resmi organisasi
          Anda sebelum digunakan di produksi.
        </p>
      </div>
    </SimplePage>
  )
}

