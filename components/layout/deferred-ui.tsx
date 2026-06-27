"use client";

import dynamic from "next/dynamic";

const BackToTop = dynamic(
  () => import("@/components/layout/back-to-top").then((m) => m.BackToTop),
  { ssr: false }
);
const HashScrollHandler = dynamic(
  () =>
    import("@/components/layout/hash-scroll").then((m) => m.HashScrollHandler),
  { ssr: false }
);
const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false }
);

export function DeferredUi() {
  return (
    <>
      <BackToTop />
      <HashScrollHandler />
      <SpeedInsights />
    </>
  );
}
