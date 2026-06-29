import { revalidatePath, revalidateTag } from "next/cache";
import {
  sortProjectSummaries,
  toProjectSummary,
} from "@/lib/projects/helpers";
import {
  deleteProjectFromStorage,
  ensureProjectsStorageBucket,
  fetchProjectFromStorage,
  fetchProjectsManifestFromStorage,
  isProjectsStorageConfigured,
  uploadProjectToStorage,
  uploadProjectsManifestToStorage,
} from "@/lib/projects/storage";
import type { Project } from "@/types";
import { normalizeDataCleaningSteps, normalizePowerBIDashboard, sanitizePowerBIDashboardForSave } from "@/lib/projects/helpers";

const PROJECTS_CACHE_TAG = "projects";

function assertProjectsStorageReady(): void {
  if (!isProjectsStorageConfigured()) {
    throw new Error(
      "Supabase is not configured. Add your Supabase credentials first."
    );
  }
}

export function revalidateProjectsCache(): void {
  revalidateTag(PROJECTS_CACHE_TAG, "max");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

async function saveManifestEntry(
  project: Project,
  previousSlug?: string
): Promise<void> {
  const manifest = await fetchProjectsManifestFromStorage();
  const summary = toProjectSummary(project);
  const withoutPrevious = manifest.filter((entry) => {
    if (entry.slug === project.slug) return false;
    if (previousSlug && entry.slug === previousSlug) return false;
    return true;
  });

  await uploadProjectsManifestToStorage(
    sortProjectSummaries([summary, ...withoutPrevious])
  );
}

export async function createProject(project: Project): Promise<Project> {
  assertProjectsStorageReady();
  await ensureProjectsStorageBucket();

  const existing = await fetchProjectFromStorage(project.slug);
  if (existing) {
    throw new Error("A project with this slug already exists.");
  }

  await uploadProjectToStorage(project);
  await saveManifestEntry(project);
  revalidateProjectsCache();
  return project;
}

export async function updateProject(
  previousSlug: string,
  project: Project
): Promise<Project> {
  assertProjectsStorageReady();

  if (previousSlug !== project.slug) {
    const existing = await fetchProjectFromStorage(project.slug);
    if (existing) {
      throw new Error("A project with this slug already exists.");
    }

    await deleteProjectFromStorage(previousSlug);
  }

  await uploadProjectToStorage(project);
  await saveManifestEntry(project, previousSlug);
  revalidateProjectsCache();
  return project;
}

export async function removeProject(slug: string): Promise<void> {
  assertProjectsStorageReady();

  const manifest = await fetchProjectsManifestFromStorage();
  const nextManifest = manifest.filter((entry) => entry.slug !== slug);

  if (nextManifest.length === manifest.length) {
    throw new Error("Project not found.");
  }

  await deleteProjectFromStorage(slug);
  await uploadProjectsManifestToStorage(sortProjectSummaries(nextManifest));
  revalidateProjectsCache();
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function asSqlQueries(
  value: unknown
): { title: string; query: string }[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const entry = item as { title?: string; query?: string };
      const title = entry.title?.trim() ?? "";
      const query = entry.query?.trim() ?? "";
      if (!title || !query) return null;
      return { title, query };
    })
    .filter((item): item is { title: string; query: string } => item !== null);
}

export function validateProjectInput(input: Partial<Project>): Project {
  const slug = input.slug?.trim() ?? "";
  const title = input.title?.trim() ?? "";
  const description = input.description?.trim() ?? "";
  const image = input.image?.trim() ?? "";
  const businessProblem = input.businessProblem?.trim() ?? "";
  const dataset = input.dataset?.trim() ?? "";
  const overview = input.overview?.trim() ?? "";
  const problemStatement = input.problemStatement?.trim() ?? "";
  const githubUrl = input.githubUrl?.trim() ?? "";
  const liveUrl = input.liveUrl?.trim() ?? "";

  if (!title) throw new Error("Title is required.");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must use lowercase letters, numbers, and hyphens.");
  }
  if (!description) throw new Error("Short description is required.");
  if (!image) throw new Error("Cover image is required.");
  if (!overview) throw new Error("Overview is required.");
  if (!problemStatement) throw new Error("Problem statement is required.");

  return {
    slug,
    title,
    description,
    image,
    businessProblem,
    dataset,
    tools: asStringArray(input.tools),
    keyInsights: asStringArray(input.keyInsights),
    tags: asStringArray(input.tags),
    githubUrl,
    liveUrl,
    featured: Boolean(input.featured),
    overview,
    problemStatement,
    dataCleaning: normalizeDataCleaningSteps(input.dataCleaning),
    sqlQueries: asSqlQueries(input.sqlQueries),
    pythonAnalysis: asStringArray(input.pythonAnalysis),
    powerBIDashboard: sanitizePowerBIDashboardForSave(
      normalizePowerBIDashboard(input.powerBIDashboard)
    ),
    businessInsights: asStringArray(input.businessInsights),
    recommendations: asStringArray(input.recommendations),
    screenshots: asStringArray(input.screenshots),
    technologies: asStringArray(input.technologies),
  };
}
