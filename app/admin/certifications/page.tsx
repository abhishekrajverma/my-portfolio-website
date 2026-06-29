import { LazyContentItemsAdmin } from "@/components/admin/lazy-editors";
import { getAdminCertifications } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const items = await getAdminCertifications();
  return <LazyContentItemsAdmin section="certifications" initialItems={items} />;
}
