import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { useConsent, ConsentPreferences } from "@/lib/consent-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mockGetConsentCollectionPointResponse = {
  code_collection_point: "cp_sentinel_demo_001",
  consents: [
    { code_consent: "MARKETING", label: "Marketing" },
    { code_consent: "BIO_METRIK", label: "Bio Metrik" },
    { code_consent: "DATA_ANAK", label: "Data Anak" },
  ],
} as const

function prefKeyFromCode(code: (typeof mockGetConsentCollectionPointResponse.consents)[number]["code_consent"]) {
  if (code === "MARKETING") return "marketing"
  if (code === "BIO_METRIK") return "biometrics"
  return "childData"
}

function ConsentCheckbox({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (next: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-2 cursor-pointer select-none">
      <span className="text-sm font-bold text-white/85">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-4 w-4 accent-[#7F77DD]"
      />
    </label>
  )
}

export default function PersetujuanPage() {
  const router = useRouter()
  const { user, token, loading, login } = useAuth()
  const { ready, consent, savePreferences } = useConsent()

  const [prefs, setPrefs] = useState<ConsentPreferences>({
    marketing: false,
    biometrics: false,
    childData: false,
  })

  useEffect(() => {
    if (!ready) return
    setPrefs(consent?.preferences ?? { marketing: false, biometrics: false, childData: false })
  }, [ready, consent])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <LockedScreen title="Persetujuan Terkunci" onStartDemo={login} />
  }

  return (
    <div className="min-h-screen bg-black/95 p-6">
      <div className="max-w-xl mx-auto pt-10 space-y-6">
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/60">
            Session
          </div>
          <div className="text-sm font-bold text-white/85">{user.email}</div>
          <div className="text-xs font-bold text-white/55 uppercase tracking-widest">
            {user.name}
          </div>
        </div>

        <Card className="border border-white/10 bg-black/35 backdrop-blur-md">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white/90">
                Persetujuan
              </h1>
              <p className="text-sm text-white/60 font-medium">
                Pilih persetujuan sesuai response Get Consent Collection Point.
              </p>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/45 pt-1">
                code_collection_point: {mockGetConsentCollectionPointResponse.code_collection_point}
              </div>
            </div>

            <div className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-2">
              {mockGetConsentCollectionPointResponse.consents.map((item, idx) => {
                const key = prefKeyFromCode(item.code_consent)
                return (
                  <div key={item.code_consent}>
                    <ConsentCheckbox
                      label={item.label}
                      checked={prefs[key]}
                      onCheckedChange={(next) => setPrefs((p) => ({ ...p, [key]: next }))}
                    />
                    {idx !== mockGetConsentCollectionPointResponse.consents.length - 1 && (
                      <div className="h-px bg-white/10" />
                    )}
                  </div>
                )
              })}
            </div>

            <Button
              className={cn(
                "w-full font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#7F77DD]/20"
              )}
              onClick={() => {
                const payload = {
                  consents: mockGetConsentCollectionPointResponse.consents.map((item) => {
                    const key = prefKeyFromCode(item.code_consent)
                    return {
                      code_consent: item.code_consent,
                      is_agree: prefs[key],
                    }
                  }),
                }

                console.log(
                  `[POST] /user/consents/${mockGetConsentCollectionPointResponse.code_collection_point}`,
                  {
                    headers: {
                      Authorization: token ? `Bearer ${token}` : "(missing token)",
                    },
                    body: payload,
                  }
                )

                if (token) {
                  fetch(`/api/user/consents/${mockGetConsentCollectionPointResponse.code_collection_point}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  }).catch((e) => {
                    console.warn("Failed to persist consent submission to DB", e)
                  })
                }

                savePreferences(prefs, "persetujuan")
                router.push("/persetujuan-selesai")
              }}
            >
              Submit
            </Button>

            <Button variant="ghost" className="w-full text-white/75" onClick={() => router.back()}>
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
