"use client";

import { useState } from "react";
import { SectionLink } from "@/components/layout/section-link";
import {
  Award,
  BookOpen,
  ChevronDown,
  Code,
  FolderOpen,
  Home,
  Mail,
  User,
  type LucideIcon,
} from "lucide-react";
import { getSectionLinks, type NavSection } from "@/constants/navigation";
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

const linkIcons: Record<string, LucideIcon> = {
  Articles: BookOpen,
  "All Stories": BookOpen,
  "Blog Studio": BookOpen,
};

interface NavMobileMenuProps {
  sections: NavSection[];
  onNavigate?: () => void;
}

export function NavMobileMenu({ sections, onNavigate }: NavMobileMenuProps) {
  const [blogOpen, setBlogOpen] = useState(true);

  return (
    <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
      {sections.map((section) => {
        const Icon = sectionIcons[section.id];

        if (section.href) {
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
        }

        const links = getSectionLinks(section);

        return (
          <div key={section.id} className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setBlogOpen((open) => !open)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
              </span>
              <span className="flex-1">{section.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  blogOpen && "rotate-180"
                )}
              />
            </button>

            {blogOpen ? (
              <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                {links.map((link) => {
                  const LinkIcon = linkIcons[link.label];

                  return (
                    <SectionLink
                      key={link.label}
                      href={link.href}
                      onClick={onNavigate}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                      {LinkIcon ? (
                        <LinkIcon className="h-4 w-4 shrink-0" />
                      ) : null}
                      {link.label}
                    </SectionLink>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
