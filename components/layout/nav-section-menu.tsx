"use client";

import { useState } from "react";
import { SectionLink } from "@/components/layout/section-link";
import {
  desktopNavItemClass,
  desktopNavItemStateClass,
} from "@/components/layout/nav-styles";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { NavSection } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const sectionIcons: Record<string, LucideIcon> = {
  blog: BookOpen,
};

const linkIcons: Record<string, LucideIcon> = {
  Articles: BookOpen,
  "All Stories": BookOpen,
  "Blog Studio": BookOpen,
};

interface NavSectionMenuProps {
  section: NavSection;
}

export function NavSectionMenu({ section }: NavSectionMenuProps) {
  const [open, setOpen] = useState(false);
  const SectionIcon = sectionIcons[section.id];
  const links = section.links ?? [];

  if (links.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          desktopNavItemClass,
          "lg:inline-flex",
          desktopNavItemStateClass(open)
        )}
      >
        {SectionIcon ? (
          <SectionIcon className="hidden h-4 w-4 xl:inline" />
        ) : null}
        <span className="whitespace-nowrap">{section.title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
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
            className="absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-56 -translate-x-1/2 rounded-xl border border-border bg-background/95 p-3 shadow-xl backdrop-blur-xl"
          >
            <div className="mb-2 px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {section.description}
              </p>
            </div>
            <div className="grid gap-0.5">
              {links.map((link) => {
                const LinkIcon = linkIcons[link.label];

                return (
                  <SectionLink
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    {LinkIcon ? <LinkIcon className="h-4 w-4 shrink-0" /> : null}
                    {link.label}
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
