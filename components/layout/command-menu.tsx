"use client";

import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { commandMenuLinks } from "@/constants/navigation";
import {
  Home,
  User,
  Code,
  FolderOpen,
  BarChart3,
  Award,
  BookOpen,
  Mail,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-4 w-4" />,
  About: <User className="h-4 w-4" />,
  Skills: <Code className="h-4 w-4" />,
  Projects: <FolderOpen className="h-4 w-4" />,
  Dashboard: <BarChart3 className="h-4 w-4" />,
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

  const handleSelect = (href: string) => {
    onOpenChange(false);
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
              key={link.href}
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
