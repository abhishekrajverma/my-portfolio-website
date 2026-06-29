"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SectionLink } from "@/components/layout/section-link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Command,
  Download,
  LockKeyhole,
} from "lucide-react";
import { useTheme } from "@wrksz/themes/client";
import { useScroll, useScrollProgress } from "@/hooks/use-scroll";
import { getNavSections, getPrimaryNavSections, getSecondaryNavSections } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { BrandAvatar } from "@/components/layout/brand-avatar";
import { NavItem } from "@/components/layout/nav-item";
import { NavMoreMenu } from "@/components/layout/nav-more-menu";
import { NavMobileMenu } from "@/components/layout/nav-mobile-menu";
import { cn } from "@/lib/utils";

const CommandMenu = dynamic(
  () =>
    import("@/components/layout/command-menu").then((m) => m.CommandMenu),
  { ssr: false }
);

export function Navbar({
  avatarUrl,
  resumeUrl,
  resumeDownloadName,
}: {
  avatarUrl: string;
  resumeUrl: string;
  resumeDownloadName: string;
}) {
  const pathname = usePathname();
  const navSections = getNavSections(pathname);
  const primaryNavSections = getPrimaryNavSections(pathname);
  const secondaryNavSections = getSecondaryNavSections(pathname);
  const scrolled = useScroll(20);
  const progress = useScrollProgress();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || mobileOpen
            ? "border-b border-border bg-background/95 shadow-lg backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
        <nav className="container-custom flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <SectionLink href="/#hero" className="flex items-center gap-2 group">
            <BrandAvatar avatarUrl={avatarUrl} alt={siteConfig.name} size="sm" />
            <span className="hidden font-semibold xl:block group-hover:text-primary transition-colors">
              {siteConfig.name.split(" ")[0]}
            </span>
          </SectionLink>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
            {primaryNavSections.map((section) => (
              <NavItem key={section.id} section={section} />
            ))}
            <NavMoreMenu sections={secondaryNavSections} />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandOpen(true)}
              className="hidden sm:inline-flex"
              aria-label="Open command menu"
            >
              <Command className="h-4 w-4" />
            </Button>

            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="pointer-events-none"
                tabIndex={-1}
              >
                <Sun className="h-4 w-4 opacity-0" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="hidden gap-1.5 lg:inline-flex"
              asChild
            >
              <Link href="/admin/login">
                <LockKeyhole className="h-4 w-4" />
                <span className="hidden xl:inline">Login</span>
              </Link>
            </Button>

            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-flex"
              asChild
            >
              <a
                href={resumeUrl}
                download={resumeDownloadName}
                aria-label="Download resume"
              >
                <Download className="h-4 w-4" />
                <span className="hidden 2xl:inline">Resume</span>
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 bottom-0 z-[60] overflow-y-auto border-t border-border bg-background/98 shadow-2xl backdrop-blur-xl sm:top-16 lg:hidden"
          >
            <div className="container-custom flex flex-col gap-6 px-4 py-5 sm:px-6">
              <NavMobileMenu
                sections={navSections}
                onNavigate={() => setMobileOpen(false)}
              />
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-border px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                  <LockKeyhole className="h-4 w-4 text-primary" />
                </span>
                Admin Login
              </Link>
              <Button variant="gradient" className="w-full" asChild>
                  <a
                    href={resumeUrl}
                    download={resumeDownloadName}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {commandOpen ? (
        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      ) : null}
    </>
  );
}
