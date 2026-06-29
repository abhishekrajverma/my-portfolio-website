import { LazyContentItemsAdmin } from "@/components/admin/lazy-editors";
import { getAdminSkills } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const items = await getAdminSkills();
  return <LazyContentItemsAdmin section="skills" initialItems={items} />;
}
