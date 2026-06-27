import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminPostsSkeleton } from "@/components/skeletons/admin-posts-skeleton";

export default function AdminBlogLoading() {
  return (
    <AdminShell
      title="Your Posts"
      description="Manage published articles stored in Supabase. Changes go live within a few minutes."
      breadcrumb={
        <AdminBreadcrumb
          showBack={false}
          items={[
            { label: "Blog Studio", href: "/admin/blog" },
            { label: "All Posts" },
          ]}
        />
      }
    >
      <AdminPostsSkeleton />
    </AdminShell>
  );
}
