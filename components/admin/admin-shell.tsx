"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, LogOut, Plus } from "lucide-react";
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

  const handleSignOut = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container-custom flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blog Studio</p>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
      </header>

      <div className="container-custom py-8">
        {breadcrumb}
        {description ? (
          <p className="mb-6 max-w-3xl text-muted-foreground">{description}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
