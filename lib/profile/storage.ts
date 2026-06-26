import { ensureBlogStorageBucket, getBlogStoragePublicUrl } from "@/lib/blog/storage";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  PROFILE_AVATAR_STORAGE_PATH,
  PROFILE_STORAGE_BUCKET,
} from "@/lib/profile/constants";

export function isProfileStorageConfigured(): boolean {
  return isSupabaseConfigured();
}

export function getProfileAvatarPublicUrl(): string {
  return getBlogStoragePublicUrl(PROFILE_AVATAR_STORAGE_PATH);
}

export async function profileAvatarExistsInStorage(): Promise<boolean> {
  if (!isProfileStorageConfigured()) return false;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(PROFILE_STORAGE_BUCKET)
    .download(PROFILE_AVATAR_STORAGE_PATH);

  if (error || !data) return false;

  return data.size > 0;
}

export async function uploadProfileAvatar(
  file: Blob,
  contentType = "image/jpeg"
): Promise<string> {
  await ensureBlogStorageBucket();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(PROFILE_STORAGE_BUCKET)
    .upload(PROFILE_AVATAR_STORAGE_PATH, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getProfileAvatarPublicUrl();
}
