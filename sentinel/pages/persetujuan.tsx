import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { useConsent, ConsentPreferences } from "@/lib/consent-context"
import { LockedScreen } from "@/components/auth/locked-screen"
import { PageBackButton } from "@/components/navigation/page-back-button"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ConsentCollectionPointResponse =
  | {
      ok: true
      code_collection_point: string
      name: string
      consents: { code_consent: string; label: string }[]
    }
  | {
      ok: false
      error: string
    }

const DEFAULT_COLLECTION_POINT_CODE = "cp_sentinel_demo_001"

function prefKeyFromCode(code: string) {
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
  const [collectionPoint, setCollectionPoint] = useState<ConsentCollectionPointResponse | null>(null)
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "error">("idle")
  const [apiError, setApiError] = useState("")

  useEffect(() => {
    if (!ready) return
    setPrefs(consent?.preferences ?? { marketing: false, biometrics: false, childData: false })
  }, [ready, consent])

  useEffect(() => {
    let cancelled = false
    setApiStatus("loading")
    fetch(`/api/user/consents/${DEFAULT_COLLECTION_POINT_CODE}`)
      .then((res) => res.json() as Promise<ConsentCollectionPointResponse>)
      .then((data) => {
        if (cancelled) return
        if (!data.ok) {
          setApiStatus("error")
          setApiError(data.error || "Failed to load consent collection point")
          return
        }
        setCollectionPoint(data)
        setApiStatus("idle")
        setApiError("")
      })
      .catch((error) => {
        if (cancelled) return
        setApiStatus("error")
        setApiError(error instanceof Error ? error.message : "Failed to load consent collection point")
      })

    return () => {
      cancelled = true
    }
  }, [])

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
        <PageBackButton
          fallbackHref="/profile"
          variant="ghost"
          className="border border-white/10 bg-white/[0.03] text-white/75 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
        />
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
                Pilih persetujuan sesuai response backend Get Consent Collection Point.
              </p>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/45 pt-1">
                code_collection_point: {collectionPoint?.ok ? collectionPoint.code_collection_point : DEFAULT_COLLECTION_POINT_CODE}
              </div>
            </div>

            {apiStatus === "loading" && (
              <div className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-white/60">
                Loading consent definitions from API...
              </div>
            )}

            {apiStatus === "error" && (
              <div className="rounded-[12px] border border-[#E24B4A]/30 bg-[#E24B4A]/10 px-4 py-4 text-sm font-medium text-white/80">
                Failed to load consent definitions: {apiError}
              </div>
            )}

            <div className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-2">
              {(collectionPoint?.ok ? collectionPoint.consents : []).map((item, idx, items) => {
                const key = prefKeyFromCode(item.code_consent)
                return (
                  <div key={item.code_consent}>
                    <ConsentCheckbox
                      label={item.label}
                      checked={prefs[key]}
                      onCheckedChange={(next) => setPrefs((p) => ({ ...p, [key]: next }))}
                    />
                    {idx !== items.length - 1 && (
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
              disabled={!collectionPoint || !collectionPoint.ok}
              onClick={() => {
                if (!collectionPoint || !collectionPoint.ok) return
                const payload = {
                  consents: collectionPoint.consents.map((item) => {
                    const key = prefKeyFromCode(item.code_consent)
                    return {
                      code_consent: item.code_consent,
                      is_agree: prefs[key],
                    }
                  }),
                }

                console.log(
                  `[POST] /user/consents/${collectionPoint.code_collection_point}`,
                  {
                    headers: {
                      Authorization: token ? `Bearer ${token}` : "(missing token)",
                    },
                    body: payload,
                  }
                )

                if (token) {
                  fetch(`/api/user/consents/${collectionPoint.code_collection_point}`, {
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

            <PageBackButton
              fallbackHref="/profile"
              label="Kembali"
              variant="ghost"
              className="w-full border border-white/10 bg-white/[0.03] text-white/75 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
