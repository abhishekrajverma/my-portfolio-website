import { Clock3, RefreshCw } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import { GITHUB_DATA_REVALIDATE_SECONDS } from "@/lib/github/stats";
import { cn } from "@/lib/utils";

type GitHubLiveBadgeProps = {
  fetchedAt: string;
  cacheRevalidateSeconds?: number;
  className?: string;
};

function formatCacheDuration(seconds: number): string {
  if (seconds >= 3600 && seconds % 3600 === 0) {
    const hours = seconds / 3600;
    return hours === 1 ? "1h" : `${hours}h`;
  }

  if (seconds >= 60 && seconds % 60 === 0) {
    const minutes = seconds / 60;
    return minutes === 1 ? "1m" : `${minutes}m`;
  }

  return `${seconds}s`;
}

function formatSyncedAt(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function GitHubLiveBadge({
  fetchedAt,
  cacheRevalidateSeconds = GITHUB_DATA_REVALIDATE_SECONDS,
  className,
}: GitHubLiveBadgeProps) {
  const cacheLabel = formatCacheDuration(cacheRevalidateSeconds);

  return (
    <div
      className={cn(
        "inline-flex max-w-full flex-col gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2 shadow-sm backdrop-blur-sm",
        "ring-1 ring-emerald-500/10",
        className
      )}
      role="status"
      aria-label={`Live GitHub API data, refreshes every ${cacheLabel}, last fetch ${formatSyncedAt(fetchedAt)}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-foreground">
          <GitHubIcon className="h-3.5 w-3.5 shrink-0" />
          GitHub API
        </span>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
            Live
          </span>
        </div>
      </div>

      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] leading-tight text-muted-foreground">
        <span className="inline-flex items-center gap-0.5">
          <RefreshCw className="h-2.5 w-2.5 shrink-0 text-secondary" />
          Every {cacheLabel}
        </span>
        <span className="text-border/80">·</span>
        <span className="inline-flex items-center gap-0.5">
          <Clock3 className="h-2.5 w-2.5 shrink-0 text-accent" />
          Last fetch {formatSyncedAt(fetchedAt)}
        </span>
      </p>
    </div>
  );
}
