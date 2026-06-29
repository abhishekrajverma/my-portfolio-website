import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  PROJECTS_ITEMS_PREFIX,
  PROJECTS_MANIFEST_PATH,
  PROJECTS_STORAGE_BUCKET,
} from "@/lib/projects/constants";
import type { Project } from "@/types";
import type { ProjectSummary } from "@/lib/projects/helpers";

export function isProjectsStorageConfigured(): boolean {
  return isSupabaseConfigured();
}

export function getProjectsStoragePublicUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return `${baseUrl}/storage/v1/object/public/${PROJECTS_STORAGE_BUCKET}/${path}`;
}

function getProjectStoragePath(slug: string): string {
  return `${PROJECTS_ITEMS_PREFIX}/${slug}.json`;
}

async function downloadJson<T>(path: string): Promise<T | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(PROJECTS_STORAGE_BUCKET)
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

export async function fetchProjectsManifestFromStorage(): Promise<ProjectSummary[]> {
  const manifest = await downloadJson<ProjectSummary[]>(PROJECTS_MANIFEST_PATH);
  return manifest ?? [];
}

export async function fetchProjectFromStorage(
  slug: string
): Promise<Project | null> {
  return downloadJson<Project>(getProjectStoragePath(slug));
}

export async function ensureProjectsStorageBucket(): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const exists = buckets.some((bucket) => bucket.id === PROJECTS_STORAGE_BUCKET);
  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(
    PROJECTS_STORAGE_BUCKET,
    {
      public: true,
    }
  );

  if (createError) {
    throw new Error(createError.message);
  }
}

export async function uploadProjectsManifestToStorage(
  manifest: ProjectSummary[]
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = JSON.stringify(manifest, null, 2);

  const { error } = await supabase.storage
    .from(PROJECTS_STORAGE_BUCKET)
    .upload(PROJECTS_MANIFEST_PATH, body, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadProjectToStorage(project: Project): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = JSON.stringify(project, null, 2);

  const { error } = await supabase.storage
    .from(PROJECTS_STORAGE_BUCKET)
    .upload(getProjectStoragePath(project.slug), body, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteProjectFromStorage(slug: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(PROJECTS_STORAGE_BUCKET)
    .remove([getProjectStoragePath(slug)]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadProjectImage(
  fileName: string,
  file: Blob,
  contentType: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const path = `images/${fileName}`;

  const { error } = await supabase.storage
    .from(PROJECTS_STORAGE_BUCKET)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getProjectsStoragePublicUrl(path);
}
