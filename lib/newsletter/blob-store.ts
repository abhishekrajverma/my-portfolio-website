import { list, put } from "@vercel/blob";

const BLOB_PATHNAME = "newsletter/subscribers.json";

export function isBlobStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function readSubscribersFromBlob(): Promise<string[]> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });

  if (!blobs.length) {
    return [];
  }

  const response = await fetch(blobs[0].url);
  if (!response.ok) {
    return [];
  }

  const parsed = (await response.json()) as unknown;
  return Array.isArray(parsed)
    ? parsed.filter((item): item is string => typeof item === "string")
    : [];
}

export async function writeSubscribersToBlob(emails: string[]): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(emails), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}
