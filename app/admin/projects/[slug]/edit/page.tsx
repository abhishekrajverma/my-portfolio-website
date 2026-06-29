import { notFound } from "next/navigation";
import { LazyProjectEditor } from "@/components/admin/lazy-editors";
import { getProjectBySlug } from "@/lib/projects/repository";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <LazyProjectEditor mode="edit" initialProject={project} />;
}
