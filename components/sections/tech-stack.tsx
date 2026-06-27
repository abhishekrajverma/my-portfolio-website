import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import {
  GenAiIcon,
  PowerBiIcon,
  PythonIcon,
  SqlServerIcon,
} from "@/components/icons/tech-stack-icons";
import { cn } from "@/lib/utils";

const techIcons: Record<(typeof profile.techStack)[number], ReactNode> = {
  "SQL Server": <SqlServerIcon />,
  "Power BI": <PowerBiIcon />,
  Python: <PythonIcon />,
  GenAI: <GenAiIcon />,
};

export function TechStack() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Tech Stack</p>
      <div className="flex flex-wrap gap-3">
        {profile.techStack.map((tech) => (
          <div
            key={tech}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3",
              "transition-colors hover:border-primary/30 hover:bg-card"
            )}
          >
            {techIcons[tech]}
            <span className="whitespace-nowrap text-sm font-medium text-foreground">
              {tech}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
