import type {
  DataCleaningStep,
  DataCleaningTool,
  PowerBIDashboard,
  PowerBIDashboardStep,
  PowerBIChartType,
} from "@/types";
import { DATA_CLEANING_TOOLS, POWER_BI_CHART_TYPES } from "@/lib/projects/constants";
import type { Project } from "@/types";

export type ProjectSummary = Pick<
  Project,
  "slug" | "title" | "description" | "image" | "tags" | "featured"
>;

export function toProjectSummary(project: Project): ProjectSummary {
  return {
    slug: project.slug,
    title: project.title,
    description: project.description,
    image: project.image,
    tags: project.tags,
    featured: project.featured,
  };
}

export function sortProjectSummaries(summaries: ProjectSummary[]): ProjectSummary[] {
  return [...summaries].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return a.title.localeCompare(b.title);
  });
}

export function slugifyProjectTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCommaSeparatedList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function emptyDataCleaningStep(): DataCleaningStep {
  return {
    description: "",
    tool: "Power Query",
    toolDetail: "",
    image: "",
  };
}

export function normalizeDataCleaningSteps(value: unknown): DataCleaningStep[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        const description = item.trim();
        if (!description) return null;
        return {
          description,
          tool: "Other" as DataCleaningTool,
          image: "",
        };
      }

      if (!item || typeof item !== "object") return null;

      const entry = item as Partial<DataCleaningStep>;
      const description = entry.description?.trim() ?? "";
      if (!description) return null;

      const tool = DATA_CLEANING_TOOLS.includes(entry.tool as DataCleaningTool)
        ? (entry.tool as DataCleaningTool)
        : "Other";

      const toolDetail = entry.toolDetail?.trim();
      const image = entry.image?.trim() ?? "";

      return {
        description,
        tool,
        ...(toolDetail ? { toolDetail } : {}),
        ...(image ? { image } : {}),
      };
    })
    .filter((item): item is DataCleaningStep => item !== null);
}

export function normalizeProject(project: Project): Project {
  return {
    ...project,
    dataCleaning: normalizeDataCleaningSteps(project.dataCleaning),
    powerBIDashboard: normalizePowerBIDashboard(project.powerBIDashboard),
  };
}

export function emptyPowerBIDashboardStep(): PowerBIDashboardStep {
  return {
    title: "",
    description: "",
    image: "",
  };
}

export function emptyPowerBIDashboard(): PowerBIDashboard {
  return {
    summary: "",
    charts: [],
    steps: [],
  };
}

export function normalizePowerBIDashboard(value: unknown): PowerBIDashboard {
  if (typeof value === "string") {
    const summary = value.trim();
    return {
      ...(summary ? { summary } : {}),
      charts: [],
      steps: [],
    };
  }

  if (!value || typeof value !== "object") {
    return emptyPowerBIDashboard();
  }

  const entry = value as Partial<PowerBIDashboard>;
  const summary = entry.summary?.trim() ?? "";
  const charts = Array.isArray(entry.charts)
    ? entry.charts
        .map((chart) =>
          POWER_BI_CHART_TYPES.includes(chart as PowerBIChartType)
            ? (chart as PowerBIChartType)
            : null
        )
        .filter((chart): chart is PowerBIChartType => chart !== null)
    : [];

  const steps = Array.isArray(entry.steps)
    ? entry.steps.map((step) => {
        if (!step || typeof step !== "object") {
          return emptyPowerBIDashboardStep();
        }

        const item = step as Partial<PowerBIDashboardStep>;
        return {
          title: item.title?.trim() ?? "",
          description: item.description?.trim() ?? "",
          image: item.image?.trim() ?? "",
        };
      })
    : [];

  return {
    ...(summary ? { summary } : {}),
    charts,
    steps,
  };
}

export function sanitizePowerBIDashboardForSave(
  dashboard: PowerBIDashboard
): PowerBIDashboard {
  const normalized = normalizePowerBIDashboard(dashboard);

  return {
    ...(normalized.summary ? { summary: normalized.summary } : {}),
    charts: normalized.charts,
    steps: normalized.steps
      .map((step) => ({
        title: step.title.trim(),
        description: step.description.trim(),
        image: step.image?.trim() || undefined,
      }))
      .filter((step) => step.title || step.description)
      .map((step) => ({
        title: step.title || "Dashboard step",
        description: step.description,
        ...(step.image ? { image: step.image } : {}),
      })),
  };
}
