"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Home, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@wrksz/themes/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface PortfolioAdminShellProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  viewSiteHref?: string;
}

export function PortfolioAdminShell({
  children,
  title,
  action,
  viewSiteHref = "/",
}: PortfolioAdminShellProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-custom space-y-4 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Portfolio Admin
              </p>
              <h1 className="truncate text-lg font-semibold">{title}</h1>
            </div>
            {action ? (
              <div className="flex w-full shrink-0 justify-end sm:w-auto">
                {action}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Home</span>
              </Link>
            </Button>
            <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
              <Button variant="outline" size="sm" asChild>
                <Link href={viewSiteHref} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View Site</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() =>
                  mounted && setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                aria-label="Toggle theme"
                disabled={!mounted}
              >
                {!mounted ? (
                  <Sun className="h-4 w-4 opacity-0" />
                ) : resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="container-custom px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  );
}
