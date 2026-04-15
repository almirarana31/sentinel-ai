import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type SignupResult =
  | { ok: true }
  | { ok: false; requiresVerification: true; message: string }
  | { ok: false; error: string }

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<null | "loading" | "verify" | "error">(null)
  const [message, setMessage] = useState("")

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
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Sign Up</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Create an account and verify your email to sign in.
          </p>
        </div>

        <Card className="border-[0.5px] border-zinc-200 shadow-2xl shadow-zinc-200/50">
          <CardContent className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border-[0.5px] border-zinc-200 dark:border-zinc-800 rounded-[8px] text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-1 focus:ring-[#7F77DD] outline-none"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border-[0.5px] border-zinc-200 dark:border-zinc-800 rounded-[8px] text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-1 focus:ring-[#7F77DD] outline-none"
                placeholder="you@gmail.com"
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
                placeholder="At least 8 characters"
              />
            </div>

            <Button
              className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-[#7F77DD]/20"
              onClick={async () => {
                setStatus("loading")
                setMessage("")
                const res = await fetch("/api/auth/signup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, password }),
                })
                const data = (await res.json()) as SignupResult
                if (!data.ok && "requiresVerification" in data && data.requiresVerification) {
                  setStatus("verify")
                  setMessage(data.message)
                  router.push(`/verify-email?email=${encodeURIComponent(email)}`)
                  return
                }
                if (!data.ok) {
                  setStatus("error")
                  setMessage("error" in data ? data.error : "Signup failed")
                  return
                }
                router.push("/login")
              }}
            >
              {status === "loading" ? "Creating..." : "Create Account"}
            </Button>

            {status === "verify" && (
              <div className="text-xs font-bold text-[#BA7517] uppercase tracking-widest text-center">
                {message || "Verification required. Check your inbox for the code."}
              </div>
            )}
            {status === "error" && (
              <div className="text-xs font-bold text-[#E24B4A] uppercase tracking-widest text-center">
                {message || "Signup failed"}
              </div>
            )}

            <div className="pt-2 text-center text-sm font-semibold text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-black text-[#7F77DD] hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
