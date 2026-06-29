import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PORTFOLIO_STORAGE_BUCKET } from "@/lib/content/constants";

export function isPortfolioStorageConfigured(): boolean {
  return isSupabaseConfigured();
}

async function downloadJson<T>(path: string): Promise<T | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
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

export async function fetchContentFromStorage<T>(path: string): Promise<T | null> {
  return downloadJson<T>(path);
}

export async function ensurePortfolioStorageBucket(): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const exists = buckets.some((bucket) => bucket.id === PORTFOLIO_STORAGE_BUCKET);
  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(
    PORTFOLIO_STORAGE_BUCKET,
    { public: true }
  );

  if (createError) {
    throw new Error(createError.message);
  }
}

export async function uploadContentToStorage<T>(path: string, data: T): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = JSON.stringify(data, null, 2);

  const { error } = await supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
    .upload(path, body, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export function getPortfolioStoragePublicUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return `${baseUrl}/storage/v1/object/public/${PORTFOLIO_STORAGE_BUCKET}/${path}`;
}

export async function uploadPortfolioImage(
  fileName: string,
  file: Blob,
  contentType: string
): Promise<string> {
  await ensurePortfolioStorageBucket();

  const supabase = getSupabaseAdmin();
  const path = `images/${fileName}`;

  const { error } = await supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getPortfolioStoragePublicUrl(path);
}
