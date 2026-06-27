import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PROFILE_AVATAR_LOCAL_SOURCE } from "@/lib/profile/constants";

export async function readFaviconBuffer(): Promise<Buffer> {
  return readFile(join(process.cwd(), "public", PROFILE_AVATAR_LOCAL_SOURCE));
}

export const faviconContentType = "image/jpeg";
