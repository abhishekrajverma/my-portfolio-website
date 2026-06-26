import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: AdminBreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  showBack?: boolean;
}

export function AdminBreadcrumb({
  items,
  backHref = "/admin/blog",
  backLabel = "Back to all posts",
  showBack = true,
}: AdminBreadcrumbProps) {
  return (
    <nav
      className="mb-6 flex items-center gap-3"
      aria-label="Breadcrumb"
    >
      {showBack ? (
        <Button variant="outline" size="icon" className="shrink-0" asChild>
          <Link href={backHref} aria-label={backLabel}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}

      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="truncate font-medium text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
