"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, Search } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import type { Project } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
import { staggerContainer, staggerItem } from "@/components/animations/motion-wrapper";
import { cn } from "@/lib/utils";

function ProjectCard({ project }: { project: Project }) {
  const previewInsight = project.keyInsights[0];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group relative"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm",
          "transition-all duration-500",
          "hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_var(--glow-primary)]"
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        </div>

        <div className="relative flex flex-col md:flex-row">
          <Link
            href={`/projects/${project.slug}`}
            className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-auto md:w-[42%] md:min-h-[280px]"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/20" />

            {project.featured ? (
              <Badge className="absolute left-4 top-4 border-0 bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm">
                Featured
              </Badge>
            ) : null}

            <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
                View case study
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>

          <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-border/80 bg-muted/40 text-[11px] font-medium uppercase tracking-wide text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div>
                <Link href={`/projects/${project.slug}`}>
                  <h3 className="text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-primary md:text-2xl">
                    {project.title}
                  </h3>
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.description}
                </p>
              </div>

              {previewInsight ? (
                <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Key impact
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {previewInsight}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
              <Button variant="gradient" size="sm" className="group/btn" asChild>
                <Link href={`/projects/${project.slug}`}>
                  View Details
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full transition-colors hover:bg-muted hover:text-primary"
                  asChild
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} on GitHub`}
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full transition-colors hover:bg-muted hover:text-primary"
                  asChild
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} live demo`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="ml-auto hidden text-xs text-muted-foreground sm:block">
                {project.tools.slice(0, 3).join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const allTags = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))],
    [projects]
  );

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const query = search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesTag = activeTag === "All" || p.tags.includes(activeTag);
        return matchesSearch && matchesTag;
      }),
    [search, activeTag, projects]
  );

  const filterKey = `${activeTag}-${search}`;

  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="Projects"
            title="Featured Work"
            description="Real-world analytics projects demonstrating end-to-end data solutions from problem to insight."
          />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-border/80 bg-card/50 pl-10 backdrop-blur-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={activeTag === tag}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300",
                    activeTag === tag
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "glass text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">
            Showing {filtered.length} of {projects.length} projects
          </p>
        </MotionWrapper>

        <AnimatePresence mode="wait">
          <motion.div
            key={filterKey}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={staggerContainer}
            className="flex flex-col gap-8"
          >
            {filtered.map((project) => (
              <motion.div key={project.slug} variants={staggerItem}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No projects match your search.
          </p>
        ) : null}

        <MotionWrapper delay={0.3} className="mt-10 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">
              View All Projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </MotionWrapper>
      </div>
    </section>
  );
}
