"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "@/components/layout/loading-screen";

const MIN_SPLASH_MS = 1400;

export function AppSplash() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setVisible(false);
      return;
    }

    const startedAt = Date.now();

    const finish = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

      window.setTimeout(() => setVisible(false), remaining);
    };

    if (document.readyState === "complete") {
      finish();
      return;
    }

    window.addEventListener("load", finish, { once: true });
    return () => window.removeEventListener("load", finish);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="app-splash"
          className="fixed inset-0 z-[200]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <LoadingScreen />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
