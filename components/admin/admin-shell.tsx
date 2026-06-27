"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, LogOut, Moon, Plus, Sun } from "lucide-react";
import { useTheme } from "@wrksz/themes/client";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: React.ReactNode;
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container-custom px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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

            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {mounted ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
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
                  variant="outline"
                  size="icon"
                  aria-label="Toggle theme"
                  className="pointer-events-none shrink-0"
                  tabIndex={-1}
                >
                  <Sun className="h-4 w-4 opacity-0" />
                </Button>
              )}
              <Button variant="outline" size="sm" className="shrink-0" asChild>
                <Link href="/admin/blog">All Posts</Link>
              </Button>
              <Button variant="outline" size="sm" className="shrink-0" asChild>
                <Link href="/blog" target="_blank">
                  View Site
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden min-[420px]:inline">Sign out</span>
              </Button>
              {action ?? (
                <Button size="sm" className="shrink-0" asChild>
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
