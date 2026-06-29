import { sortProjectSummaries } from "@/lib/projects/helpers";
import {
  fetchProjectsManifestFromStorage,
  isProjectsStorageConfigured,
} from "@/lib/projects/storage";
import { getProjectSummaries } from "@/lib/projects/repository";
import type { ProjectSummary } from "@/lib/projects/helpers";

export async function getAdminProjectSummaries(): Promise<ProjectSummary[]> {
  if (!isProjectsStorageConfigured()) {
    return getProjectSummaries();
  }

  try {
    const manifest = await fetchProjectsManifestFromStorage();
    if (manifest.length > 0) {
      return sortProjectSummaries(manifest);
    }
  } catch {
    // Fall back to the shared repository when storage cannot be read.
  }

  return getProjectSummaries();
}
