import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const DEMO_EMAIL = "almira@gmail.com"
const DEMO_PASSWORD = "Almira"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [status, setStatus] = useState<null | "loading" | "verify" | "error">(null)
  const [message, setMessage] = useState<string>("")

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 font-sans selection:bg-[#7F77DD] selection:text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#7F77DD] rounded-[8px] flex items-center justify-center shadow-lg shadow-[#7F77DD]/20">
              <span className="font-black text-white text-xl italic">S</span>
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">Sentinel</span>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Login</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Demo credentials are pre-filled. Just click <span className="font-bold">Masuk</span>.
          </p>
        </div>

        <Card className="border-[0.5px] border-zinc-200 shadow-2xl shadow-zinc-200/50">
          <CardContent className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border-[0.5px] border-zinc-200 dark:border-zinc-800 rounded-[8px] text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-1 focus:ring-[#7F77DD] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border-[0.5px] border-zinc-200 dark:border-zinc-800 rounded-[8px] text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-1 focus:ring-[#7F77DD] outline-none"
              />
            </div>

            <Button
              className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-[#7F77DD]/20"
              onClick={async () => {
                setStatus("loading")
                setMessage("")
                const result = await login({ email, password, name: "Almira" })
                if (result.ok) return
                if ("requiresVerification" in result && result.requiresVerification) {
                  setStatus("verify")
                  setMessage(result.message)
                  router.push(`/verify-email?email=${encodeURIComponent(email)}`)
                  return
                }
                setStatus("error")
                setMessage("error" in result ? result.error : "Login failed")
              }}
            >
              {status === "loading" ? "Memproses..." : "Masuk"}
            </Button>

            {status === "verify" && (
              <div className="text-xs font-bold text-[#BA7517] uppercase tracking-widest text-center">
                {message || "Email verification required. Check your inbox for the code."}
              </div>
            )}
            {status === "error" && (
              <div className="text-xs font-bold text-[#E24B4A] uppercase tracking-widest text-center">
                {message || "Login failed"}
              </div>
            )}
            {status === "verify" && (
              <Button
                variant="outline"
                className="w-full h-10 font-black uppercase tracking-widest text-[10px] border-zinc-200"
                onClick={async () => {
                  await fetch("/api/auth/resend-verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  })
                  setMessage("Verification code resent. Check your inbox.")
                }}
              >
                Resend Verification Email
              </Button>
            )}

            <div className="pt-2 text-center text-sm font-semibold text-muted-foreground">
              New here?{" "}
              <Link href="/signup" className="font-black text-[#7F77DD] hover:underline">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
