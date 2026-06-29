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

  return getResumePdfPublicUrl();
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

  return getResumeWordPublicUrl();
}
