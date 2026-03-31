import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { ArrowLeft } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PageBackButtonProps = {
  fallbackHref: string
  label?: string
  className?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  showLabel?: boolean
}

export function PageBackButton({
  fallbackHref,
  label = "Back",
  className,
  variant = "outline",
  size = "sm",
  showLabel = true,
}: PageBackButtonProps) {
  const router = useRouter()
  const [targetHref, setTargetHref] = useState(fallbackHref)

  useEffect(() => {
    if (typeof window === "undefined") return
    const previousHref = window.sessionStorage.getItem("sentinel-previous-route")
    setTargetHref(previousHref && previousHref !== router.asPath ? previousHref : fallbackHref)
  }, [fallbackHref, router.asPath])

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("gap-2 font-black uppercase tracking-widest", className)}
      onClick={() => router.push(targetHref)}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      {showLabel ? <span>{label}</span> : null}
    </Button>
  )
}
