import { LazyContentItemsAdmin } from "@/components/admin/lazy-editors";
import { getAdminTestimonials } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await getAdminTestimonials();
  return <LazyContentItemsAdmin section="testimonials" initialItems={items} />;
}
