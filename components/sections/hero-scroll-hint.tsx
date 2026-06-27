"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { navigateToSection } from "@/lib/hash-navigation";

export function HeroScrollHint() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="mt-16 flex justify-center"
    >
      <motion.button
        type="button"
        onClick={() => navigateToSection("/#about", pathname, router)}
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity }}
        className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Scroll to About section"
      >
        <span className="text-xs">Scroll to explore</span>
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}
