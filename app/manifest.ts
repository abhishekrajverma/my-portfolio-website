import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const avatarUrl = await getProfileAvatarUrl();
  const shortName = siteConfig.name.split(" ")[0];

  return {
    name: siteConfig.name,
    short_name: shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#3b82f6",
    icons: [
      {
        src: avatarUrl,
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: avatarUrl,
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
