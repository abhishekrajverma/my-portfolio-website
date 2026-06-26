"use client";

import { ArrowUpRight, GitBranch, GitCommitHorizontal } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import type { GitHubCommitActivity } from "@/lib/github/stats";
import { cn } from "@/lib/utils";

type GitHubRecentCommitsProps = {
  commits: GitHubCommitActivity[];
};

function getShortSha(url: string): string {
  const sha = url.split("/").pop();
  return sha?.slice(0, 7) ?? "—";
}

function formatRelativeTime(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return "Recently";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return days === 1 ? "1d ago" : `${days}d ago`;
}

function formatCommitTime(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function GitHubRecentCommits({ commits }: GitHubRecentCommitsProps) {
  if (commits.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/10 px-6 py-10 text-center lg:min-h-0">
        <GitCommitHorizontal className="mb-3 h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">No commits in the last 24 hours</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          New pushes to your public repos will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-0">
      <div
        aria-hidden
        className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-primary/50 via-secondary/40 to-transparent"
      />

      {commits.map((commit, index) => {
        const shortSha = getShortSha(commit.url);

        return (
          <li key={commit.id} className="relative pl-8">
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-5 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border bg-background shadow-sm",
                index === 0
                  ? "border-primary/40 bg-primary/10 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                  : "border-border/80 bg-muted/30"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  index === 0 ? "animate-pulse bg-primary" : "bg-muted-foreground/50"
                )}
              />
            </span>

            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-3 block rounded-xl border border-border/60 bg-gradient-to-br from-muted/20 via-background/40 to-muted/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_12px_40px_-20px_var(--glow-primary)]"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <GitBranch className="h-3 w-3" />
                  {commit.repo}
                </span>
                <code className="rounded-md border border-border/70 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {shortSha}
                </code>
                <span className="text-[10px] text-muted-foreground">
                  {formatRelativeTime(commit.date)}
                </span>
                <span className="hidden text-[10px] text-muted-foreground/80 sm:inline">
                  · {formatCommitTime(commit.date)}
                </span>

                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
              </div>

              <p className="line-clamp-2 text-sm leading-relaxed text-foreground transition-colors group-hover:text-primary">
                {commit.message}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <GitHubIcon className="h-3 w-3" />
                <span>View commit on GitHub</span>
              </div>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
