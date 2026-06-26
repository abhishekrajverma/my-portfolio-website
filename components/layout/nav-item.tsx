"use client";

import { SectionLink } from "@/components/layout/section-link";
import { NavSectionMenu } from "@/components/layout/nav-section-menu";
import {
  desktopNavItemClass,
} from "@/components/layout/nav-styles";
import {
  Award,
  BookOpen,
  Code,
  FolderOpen,
  Home,
  Mail,
  User,
  type LucideIcon,
} from "lucide-react";
import type { NavSection } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const sectionIcons: Record<string, LucideIcon> = {
  home: Home,
  about: User,
  projects: FolderOpen,
  certifications: Award,
  skills: Code,
  contact: Mail,
  blog: BookOpen,
};

interface NavItemProps {
  section: NavSection;
  mounted: boolean;
}

export function NavItem({ section, mounted }: NavItemProps) {
  const Icon = sectionIcons[section.id];

  if (section.href) {
    return (
      <SectionLink href={section.href} className={desktopNavItemClass}>
        {Icon ? (
          <Icon className="hidden h-4 w-4 xl:inline" />
        ) : null}
        <span className="whitespace-nowrap">{section.title}</span>
      </SectionLink>
    );
  }

  if (!mounted) {
    return (
      <span className={cn(desktopNavItemClass, "cursor-default")} aria-hidden>
        {Icon ? <Icon className="hidden h-4 w-4 xl:inline" /> : null}
        <span className="whitespace-nowrap">{section.title}</span>
      </span>
    );
  }

  return <NavSectionMenu section={section} />;
}
