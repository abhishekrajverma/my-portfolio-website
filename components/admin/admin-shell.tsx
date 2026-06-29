"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  FolderKanban,
  Home,
  LogOut,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import { useTheme } from "@wrksz/themes/client";
import { Button } from "@/components/ui/button";

type AdminStudio = "blog" | "projects";

interface AdminShellProps {
  children: React.ReactNode;
  studio?: AdminStudio;
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

const studioConfig: Record<
  AdminStudio,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    newHref: string;
    newLabel: string;
    viewSiteHref: string;
  }
> = {
  blog: {
    label: "Blog Studio",
    icon: FileText,
    newHref: "/admin/blog/new",
    newLabel: "New Post",
    viewSiteHref: "/blog",
  },
  projects: {
    label: "Projects Studio",
    icon: FolderKanban,
    newHref: "/admin/projects/new",
    newLabel: "New Project",
    viewSiteHref: "/projects",
  },
};

export function AdminShell({
  children,
  studio = "blog",
  title,
  description,
  action,
  breadcrumb,
}: AdminShellProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const config = studioConfig[studio];
  const StudioIcon = config.icon;

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const primaryAction =
    action ?? (
      <Button size="sm" asChild>
        <Link href={config.newHref}>
          <Plus className="h-4 w-4" />
          {config.newLabel}
        </Link>
      </Button>
    );

  const themeToggle = (
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
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-custom space-y-4 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <StudioIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {config.label}
                </p>
                <h1 className="truncate text-lg font-semibold">{title}</h1>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center justify-end sm:w-auto">
              {primaryAction}
            </div>
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
                <Link href={config.viewSiteHref} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View Site</span>
                </Link>
              </Button>
              {themeToggle}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom px-4 py-6 sm:px-6 sm:py-8">
        {breadcrumb}
        {description ? (
          <p className="mb-6 max-w-3xl text-muted-foreground">{description}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
