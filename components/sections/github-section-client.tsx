"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  GitCommitHorizontal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import { githubEarnedAchievements } from "@/data/github-achievements";
import { githubProfile } from "@/data/github-profile";
import type { GitHubProfileData } from "@/lib/github/stats";
import { siteConfig } from "@/constants/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
import { GitHubContributionsPanel } from "@/components/sections/github-contributions-panel";
import { GitHubLiveBadge } from "@/components/sections/github-live-badge";
import { GitHubRecentCommits } from "@/components/sections/github-recent-commits";

type GitHubSectionClientProps = {
  githubData: GitHubProfileData;
};

const GITHUB_STAT_LABELS = [
  { key: "totalCommits" as const, label: "Total Commits" },
  { key: "publicRepos" as const, label: "Public Repos" },
  { key: "followers" as const, label: "Followers" },
  { key: "following" as const, label: "Following" },
  { key: "totalStars" as const, label: "Total Stars" },
];

export function GitHubSectionClient({ githubData }: GitHubSectionClientProps) {
  const {
    stats: githubStats,
    recentCommits,
    yearlyCommits,
    totalCommits,
    contributionCalendar,
    contributionChartUrl,
    fetchedAt,
    cacheRevalidateSeconds,
  } = githubData;

  return (
    <section id="github" className="section-padding bg-muted/10">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="GitHub"
            title="Stats & Activity"
            description="GitHub statistics, contributions, and earned achievements."
          />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <GlassCard className="mb-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <GitHubIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GitHub Profile</p>
                  <p className="text-lg font-semibold">@{githubProfile.username}</p>
                </div>
              </a>

              <GitHubLiveBadge
                fetchedAt={fetchedAt}
                cacheRevalidateSeconds={cacheRevalidateSeconds}
              />
            </div>

            {githubStats ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {GITHUB_STAT_LABELS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="rounded-xl border border-border/70 bg-muted/20 px-4 py-4 text-center"
                  >
                    <p className="text-2xl font-bold text-primary">
                      {key === "totalCommits" ? totalCommits : githubStats[key]}
                    </p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                GitHub stats are temporarily unavailable.
              </p>
            )}
          </GlassCard>
        </MotionWrapper>

        <div className="mb-6 grid min-w-0 gap-6 lg:grid-cols-2 lg:items-stretch">
          <MotionWrapper delay={0.15} className="h-full min-w-0">
            <GlassCard hover={false} className="flex h-full min-w-0 flex-col overflow-hidden">
              <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold">Contributions</h3>
                </div>
                <GitHubLiveBadge
                  fetchedAt={fetchedAt}
                  cacheRevalidateSeconds={cacheRevalidateSeconds}
                  className="shrink-0"
                />
              </div>

              <GitHubContributionsPanel
                contributionCalendar={contributionCalendar}
                contributionChartUrl={contributionChartUrl}
                yearlyCommits={yearlyCommits}
                totalCommits={totalCommits}
              />
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.18} className="h-full min-w-0">
            <GlassCard hover={false} className="flex h-full min-w-0 flex-col overflow-hidden">
              <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <GitCommitHorizontal className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Recent Commits (24h)</h3>
                  {recentCommits.length > 0 && (
                    <Badge variant="glass">{recentCommits.length} today</Badge>
                  )}
                </div>
                <GitHubLiveBadge
                  fetchedAt={fetchedAt}
                  cacheRevalidateSeconds={cacheRevalidateSeconds}
                />
              </div>

              <div className="flex flex-1 flex-col">
                <GitHubRecentCommits commits={recentCommits} />
              </div>
            </GlassCard>
          </MotionWrapper>
        </div>

        <MotionWrapper delay={0.2}>
          <GlassCard>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Trophy className="h-4 w-4 text-secondary" />
                <h3 className="font-semibold">Earned Achievements</h3>
                <Badge variant="accent">{githubEarnedAchievements.length} badges</Badge>
              </div>
              <GitHubLiveBadge
                fetchedAt={fetchedAt}
                cacheRevalidateSeconds={cacheRevalidateSeconds}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {githubEarnedAchievements.map((achievement) => (
                <a
                  key={achievement.id}
                  href={`${siteConfig.github}?tab=achievements`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center rounded-xl border border-border/70 bg-muted/10 p-6 text-center transition-colors hover:border-primary/30 hover:bg-muted/20"
                >
                  <div className="mb-4 overflow-hidden rounded-full">
                    <Image
                      src={achievement.imageUrl}
                      alt={`${achievement.name} GitHub achievement`}
                      width={120}
                      height={120}
                      unoptimized
                      className="h-28 w-28 object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <p className="mb-2 text-sm font-semibold text-foreground group-hover:text-primary">
                    {achievement.name}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {achievement.description}
                  </p>
                </a>
              ))}
            </div>
          </GlassCard>
        </MotionWrapper>

        <MotionWrapper delay={0.22} className="mt-6 text-center">
          <Button variant="outline" asChild>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
              View GitHub Profile
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </MotionWrapper>
      </div>
    </section>
  );
}
