"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Table,
  BarChart3,
  Code2,
  Layers,
  Calculator,
  LineChart,
  PieChart,
  Sigma,
  Filter,
  Workflow,
  FunctionSquare,
  GitBranch,
  LayoutDashboard,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { skills, skillCategories } from "@/data/skills";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
import { staggerContainer, staggerItem } from "@/components/animations/motion-wrapper";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  database: Database,
  table: Table,
  "bar-chart-3": BarChart3,
  "code-2": Code2,
  layers: Layers,
  calculator: Calculator,
  "line-chart": LineChart,
  "pie-chart": PieChart,
  sigma: Sigma,
  filter: Filter,
  workflow: Workflow,
  "function-square": FunctionSquare,
  "git-branch": GitBranch,
  "layout-dashboard": LayoutDashboard,
  "trending-up": TrendingUp,
};

function SkillCard({ skill }: { skill: (typeof skills)[0] }) {
  const [hovered, setHovered] = useState(false);
  const Icon = iconMap[skill.icon] || Database;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <GlassCard className="group relative h-full overflow-hidden">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="glass" className="text-xs">
              {skill.category}
            </Badge>
          </div>
          <h3 className="mb-1 font-semibold">{skill.name}</h3>
          <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">
            {skill.description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Proficiency</span>
              <span className="font-medium text-primary">{skill.level}%</span>
            </div>
            <Progress
              value={skill.level}
              className={cn("h-1.5 transition-opacity", hovered && "opacity-100")}
              aria-label={`${skill.name} proficiency ${skill.level}%`}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="section-padding bg-muted/10">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="Skills"
            title="Technical Expertise"
            description="A comprehensive toolkit for data extraction, transformation, analysis, and visualization."
          />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {skillCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "glass text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </MotionWrapper>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          Showing {filteredSkills.length} skill
          {filteredSkills.length === 1 ? "" : "s"}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredSkills.map((skill) => (
              <motion.div key={skill.id} variants={staggerItem}>
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredSkills.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No skills found in this category.
          </p>
        )}
      </div>
    </section>
  );
}
