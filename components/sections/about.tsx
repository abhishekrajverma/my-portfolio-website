"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Target } from "lucide-react";
import {
  profile,
  experiences,
  education,
  experienceTimeline,
  educationTimeline,
  stats,
} from "@/data/profile";
import type { TimelineItem } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";
import { useCountUp } from "@/hooks/use-count-up";

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold gradient-text md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function TimelineList({
  items,
  dotClass,
  yearClass,
}: {
  items: TimelineItem[];
  dotClass: string;
  yearClass: string;
}) {
  return (
    <div className="relative space-y-0">
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
      {items.map((item, index) => {
        const startLabel = item.type === "education" ? "Joined" : "Started";
        const endLabel =
          item.endDate.toLowerCase() === "present"
            ? "Present"
            : item.type === "education"
              ? "Completed"
              : "Ended";

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            <div
              className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 bg-background ${dotClass}`}
            />
            <div className="min-w-0 flex-1">
              <span className={`text-xs font-medium ${yearClass}`}>
                {item.period}
              </span>
              <h4 className="font-medium">{item.title}</h4>

              {item.type !== "milestone" ? (
                <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {startLabel}
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {item.startDate}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {endLabel}
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {item.endDate}
                    </dd>
                  </div>
                </dl>
              ) : null}

              {item.description ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="About Me"
            title="Turning Data Into Decisions"
            description="Passionate about uncovering patterns, telling stories with data, and delivering insights that drive measurable business outcomes."
          />
        </MotionWrapper>

        <div className="grid gap-8 lg:grid-cols-3">
          <MotionWrapper className="lg:col-span-2" delay={0.1}>
            <GlassCard className="h-full">
              <h3 className="mb-4 text-xl font-semibold">Professional Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                {profile.summary}
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-lg bg-muted/30 p-4">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h4 className="font-medium">Career Objective</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {profile.careerObjective}
                  </p>
                </div>
              </div>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <GlassCard className="h-full">
              <h3 className="mb-6 text-xl font-semibold">Impact at a Glance</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                ))}
              </div>
            </GlassCard>
          </MotionWrapper>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <MotionWrapper delay={0.1}>
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Experience</h3>
              </div>
              <StaggerContainer className="space-y-4">
                {experiences.map((exp) => (
                  <StaggerItem key={exp.id}>
                    <GlassCard hover={false} className="!p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">{exp.role}</h4>
                          <p className="text-sm text-primary">{exp.company}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {exp.period}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {exp.description}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {exp.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div className="mt-8">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Experience Timeline
                </h4>
                <TimelineList
                  items={experienceTimeline}
                  dotClass="border-primary"
                  yearClass="text-primary"
                />
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <div>
              <div className="mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-secondary" />
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <StaggerContainer className="space-y-4">
                {education.map((edu) => (
                  <StaggerItem key={edu.id}>
                    <GlassCard hover={false} className="!p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-sm text-secondary">
                            {edu.institution}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {edu.period}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {edu.description}
                      </p>
                    </GlassCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div className="mt-8">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Education Timeline
                </h4>
                <TimelineList
                  items={educationTimeline}
                  dotClass="border-secondary"
                  yearClass="text-secondary"
                />
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
