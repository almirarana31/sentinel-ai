import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const router = useRouter()
  const emailFromQuery = typeof router.query.email === "string" ? router.query.email : ""

  const [email, setEmail] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (!router.isReady) return
    setEmail(emailFromQuery)
  }, [router.isReady, emailFromQuery])

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-none">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Email Verification</h1>
            <p className="text-sm text-muted-foreground font-medium">
              We sent a verification code to your email. Enter the code below to verify.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full h-12 px-4 bg-white/70 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-[10px] text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-1 focus:ring-[#7F77DD] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Verification Code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="123456"
                className="w-full h-12 px-4 bg-white/70 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-[10px] text-sm font-black tracking-widest text-center text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-1 focus:ring-[#7F77DD] outline-none"
              />
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                setStatus("loading")
                setMessage("")
                const res = await fetch("/api/auth/verify-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, code }),
                })
                const data = (await res.json()) as { ok: true } | { ok: false; error: string }
                if (!data.ok) {
                  setStatus("error")
                  setMessage(data.error)
                  return
                }
                setStatus("success")
              }}
            >
              {status === "loading" ? "Verifying..." : "Verify"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await fetch("/api/auth/resend-verification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                })
                setMessage("Verification code resent.")
              }}
            >
              Resend Code
            </Button>
            {status === "success" && (
              <p className="text-sm font-bold text-[#1D9E75]">Verified. You can now log in.</p>
            )}
            {status === "error" && (
              <p className="text-sm font-bold text-[#E24B4A]">{message || "Invalid or expired token"}</p>
            )}
            <Button className="w-full" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
