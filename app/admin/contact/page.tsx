import { LazyContactContentEditor } from "@/components/admin/lazy-editors";
import { getAdminContactContent } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const content = await getAdminContactContent();
  return <LazyContactContentEditor initialContent={content} />;
}
