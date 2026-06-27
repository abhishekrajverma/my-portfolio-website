"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  LayoutList,
  LogOut,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import { useTheme } from "@wrksz/themes/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

function MobileNavButton({
  href,
  onClick,
  icon: Icon,
  label,
  external,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  external?: boolean;
}) {
  const className = cn(
    "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border/80",
    "bg-muted/20 px-2 py-3 text-center transition-colors",
    "hover:border-primary/30 hover:bg-muted/40 active:scale-[0.98]"
  );

  const content = (
    <>
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-[11px] font-medium leading-none text-foreground">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function AdminShell({
  children,
  title,
  description,
  action,
  breadcrumb,
}: AdminShellProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const primaryAction =
    action ?? (
      <Button className="w-full sm:w-auto" size="default" asChild>
        <Link href="/admin/blog/new">
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </Button>
    );

  const themeToggle = mounted ? (
    <Button
      variant="outline"
      size="icon"
      className="shrink-0"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
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
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className="pointer-events-none shrink-0"
      tabIndex={-1}
    >
      <Sun className="h-4 w-4 opacity-0" />
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-custom px-4 py-4 sm:px-6 sm:py-4">
          {/* Mobile */}
          <div className="space-y-4 sm:hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Blog Studio
                  </p>
                  <h1 className="mt-0.5 line-clamp-2 text-lg font-semibold leading-snug text-foreground">
                    {title}
                  </h1>
                </div>
              </div>
              {themeToggle}
            </div>

            <div className="w-full sm:hidden [&_button]:h-11 [&_button]:w-full [&_button]:text-sm">
              {primaryAction}
            </div>

            <nav
              className="grid grid-cols-3 gap-2"
              aria-label="Blog Studio navigation"
            >
              <MobileNavButton
                href="/admin/blog"
                icon={LayoutList}
                label="All Posts"
              />
              <MobileNavButton
                href="/blog"
                icon={ExternalLink}
                label="View Site"
                external
              />
              <MobileNavButton
                icon={LogOut}
                label="Sign out"
                onClick={handleSignOut}
              />
            </nav>
          </div>

          {/* Desktop */}
          <div className="hidden items-center justify-between gap-6 sm:flex">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  Blog Studio
                </p>
                <h1 className="truncate text-lg font-semibold">{title}</h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {themeToggle}
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/blog">All Posts</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/blog" target="_blank">
                  View Site
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
              {action ?? (
                <Button size="sm" asChild>
                  <Link href="/admin/blog/new">
                    <Plus className="h-4 w-4" />
                    New Post
                  </Link>
                </Button>
              )}
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
