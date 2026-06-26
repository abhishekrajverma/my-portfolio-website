import { readFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { profile } from "@/data/profile";
import {
  PROFILE_AVATAR_FALLBACK,
  PROFILE_AVATAR_LOCAL_SOURCE,
} from "@/lib/profile/constants";
import { uploadProfileAvatar } from "@/lib/profile/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";

async function main() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local."
    );
  }

  const publicDir = path.join(process.cwd(), "public");
  const sourcePath = path.join(publicDir, PROFILE_AVATAR_LOCAL_SOURCE);
  const fallbackPath = path.join(publicDir, PROFILE_AVATAR_FALLBACK.replace(/^\//, ""));

  console.log(`Reading profile photo from ${PROFILE_AVATAR_LOCAL_SOURCE}...`);
  const fileBuffer = await readFile(sourcePath);

  await copyFile(sourcePath, fallbackPath);
  console.log(`  ✓ Updated local fallback ${PROFILE_AVATAR_FALLBACK}`);

  const publicUrl = await uploadProfileAvatar(
    new Blob([new Uint8Array(fileBuffer)], { type: "image/jpeg" }),
    "image/jpeg"
  );

  console.log(`  ✓ Uploaded profile avatar for ${profile.name}`);
  console.log(`  ✓ Supabase URL: ${publicUrl}`);
  console.log("\nProfile storage seed complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
