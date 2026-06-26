import { unstable_cache } from "next/cache";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import {
  filterBlogPostsByCategory,
  getRecommendedFromPosts,
  sortBlogPostsByDate,
  toBlogPostSummary,
  type BlogPostSummary,
} from "@/lib/blog/helpers";
import {
  fetchBlogManifestFromStorage,
  fetchBlogPostFromStorage,
  isBlogStorageConfigured,
} from "@/lib/blog/storage";
import type { BlogPost } from "@/types";

const BLOG_CACHE_TAG = "blog-posts";

function getStaticSummaries(): BlogPostSummary[] {
  return staticBlogPosts.map(toBlogPostSummary);
}

const getCachedManifest = unstable_cache(
  async (): Promise<BlogPostSummary[]> => {
    if (!isBlogStorageConfigured()) {
      return getStaticSummaries();
    }

    try {
      const manifest = await fetchBlogManifestFromStorage();
      if (manifest.length > 0) {
        return sortBlogPostsByDate(manifest);
      }
    } catch {
      // Fall back to bundled posts when storage is unavailable.
    }

    return getStaticSummaries();
  },
  ["blog-manifest"],
  { revalidate: 300, tags: [BLOG_CACHE_TAG] }
);

const getCachedPost = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!isBlogStorageConfigured()) {
      return staticBlogPosts.find((post) => post.slug === slug) ?? null;
    }

    try {
      const post = await fetchBlogPostFromStorage(slug);
      if (post) return post;
    } catch {
      // Fall back to bundled post when storage is unavailable.
    }

    return staticBlogPosts.find((post) => post.slug === slug) ?? null;
  },
  ["blog-post"],
  { revalidate: 300, tags: [BLOG_CACHE_TAG] }
);

export async function getBlogPostSummaries(): Promise<BlogPostSummary[]> {
  return getCachedManifest();
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return getCachedPost(slug);
}

export async function getLatestBlogPost(): Promise<BlogPost | null> {
  const summaries = await getBlogPostSummaries();
  const latest = summaries[0];
  if (!latest) return null;

  return getBlogPostBySlug(latest.slug);
}

export async function getBlogPostsByCategory(
  category: BlogPost["category"] | "All"
): Promise<BlogPostSummary[]> {
  const summaries = await getBlogPostSummaries();
  return filterBlogPostsByCategory(summaries, category);
}

export async function getRecommendedBlogPosts(
  currentSlug: string,
  limit = 3
): Promise<BlogPostSummary[]> {
  const summaries = await getBlogPostSummaries();
  return getRecommendedFromPosts(summaries, currentSlug, limit);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const summaries = await getBlogPostSummaries();
  return summaries.map((post) => post.slug);
}
