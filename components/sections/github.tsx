"use client";

import { motion } from "framer-motion";
import { GitHubIcon } from "@/components/icons/social-icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { MotionWrapper } from "@/components/animations/motion-wrapper";

// Deterministic contribution pattern (avoids hydration mismatch)
function getContributionCount(week: number, day: number): number {
  return ((week * 7 + day) * 13 + 7) % 5;
}

const contributionData = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week,
    day,
    count: getContributionCount(week, day),
  }))
).flat();

const intensityColors = [
  "bg-muted/30",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/90",
];

export function GitHubSection() {
  const totalContributions = contributionData.reduce((sum, d) => sum + d.count, 0);

  return (
    <section className="section-padding bg-muted/10">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="GitHub Activity"
            title="Open Source Contributions"
            description="Consistent coding activity across data analysis projects, scripts, and portfolio tools."
          />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <GlassCard className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <GitHubIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">abhisehkraj</p>
                <p className="text-sm text-muted-foreground">
                  {totalContributions} contributions in the last year
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-[3px] min-w-max">
                {Array.from({ length: 52 }, (_, week) => (
                  <div key={week} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }, (_, day) => {
                      const cell = contributionData.find(
                        (d) => d.week === week && d.day === day
                      );
                      const count = cell?.count ?? 0;
                      return (
                        <motion.div
                          key={`${week}-${day}`}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (week * 7 + day) * 0.001 }}
                          className={`h-3 w-3 rounded-sm ${intensityColors[count]}`}
                          title={`${count} contributions`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              {intensityColors.map((color, i) => (
                <div key={i} className={`h-3 w-3 rounded-sm ${color}`} />
              ))}
              <span>More</span>
            </div>
          </GlassCard>
        </MotionWrapper>
      </div>
    </section>
  );
}
