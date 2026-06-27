"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(
  () =>
    import("@/components/layout/animated-background").then(
      (m) => m.AnimatedBackground
    ),
  { ssr: false }
);

export function LazyAnimatedBackground() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reveal = () => setShow(true);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(reveal, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(reveal, 300);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return <AnimatedBackground />;
}
