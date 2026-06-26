import { revalidatePath, revalidateTag } from "next/cache";
import {
  estimateReadTime,
  sortBlogPostsByDate,
  toBlogPostSummary,
} from "@/lib/blog/helpers";
import {
  deleteBlogPostFromStorage,
  ensureBlogStorageBucket,
  fetchBlogManifestFromStorage,
  fetchBlogPostFromStorage,
  isBlogStorageConfigured,
  uploadBlogManifestToStorage,
  uploadBlogPostToStorage,
} from "@/lib/blog/storage";
import type { BlogPost } from "@/types";

const BLOG_CACHE_TAG = "blog-posts";

function assertBlogStorageReady(): void {
  if (!isBlogStorageConfigured()) {
    throw new Error(
      "Supabase is not configured. Add your Supabase credentials first."
    );
  }
}

export function revalidateBlogCache(): void {
  revalidateTag(BLOG_CACHE_TAG, "max");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

async function saveManifestEntry(post: BlogPost, previousSlug?: string): Promise<void> {
  const manifest = await fetchBlogManifestFromStorage();
  const summary = toBlogPostSummary(post);
  const withoutPrevious = manifest.filter((entry) => {
    if (entry.slug === post.slug) return false;
    if (previousSlug && entry.slug === previousSlug) return false;
    return true;
  });

  await uploadBlogManifestToStorage(sortBlogPostsByDate([summary, ...withoutPrevious]));
}

export async function createBlogPost(post: BlogPost): Promise<BlogPost> {
  assertBlogStorageReady();
  await ensureBlogStorageBucket();

  const existing = await fetchBlogPostFromStorage(post.slug);
  if (existing) {
    throw new Error("A post with this slug already exists.");
  }

  await uploadBlogPostToStorage(post);
  await saveManifestEntry(post);
  revalidateBlogCache();
  return post;
}

export async function updateBlogPost(
  previousSlug: string,
  post: BlogPost
): Promise<BlogPost> {
  assertBlogStorageReady();

  if (previousSlug !== post.slug) {
    const existing = await fetchBlogPostFromStorage(post.slug);
    if (existing) {
      throw new Error("A post with this slug already exists.");
    }

    await deleteBlogPostFromStorage(previousSlug);
  }

  await uploadBlogPostToStorage(post);
  await saveManifestEntry(post, previousSlug);
  revalidateBlogCache();
  return post;
}

export async function removeBlogPost(slug: string): Promise<void> {
  assertBlogStorageReady();

  const manifest = await fetchBlogManifestFromStorage();
  const nextManifest = manifest.filter((entry) => entry.slug !== slug);

  if (nextManifest.length === manifest.length) {
    throw new Error("Blog post not found.");
  }

  await deleteBlogPostFromStorage(slug);
  await uploadBlogManifestToStorage(sortBlogPostsByDate(nextManifest));
  revalidateBlogCache();
}

export function validateBlogPostInput(input: {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  date?: string;
  readTime?: string;
  image?: string;
  content?: string;
}): BlogPost {
  const title = input.title?.trim() ?? "";
  const slug = input.slug?.trim() ?? "";
  const excerpt = input.excerpt?.trim() ?? "";
  const category = input.category?.trim() ?? "";
  const date = input.date?.trim() ?? "";
  const readTime = input.readTime?.trim() ?? "";
  const image = input.image?.trim() ?? "";
  const content = input.content?.trim() ?? "";

  if (!title) throw new Error("Title is required.");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must use lowercase letters, numbers, and hyphens.");
  }
  if (!excerpt) throw new Error("Excerpt is required.");
  if (!content) throw new Error("Content is required.");
  if (!image) throw new Error("Cover image is required.");
  if (!date || Number.isNaN(Date.parse(date))) {
    throw new Error("Publish date is invalid.");
  }

  const allowedCategories = new Set([
    "SQL",
    "Power BI",
    "Excel",
    "Python",
    "Interview",
  ]);

  if (!allowedCategories.has(category)) {
    throw new Error("Please choose a valid category.");
  }

  return {
    slug,
    title,
    excerpt,
    category: category as BlogPost["category"],
    date,
    readTime: readTime || estimateReadTime(content),
    image,
    content,
  };
}
