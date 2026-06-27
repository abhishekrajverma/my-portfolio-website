import {
  faviconContentType,
  readFaviconBuffer,
} from "@/lib/profile/favicon";

export default async function AppleIcon() {
  const buffer = await readFaviconBuffer();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": faviconContentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
