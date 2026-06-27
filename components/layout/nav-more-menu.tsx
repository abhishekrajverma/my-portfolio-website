"use client";

import { useState } from "react";
import { SectionLink } from "@/components/layout/section-link";
import {
  desktopNavItemClass,
  desktopNavItemStateClass,
} from "@/components/layout/nav-styles";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  ChevronDown,
  CircleHelp,
  GitBranch,
  MessageSquareQuote,
  type LucideIcon,
} from "lucide-react";
import type { NavSection } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const sectionIcons: Record<string, LucideIcon> = {
  certifications: Award,
  github: GitBranch,
  testimonials: MessageSquareQuote,
  faq: CircleHelp,
};

interface NavMoreMenuProps {
  sections: NavSection[];
}

export function NavMoreMenu({ sections }: NavMoreMenuProps) {
  const [open, setOpen] = useState(false);

  if (sections.length === 0) return null;

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(desktopNavItemClass, desktopNavItemStateClass(open))}
      >
        <span className="whitespace-nowrap">More</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-52 -translate-x-1/2 rounded-xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl"
          >
            <div className="grid gap-0.5">
              {sections.map((section) => {
                if (!section.href) return null;
                const Icon = sectionIcons[section.id];

                return (
                  <SectionLink
                    key={section.id}
                    href={section.href}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
                    {section.title}
                  </SectionLink>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
