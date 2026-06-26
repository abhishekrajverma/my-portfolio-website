import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPostActions } from "@/components/admin/admin-post-actions";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { getAdminBlogPostSummaries } from "@/lib/blog/admin-repository";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPostSummaries();

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
      action={
        <Button size="sm" asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      }
    >
      {posts.length === 0 ? (
        <GlassCard className="text-center">
          <p className="mb-4 text-muted-foreground">No posts yet.</p>
          <Button asChild>
            <Link href="/admin/blog/new">Write your first post</Link>
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <GlassCard
              key={post.slug}
              className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.date)} · {post.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              <AdminPostActions slug={post.slug} title={post.title} />
            </GlassCard>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
