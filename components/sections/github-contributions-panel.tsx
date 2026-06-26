"use client";

import Image from "next/image";
import { CalendarDays, Flame, TrendingUp } from "lucide-react";
import type { GitHubYearlyCommits } from "@/lib/github/stats";
import { cn } from "@/lib/utils";

type GitHubContributionsPanelProps = {
  contributionChartUrl: string;
  yearlyCommits: GitHubYearlyCommits[];
  totalCommits: number;
};

function getContributionInsights(yearlyCommits: GitHubYearlyCommits[]) {
  if (yearlyCommits.length === 0) {
    return null;
  }

  const peakYear = yearlyCommits.reduce(
    (best, entry) => (entry.commits > best.commits ? entry : best),
    yearlyCommits[0]
  );
  const chartTotal = yearlyCommits.reduce((sum, entry) => sum + entry.commits, 0);
  const avgPerYear = Math.round(chartTotal / yearlyCommits.length);
  const currentYear = new Date().getFullYear();
  const thisYear = yearlyCommits.find((entry) => entry.year === currentYear);
  const lastYear = yearlyCommits.find((entry) => entry.year === currentYear - 1);
  const yearOverYear =
    thisYear && lastYear ? thisYear.commits - lastYear.commits : null;

  return { peakYear, chartTotal, avgPerYear, thisYear, yearOverYear };
}

export function GitHubContributionsPanel({
  contributionChartUrl,
  yearlyCommits,
  totalCommits,
}: GitHubContributionsPanelProps) {
  const peakYearCommits = yearlyCommits.reduce(
    (max, entry) => Math.max(max, entry.commits),
    1
  );
  const insights = getContributionInsights(yearlyCommits);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 overflow-hidden rounded-xl border border-border/70 bg-muted/10 p-2">
        <Image
          src={contributionChartUrl}
          alt="GitHub contribution chart"
          width={600}
          height={120}
          unoptimized
          className="h-auto w-full"
        />
      </div>

      {yearlyCommits.length > 0 && insights && (
        <div className="flex flex-1 flex-col rounded-xl border border-border/60 bg-gradient-to-b from-muted/15 to-muted/5 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Commits by Year
          </p>

          <ul className="flex flex-1 flex-col justify-evenly gap-3 lg:gap-4">
            {yearlyCommits.map((entry) => {
              const widthPercent = Math.max(8, (entry.commits / peakYearCommits) * 100);
              const shareOfPeak = Math.round((entry.commits / peakYearCommits) * 100);

              return (
                <li key={entry.year}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-foreground">{entry.year}</span>
                    <span className="text-muted-foreground">
                      {entry.commits} commits
                      <span className="ml-1.5 hidden text-muted-foreground/70 sm:inline">
                        · {shareOfPeak}% of peak
                      </span>
                    </span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-muted/50 lg:h-3.5">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500",
                        entry.year === insights.peakYear.year && "from-primary via-accent to-secondary"
                      )}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border/60 pt-5 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <Flame className="h-3 w-3 text-accent" />
                Peak Year
              </div>
              <p className="text-lg font-bold text-foreground">{insights.peakYear.year}</p>
              <p className="text-xs text-muted-foreground">
                {insights.peakYear.commits.toLocaleString()} commits
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="h-3 w-3 text-primary" />
                Avg / Year
              </div>
              <p className="text-lg font-bold text-foreground">
                {insights.avgPerYear.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                across {yearlyCommits.length} active years
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-secondary" />
                {insights.thisYear ? `${insights.thisYear.year} So Far` : "All Time"}
              </div>
              <p className="text-lg font-bold text-foreground">
                {(insights.thisYear?.commits ?? totalCommits).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {insights.yearOverYear !== null ? (
                  <>
                    {insights.yearOverYear >= 0 ? "+" : ""}
                    {insights.yearOverYear} vs last year
                  </>
                ) : (
                  "lifetime public commits"
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
