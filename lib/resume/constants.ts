import { PORTFOLIO_STORAGE_BUCKET } from "@/lib/content/constants";

export const RESUME_STORAGE_BUCKET = PORTFOLIO_STORAGE_BUCKET;
export const RESUME_PDF_STORAGE_PATH = "resume/resume.pdf";
export const RESUME_WORD_STORAGE_PATH = "resume/resume.docx";
export const RESUME_FALLBACK_URL = "/resume.html";
export const RESUME_FALLBACK_DOWNLOAD_NAME = "Abhishek_Raj_Resume.html";
export const RESUME_PDF_DOWNLOAD_NAME = "Abhishek_Raj_Resume.pdf";
export const RESUME_WORD_DOWNLOAD_NAME = "Abhishek_Raj_Resume.docx";
export const RESUME_CACHE_TAG = "resume-files";

/** @deprecated Use RESUME_PDF_STORAGE_PATH */
export const RESUME_STORAGE_PATH = RESUME_PDF_STORAGE_PATH;
