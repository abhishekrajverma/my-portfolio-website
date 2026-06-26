import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  BLOG_MANIFEST_PATH,
  BLOG_POSTS_PREFIX,
  BLOG_STORAGE_BUCKET,
} from "@/lib/blog/constants";
import type { BlogPost } from "@/types";
import type { BlogPostSummary } from "@/lib/blog/helpers";

export function isBlogStorageConfigured(): boolean {
  return isSupabaseConfigured();
}

export function getBlogStoragePublicUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return `${baseUrl}/storage/v1/object/public/${BLOG_STORAGE_BUCKET}/${path}`;
}

function getPostStoragePath(slug: string): string {
  return `${BLOG_POSTS_PREFIX}/${slug}.json`;
}

async function downloadJson<T>(path: string): Promise<T | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(BLOG_STORAGE_BUCKET)
    .download(path);

  if (error) {
    if (error.message.toLowerCase().includes("not found")) {
      return null;
    }

    throw new Error(error.message);
  }

  const text = await data.text();
  return JSON.parse(text) as T;
}

export async function fetchBlogManifestFromStorage(): Promise<BlogPostSummary[]> {
  const manifest = await downloadJson<BlogPostSummary[]>(BLOG_MANIFEST_PATH);
  return manifest ?? [];
}

export async function fetchBlogPostFromStorage(
  slug: string
): Promise<BlogPost | null> {
  return downloadJson<BlogPost>(getPostStoragePath(slug));
}

export async function ensureBlogStorageBucket(): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const exists = buckets.some((bucket) => bucket.id === BLOG_STORAGE_BUCKET);
  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(
    BLOG_STORAGE_BUCKET,
    {
      public: true,
    }
  );

  if (createError) {
    throw new Error(createError.message);
  }
}

export async function uploadBlogManifestToStorage(
  manifest: BlogPostSummary[]
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = JSON.stringify(manifest, null, 2);

  const { error } = await supabase.storage
    .from(BLOG_STORAGE_BUCKET)
    .upload(BLOG_MANIFEST_PATH, body, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadBlogPostToStorage(post: BlogPost): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = JSON.stringify(post, null, 2);

  const { error } = await supabase.storage
    .from(BLOG_STORAGE_BUCKET)
    .upload(getPostStoragePath(post.slug), body, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteBlogPostFromStorage(slug: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(BLOG_STORAGE_BUCKET)
    .remove([getPostStoragePath(slug)]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadBlogImage(
  fileName: string,
  file: Blob,
  contentType: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const path = `images/${fileName}`;

  const { error } = await supabase.storage
    .from(BLOG_STORAGE_BUCKET)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getBlogStoragePublicUrl(path);
}
