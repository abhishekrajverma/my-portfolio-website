"use client";

import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(
  () =>
    import("@/components/layout/animated-background").then(
      (m) => m.AnimatedBackground
    ),
  { ssr: false }
);

export function LazyAnimatedBackground() {
  return <AnimatedBackground />;
}
