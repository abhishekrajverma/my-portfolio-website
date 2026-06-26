import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/blog-editor";
import { getBlogPostBySlug } from "@/lib/blog/repository";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogEditor mode="edit" initialPost={post} />;
}
