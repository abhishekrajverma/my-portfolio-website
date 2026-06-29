import { unstable_cache } from "next/cache";
import {
  RESUME_CACHE_TAG,
  RESUME_FALLBACK_DOWNLOAD_NAME,
  RESUME_FALLBACK_URL,
  RESUME_PDF_DOWNLOAD_NAME,
  RESUME_WORD_DOWNLOAD_NAME,
} from "@/lib/resume/constants";
import {
  getVersionedResumePdfPublicUrl,
  getVersionedResumeWordPublicUrl,
  resumePdfExistsInStorage,
  resumeWordExistsInStorage,
} from "@/lib/resume/storage";

export type ResumeSource = "pdf" | "html";

export interface ResumeDownloadInfo {
  url: string;
  downloadName: string;
  source: ResumeSource;
}

export interface ResumeWordInfo {
  url: string;
  downloadName: string;
}

export interface ResumeAssets {
  download: ResumeDownloadInfo;
  word: ResumeWordInfo | null;
}

async function resolveResumeWordInfo(): Promise<ResumeWordInfo | null> {
  if (!(await resumeWordExistsInStorage())) {
    return null;
  }

  return {
    url: await getVersionedResumeWordPublicUrl(),
    downloadName: RESUME_WORD_DOWNLOAD_NAME,
  };
}

async function resolveResumeDownloadInfo(): Promise<ResumeDownloadInfo> {
  if (await resumePdfExistsInStorage()) {
    return {
      url: await getVersionedResumePdfPublicUrl(),
      downloadName: RESUME_PDF_DOWNLOAD_NAME,
      source: "pdf",
    };
  }

  return {
    url: RESUME_FALLBACK_URL,
    downloadName: RESUME_FALLBACK_DOWNLOAD_NAME,
    source: "html",
  };
}

async function resolveResumeAssets(): Promise<ResumeAssets> {
  const [download, word] = await Promise.all([
    resolveResumeDownloadInfo(),
    resolveResumeWordInfo(),
  ]);

  return { download, word };
}

const getCachedResumeAssets = unstable_cache(
  resolveResumeAssets,
  ["resume-assets"],
  { revalidate: 300, tags: [RESUME_CACHE_TAG] }
);

export async function getResumeAssets(): Promise<ResumeAssets> {
  return getCachedResumeAssets();
}

export async function getAdminResumeAssets(): Promise<ResumeAssets> {
  return resolveResumeAssets();
}

export async function getResumeDownloadInfo(): Promise<ResumeDownloadInfo> {
  const assets = await getResumeAssets();
  return assets.download;
}

export async function getAdminResumeDownloadInfo(): Promise<ResumeDownloadInfo> {
  const assets = await getAdminResumeAssets();
  return assets.download;
}
