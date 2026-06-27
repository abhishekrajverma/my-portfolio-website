"use client";

import { SectionLink } from "@/components/layout/section-link";
import { desktopNavItemClass } from "@/components/layout/nav-styles";
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

interface NavItemProps {
  section: NavSection;
}

export function NavItem({ section }: NavItemProps) {
  const Icon = sectionIcons[section.id];

  if (!section.href) return null;

  return (
    <SectionLink href={section.href} className={desktopNavItemClass}>
      {Icon ? <Icon className="hidden h-4 w-4 xl:inline" /> : null}
      <span className="whitespace-nowrap">{section.title}</span>
    </SectionLink>
  );
}
