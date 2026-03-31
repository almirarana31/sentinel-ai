import { AuthProvider } from "@/lib/auth-context";
import { ConsentProvider } from "@/lib/consent-context";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/router";
import { AppNav } from "@/components/layout/app-nav";
import { ConsentManager } from "@/components/consent/consent-manager";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const hideNav =
    router.pathname === "/" ||
    router.pathname === "/pricing" ||
    router.pathname === "/login" ||
    router.pathname === "/home" ||
    router.pathname === "/profile" ||
    router.pathname === "/persetujuan" ||
    router.pathname === "/persetujuan-selesai" ||
    router.pathname === "/terms" ||
    router.pathname === "/verify-email" ||
    router.pathname === "/lesson-view" ||
    router.pathname === "/post-lesson-summary";

  useEffect(() => {
    const savedState = window.localStorage.getItem("sentinel-sidebar-collapsed");
    if (savedState) {
      setSidebarCollapsed(savedState === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentRoute = window.sessionStorage.getItem("sentinel-current-route");
    if (currentRoute && currentRoute !== router.asPath) {
      window.sessionStorage.setItem("sentinel-previous-route", currentRoute);
    }
    window.sessionStorage.setItem("sentinel-current-route", router.asPath);
  }, [router.asPath]);

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("sentinel-sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <ConsentProvider>
      <AuthProvider>
        <div className={`dark ${spaceGrotesk.variable} ${spaceGrotesk.className}`}>
          {!hideNav ? (
            <div className="min-h-screen md:flex md:items-stretch">
              <AppNav collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
              <main
                className={cn(
                  "min-h-screen min-w-0 flex-1 pt-14 md:pt-0"
                )}
              >
                <Component {...pageProps} />
              </main>
            </div>
          ) : (
            <Component {...pageProps} />
          )}
          <ConsentManager />
        </div>
      </AuthProvider>
    </ConsentProvider>
  );
}
