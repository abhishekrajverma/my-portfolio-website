"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(
  () =>
    import("@/components/layout/loading-screen").then((m) => m.LoadingScreen),
  { ssr: false }
);

const SPLASH_SESSION_KEY = "portfolio-splash-seen";
const MIN_SPLASH_MS = 0;

function shouldSkipSplash(): boolean {
  try {
    if (sessionStorage.getItem(SPLASH_SESSION_KEY) === "1") {
      return true;
    }
  } catch {
    // Ignore storage errors in private mode.
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AppSplash({ avatarUrl }: { avatarUrl: string }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin") || shouldSkipSplash()) {
      setVisible(false);
      return;
    }

    const startedAt = Date.now();
    setVisible(true);

    const finish = () => {
      const remaining = Math.max(0, MIN_SPLASH_MS - (Date.now() - startedAt));

      window.setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
        } catch {
          // Ignore storage errors.
        }
      }, remaining);
    };

    if (document.readyState !== "loading") {
      finish();
      return;
    }

    document.addEventListener("DOMContentLoaded", finish, { once: true });
    return () => document.removeEventListener("DOMContentLoaded", finish);
  }, [pathname]);

  if (!visible) return null;

  return <LoadingScreen avatarUrl={avatarUrl} />;
}
