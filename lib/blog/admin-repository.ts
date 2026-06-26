import { sortBlogPostsByDate } from "@/lib/blog/helpers";
import {
  fetchBlogManifestFromStorage,
  isBlogStorageConfigured,
} from "@/lib/blog/storage";
import { getBlogPostSummaries } from "@/lib/blog/repository";
import type { BlogPostSummary } from "@/lib/blog/helpers";

export async function getAdminBlogPostSummaries(): Promise<BlogPostSummary[]> {
  if (!isBlogStorageConfigured()) {
    return getBlogPostSummaries();
  }

  try {
    const manifest = await fetchBlogManifestFromStorage();
    if (manifest.length > 0) {
      return sortBlogPostsByDate(manifest);
    }
  } catch {
    // Fall back to the shared repository when storage cannot be read.
  }

  return getBlogPostSummaries();
}
