"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Command,
  Download,
} from "lucide-react";
import { useTheme } from "@wrksz/themes/client";
import { useScroll, useScrollProgress } from "@/hooks/use-scroll";
import { navLinks } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/layout/command-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
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
        <nav className="container-custom flex h-16 items-center justify-between px-6">
          <Link href="/#hero" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              AR
            </div>
            <span className="hidden font-semibold sm:block group-hover:text-primary transition-colors">
              {siteConfig.name.split(" ")[0]}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex"
              aria-label="Open command menu"
            >
              <Command className="h-4 w-4" />
            </Button>

            {mounted && (
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
            )}

            <Button variant="gradient" size="sm" className="hidden sm:flex" asChild>
              <a
                href={siteConfig.resumeUrl}
                download={siteConfig.resumeDownloadName}
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
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
            className="fixed inset-x-0 top-16 bottom-0 z-[60] overflow-y-auto border-t border-border bg-background shadow-2xl md:hidden"
          >
            <div className="container-custom flex flex-col gap-1 px-6 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/50"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button variant="gradient" className="mt-2" asChild>
                  <a
                    href={siteConfig.resumeUrl}
                    download={siteConfig.resumeDownloadName}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
