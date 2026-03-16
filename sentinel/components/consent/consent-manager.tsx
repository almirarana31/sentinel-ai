import Link from "next/link"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConsentPreferences, useConsent } from "@/lib/consent-context"
import { cn } from "@/lib/utils"

function Switch({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean
  onCheckedChange: (next: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-14 h-8 rounded-full p-1 border-[0.5px] transition-all relative",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        checked ? "bg-[#7F77DD]/15 border-[#7F77DD]/30" : "bg-white/5 border-white/15"
      )}
    >
      <span
        className={cn(
          "h-5.5 w-6 rounded-full transition-all absolute top-1",
          checked ? "right-1 bg-[#7F77DD]" : "left-1 bg-white/40"
        )}
      />
    </button>
  )
}

function ConsentBanner() {
  const { rejectOptional, acceptAll, openSettings } = useConsent()

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4">
      <div className="mx-auto max-w-4xl">
        <Card className="border border-white/10 bg-black/40 backdrop-blur-md">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-widest text-white/85">
                Persetujuan
              </div>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                Atur persetujuan pemrosesan data opsional (Marketing, Biometrik, dan Data Anak).
                Anda dapat mengubahnya kapan saja di{" "}
                <Link href="/privacy" className="text-[#7F77DD] hover:underline">
                  Privacy Protocol
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={openSettings} className="text-white/80">
                Pengaturan
              </Button>
              <Button variant="outline" size="sm" onClick={rejectOptional} className="border-white/15 text-white/85">
                Tolak Opsional
              </Button>
              <Button size="sm" onClick={acceptAll} className="shadow-lg shadow-[#7F77DD]/20">
                Setujui Semua
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ConsentSettings() {
  const {
    consent,
    isSettingsOpen,
    closeSettings,
    acceptAll,
    rejectOptional,
    savePreferences,
    resetConsent,
  } = useConsent()

  const [prefs, setPrefs] = useState<ConsentPreferences>({
    marketing: false,
    biometrics: false,
    childData: false,
  })

  useEffect(() => {
    if (!isSettingsOpen) return
    setPrefs(consent?.preferences ?? { marketing: false, biometrics: false, childData: false })
  }, [isSettingsOpen, consent])

  if (!isSettingsOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 bg-black/70">
      <Card className="w-full max-w-xl border border-white/10 bg-black/45 backdrop-blur-md">
        <CardContent className="p-5 sm:p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-black uppercase tracking-widest text-white/90">
                Pengaturan Persetujuan
              </div>
              <p className="text-sm text-white/65 font-medium">
                Kontrol pemrosesan data opsional. Yang diperlukan selalu aktif.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close consent settings"
              className="text-white/70 hover:text-white"
              onClick={closeSettings}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-[12px] border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white/85">
                  Necessary
                </div>
                <div className="text-sm text-white/60 font-medium">
                  Diperlukan untuk autentikasi dan fungsi dasar aplikasi.
                </div>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} disabled />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[12px] border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white/85">
                  Marketing
                </div>
                <div className="text-sm text-white/60 font-medium">
                  Aktivitas untuk promosi, penawaran, dan komunikasi pemasaran.
                </div>
              </div>
              <Switch
                checked={prefs.marketing}
                onCheckedChange={(next) => setPrefs((p) => ({ ...p, marketing: next }))}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[12px] border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white/85">
                  Biometrik
                </div>
                <div className="text-sm text-white/60 font-medium">
                  Pemrosesan data biometrik untuk verifikasi/keamanan (opsional).
                </div>
              </div>
              <Switch
                checked={prefs.biometrics}
                onCheckedChange={(next) => setPrefs((p) => ({ ...p, biometrics: next }))}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[12px] border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white/85">
                  Data Anak
                </div>
                <div className="text-sm text-white/60 font-medium">
                  Pemrosesan data anak (opsional).
                </div>
              </div>
              <Switch
                checked={prefs.childData}
                onCheckedChange={(next) => setPrefs((p) => ({ ...p, childData: next }))}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={resetConsent}
              className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-white/80 text-left"
            >
              Reset consent
            </button>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={rejectOptional} className="border-white/15 text-white/85">
                Tolak Opsional
              </Button>
              <Button variant="ghost" size="sm" onClick={acceptAll} className="text-white/80">
                Setujui Semua
              </Button>
              <Button size="sm" onClick={() => savePreferences(prefs)} className="shadow-lg shadow-[#7F77DD]/20">
                Simpan
              </Button>
            </div>
          </div>

          <div className="text-xs text-white/45 font-medium">
            Anda bisa mengubah kapan saja lewat "Manage Consent".
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ConsentManager() {
  const { ready, consent, isSettingsOpen } = useConsent()

  return (
    <>
      <ConsentSettings />
      {ready && !consent && !isSettingsOpen && <ConsentBanner />}
    </>
  )
}

