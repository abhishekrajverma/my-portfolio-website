import { unstable_cache } from "next/cache";
import { projects as staticProjects } from "@/data/projects";
import {
  normalizeProject,
  sortProjectSummaries,
  toProjectSummary,
  type ProjectSummary,
} from "@/lib/projects/helpers";
import {
  fetchProjectFromStorage,
  fetchProjectsManifestFromStorage,
  isProjectsStorageConfigured,
} from "@/lib/projects/storage";
import type { Project } from "@/types";

const PROJECTS_CACHE_TAG = "projects";

function getStaticSummaries(): ProjectSummary[] {
  return staticProjects.map(toProjectSummary);
}

const getCachedManifest = unstable_cache(
  async (): Promise<ProjectSummary[]> => {
    if (!isProjectsStorageConfigured()) {
      return sortProjectSummaries(getStaticSummaries());
    }

    try {
      const manifest = await fetchProjectsManifestFromStorage();
      if (manifest.length > 0) {
        return sortProjectSummaries(manifest);
      }
    } catch {
      // Fall back to bundled projects when storage is unavailable.
    }

    return sortProjectSummaries(getStaticSummaries());
  },
  ["projects-manifest"],
  { revalidate: 300, tags: [PROJECTS_CACHE_TAG] }
);

const getCachedProject = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    if (!isProjectsStorageConfigured()) {
      const project = staticProjects.find((item) => item.slug === slug) ?? null;
      return project ? normalizeProject(project) : null;
    }

    try {
      const project = await fetchProjectFromStorage(slug);
      if (project) return normalizeProject(project);
    } catch {
      // Fall back to bundled project when storage is unavailable.
    }

    const project = staticProjects.find((item) => item.slug === slug) ?? null;
    return project ? normalizeProject(project) : null;
  },
  ["project-item"],
  { revalidate: 300, tags: [PROJECTS_CACHE_TAG] }
);

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  return getCachedManifest();
}

export async function getAllProjects(): Promise<Project[]> {
  const summaries = await getProjectSummaries();
  const projects = await Promise.all(
    summaries.map((summary) => getProjectBySlug(summary.slug))
  );

  return projects.filter((project): project is Project => project !== null);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return getCachedProject(slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.featured);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const summaries = await getProjectSummaries();
  return summaries.map((project) => project.slug);
}
