"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  isSectionHref,
  navigateToSection,
} from "@/lib/hash-navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getCommandMenuLinks } from "@/constants/navigation";
import {
  Home,
  User,
  Code,
  FolderOpen,
  Award,
  BookOpen,
  Mail,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-4 w-4" />,
  About: <User className="h-4 w-4" />,
  Skills: <Code className="h-4 w-4" />,
  Projects: <FolderOpen className="h-4 w-4" />,
  Certifications: <Award className="h-4 w-4" />,
  Blog: <BookOpen className="h-4 w-4" />,
  Contact: <Mail className="h-4 w-4" />,
  "All Projects": <FolderOpen className="h-4 w-4" />,
  "All Articles": <BookOpen className="h-4 w-4" />,
};

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const commandMenuLinks = getCommandMenuLinks(pathname);

  const handleSelect = (href: string) => {
    onOpenChange(false);

    if (isSectionHref(href)) {
      navigateToSection(href, pathname, router);
      return;
    }

    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages and sections..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {commandMenuLinks.map((link) => (
            <CommandItem
              key={link.label}
              value={link.label}
              onSelect={() => handleSelect(link.href)}
            >
              {iconMap[link.label]}
              {link.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
