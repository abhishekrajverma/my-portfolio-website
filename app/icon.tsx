import { getProfileAvatarUrl } from "@/lib/profile/avatar";

export default async function Icon() {
  const avatarUrl = await getProfileAvatarUrl();

  if (avatarUrl.startsWith("http")) {
    const response = await fetch(avatarUrl, { next: { revalidate: 3600 } });
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new Response(buffer, {
        headers: {
          "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const buffer = await readFile(join(process.cwd(), "public", "my-photo.jpeg"));

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
