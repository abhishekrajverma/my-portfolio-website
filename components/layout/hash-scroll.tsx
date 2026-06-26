"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  sanitizeLocationHash,
  scrollToSection,
} from "@/lib/hash-navigation";

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const scrollToCurrentHash = () => {
      const hash = sanitizeLocationHash() ?? window.location.hash;
      if (!hash) return;
      scrollToSection(hash, "auto");
    };

    const timeout = window.setTimeout(scrollToCurrentHash, 100);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.pathname !== "/") return;

      const hash = sanitizeLocationHash();
      if (!hash) return;

      scrollToSection(hash);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
