import { LazyContentItemsAdmin } from "@/components/admin/lazy-editors";
import { getAdminFaqs } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const items = await getAdminFaqs();
  return <LazyContentItemsAdmin section="faqs" initialItems={items} />;
}
