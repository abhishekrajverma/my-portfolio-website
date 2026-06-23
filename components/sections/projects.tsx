"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
import { staggerContainer, staggerItem } from "@/components/animations/motion-wrapper";
import { cn } from "@/lib/utils";

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]));

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <TiltCard>
      <GlassCard className="group h-full overflow-hidden !p-0">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          {project.featured && (
            <Badge className="absolute top-4 left-4" variant="default">
              Featured
            </Badge>
          )}
        </div>
        <div className="p-6">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="glass" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="mb-4 space-y-2 text-xs">
            <div>
              <span className="font-medium text-foreground">Problem: </span>
              <span className="text-muted-foreground line-clamp-1">
                {project.businessProblem}
              </span>
            </div>
            <div>
              <span className="font-medium text-foreground">Tools: </span>
              <span className="text-muted-foreground">
                {project.tools.join(", ")}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm" className="flex-1" asChild>
              <Link href={`/projects/${project.slug}`}>View Details</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </GlassCard>
    </TiltCard>
  );
}

export function ProjectsSection() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const allTags = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))],
    []
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
    [search, activeTag]
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
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
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
                    "relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    activeTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
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
            className="grid gap-6 md:grid-cols-2"
          >
            {filtered.map((project) => (
              <motion.div key={project.slug} variants={staggerItem}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No projects match your search.
          </p>
        )}

        <MotionWrapper delay={0.3} className="mt-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </MotionWrapper>
      </div>
    </section>
  );
}
