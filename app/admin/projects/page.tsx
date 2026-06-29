import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { AdminProjectActions } from "@/components/admin/admin-project-actions";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { AdminPostsSkeleton } from "@/components/skeletons/admin-posts-skeleton";
import { getAdminProjectSummaries } from "@/lib/projects/admin-repository";

export const dynamic = "force-dynamic";

async function AdminProjectList() {
  const projects = await getAdminProjectSummaries();

  if (projects.length === 0) {
    return (
      <GlassCard className="text-center">
        <p className="mb-4 text-muted-foreground">No projects yet.</p>
        <Button asChild>
          <Link href="/admin/projects/new">Add your first project</Link>
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <GlassCard
          key={project.slug}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex min-w-0 flex-1 gap-4">
            <div className="relative hidden h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-border sm:block">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {project.featured ? <Badge variant="accent">Featured</Badge> : null}
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="glass">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>

          <AdminProjectActions slug={project.slug} title={project.title} />
        </GlassCard>
      ))}
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <AdminShell
      studio="projects"
      title="Your Projects"
      description="Manage portfolio projects stored in Supabase. Changes go live within a few minutes."
      breadcrumb={
        <AdminBreadcrumb
          showBack={false}
          items={[
            { label: "Projects Studio", href: "/admin/projects" },
            { label: "All Projects" },
          ]}
        />
      }
      action={
        <Button size="sm" asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      }
    >
      <Suspense fallback={<AdminPostsSkeleton />}>
        <AdminProjectList />
      </Suspense>
    </AdminShell>
  );
}
