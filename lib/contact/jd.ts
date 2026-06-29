import { ensurePortfolioStorageBucket, getPortfolioStoragePublicUrl } from "@/lib/content/storage";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PORTFOLIO_STORAGE_BUCKET } from "@/lib/content/constants";
import {
  CONTACT_JD_EXTENSIONS,
  CONTACT_JD_MAX_BYTES,
  CONTACT_JD_MIME_TYPES,
  CONTACT_JD_STORAGE_PREFIX,
} from "@/lib/contact/constants";

function sanitizeFileName(fileName: string): string {
  const base = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");
  return base.length > 0 ? base.slice(0, 120) : "job-description";
}

export function isValidContactJdFile(file: File): boolean {
  if (file.size <= 0 || file.size > CONTACT_JD_MAX_BYTES) {
    return false;
  }

  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = CONTACT_JD_EXTENSIONS.some((ext) =>
    lowerName.endsWith(ext)
  );

  return hasAllowedExtension || CONTACT_JD_MIME_TYPES.has(file.type);
}

export function getContactJdValidationError(file: File): string | null {
  if (file.size <= 0) {
    return "The job description file is empty.";
  }

  if (file.size > CONTACT_JD_MAX_BYTES) {
    return "Job description must be smaller than 10 MB.";
  }

  if (!isValidContactJdFile(file)) {
    return "Only PDF or Word files (.pdf, .doc, .docx) are allowed.";
  }

  return null;
}

export async function uploadContactJd(
  file: File
): Promise<{ url: string; fileName: string; storagePath: string }> {
  await ensurePortfolioStorageBucket();

  const safeName = sanitizeFileName(file.name);
  const storagePath = `${CONTACT_JD_STORAGE_PREFIX}/${Date.now()}-${safeName}`;
  const contentType =
    file.type ||
    (safeName.endsWith(".pdf")
      ? "application/pdf"
      : safeName.endsWith(".doc")
        ? "application/msword"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
    .upload(storagePath, file, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    url: getPortfolioStoragePublicUrl(storagePath),
    fileName: file.name,
    storagePath,
  };
}
