import { unstable_cache } from "next/cache";
import { PROFILE_AVATAR_FALLBACK } from "@/lib/profile/constants";
import {
  getProfileAvatarPublicUrl,
  isProfileStorageConfigured,
  profileAvatarExistsInStorage,
} from "@/lib/profile/storage";

async function resolveProfileAvatarUrl(): Promise<string> {
  if (!isProfileStorageConfigured()) {
    return PROFILE_AVATAR_FALLBACK;
  }

  try {
    const exists = await profileAvatarExistsInStorage();
    if (!exists) {
      return PROFILE_AVATAR_FALLBACK;
    }

    return getProfileAvatarPublicUrl();
  } catch {
    return PROFILE_AVATAR_FALLBACK;
  }
}

export const getProfileAvatarUrl = unstable_cache(
  resolveProfileAvatarUrl,
  ["profile-avatar-url"],
  { revalidate: 3600, tags: ["profile-avatar"] }
);
