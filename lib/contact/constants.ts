export const CONTACT_JD_STORAGE_PREFIX = "contact/jd";
export const CONTACT_JD_MAX_BYTES = 10 * 1024 * 1024;

export const CONTACT_JD_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const CONTACT_JD_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
