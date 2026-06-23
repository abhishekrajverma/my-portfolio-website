"use client";

import { HeroTypingRole } from "@/components/animations/hero-text";

export function HeroRole({ roles }: { roles: string[] }) {
  return <HeroTypingRole roles={roles} startDelay={0} />;
}
