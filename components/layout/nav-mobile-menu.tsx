"use client";

import { SectionLink } from "@/components/layout/section-link";
import {
  Award,
  BookOpen,
  CircleHelp,
  Code,
  FolderOpen,
  GitBranch,
  Mail,
  MessageSquareQuote,
  User,
  type LucideIcon,
} from "lucide-react";
import type { NavSection } from "@/constants/navigation";

const sectionIcons: Record<string, LucideIcon> = {
  about: User,
  skills: Code,
  projects: FolderOpen,
  certifications: Award,
  github: GitBranch,
  blog: BookOpen,
  testimonials: MessageSquareQuote,
  faq: CircleHelp,
  contact: Mail,
};

interface NavMobileMenuProps {
  sections: NavSection[];
  onNavigate?: () => void;
}

export function NavMobileMenu({ sections, onNavigate }: NavMobileMenuProps) {
  return (
    <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
      {sections.map((section) => {
        const Icon = sectionIcons[section.id];
        if (!section.href) return null;

        return (
          <SectionLink
            key={section.id}
            href={section.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/70">
              {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
            </span>
            <span>{section.title}</span>
          </SectionLink>
        );
      })}
    </nav>
  );
}
