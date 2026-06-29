import { ensurePortfolioStorageBucket, getPortfolioStoragePublicUrl } from "@/lib/content/storage";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  RESUME_PDF_STORAGE_PATH,
  RESUME_STORAGE_BUCKET,
  RESUME_WORD_STORAGE_PATH,
} from "@/lib/resume/constants";

export function isResumeStorageConfigured(): boolean {
  return isSupabaseConfigured();
}

export function getResumePdfPublicUrl(): string {
  return getPortfolioStoragePublicUrl(RESUME_PDF_STORAGE_PATH);
}

export function getResumeWordPublicUrl(): string {
  return getPortfolioStoragePublicUrl(RESUME_WORD_STORAGE_PATH);
}

function appendStorageCacheBuster(url: string, version: string | number): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
}

async function getStorageFileVersion(path: string): Promise<number | null> {
  if (!isResumeStorageConfigured()) return null;

  const lastSlash = path.lastIndexOf("/");
  const folder = lastSlash >= 0 ? path.slice(0, lastSlash) : "";
  const fileName = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(RESUME_STORAGE_BUCKET)
    .list(folder, { search: fileName, limit: 1 });

  if (error || !data?.length) return null;

  const file = data.find((entry) => entry.name === fileName) ?? data[0];
  const timestamp = file.updated_at ?? file.created_at;
  if (!timestamp) return null;

  return new Date(timestamp).getTime();
}

export async function getVersionedResumePdfPublicUrl(): Promise<string> {
  const baseUrl = getResumePdfPublicUrl();
  const version = await getStorageFileVersion(RESUME_PDF_STORAGE_PATH);
  return version ? appendStorageCacheBuster(baseUrl, version) : baseUrl;
}

export async function getVersionedResumeWordPublicUrl(): Promise<string> {
  const baseUrl = getResumeWordPublicUrl();
  const version = await getStorageFileVersion(RESUME_WORD_STORAGE_PATH);
  return version ? appendStorageCacheBuster(baseUrl, version) : baseUrl;
}

async function resumeFileExistsInStorage(path: string): Promise<boolean> {
  if (!isResumeStorageConfigured()) return false;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(RESUME_STORAGE_BUCKET)
    .download(path);

  if (error || !data) return false;

  return data.size > 0;
}

export async function resumePdfExistsInStorage(): Promise<boolean> {
  return resumeFileExistsInStorage(RESUME_PDF_STORAGE_PATH);
}

export async function resumeWordExistsInStorage(): Promise<boolean> {
  return resumeFileExistsInStorage(RESUME_WORD_STORAGE_PATH);
}

export async function uploadResumePdf(
  file: Blob,
  contentType = "application/pdf"
): Promise<string> {
  await ensurePortfolioStorageBucket();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(RESUME_STORAGE_BUCKET)
    .upload(RESUME_PDF_STORAGE_PATH, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getVersionedResumePdfPublicUrl();
}

export async function uploadResumeWord(
  file: Blob,
  contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
): Promise<string> {
  await ensurePortfolioStorageBucket();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(RESUME_STORAGE_BUCKET)
    .upload(RESUME_WORD_STORAGE_PATH, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getVersionedResumeWordPublicUrl();
}
