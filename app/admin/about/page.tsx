import { LazyAboutContentEditor } from "@/components/admin/lazy-editors";
import { getAdminAboutContent } from "@/lib/content/repository";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [content, avatarUrl] = await Promise.all([
    getAdminAboutContent(),
    getProfileAvatarUrl(),
  ]);

  return (
    <LazyAboutContentEditor initialContent={content} initialAvatarUrl={avatarUrl} />
  );
}
