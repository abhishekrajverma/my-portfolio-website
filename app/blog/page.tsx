import { Suspense } from "react";
import { BlogPostsPage } from "@/components/blog/blog-posts-page";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBlogPostSummaries } from "@/lib/blog/repository";

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getBlogPostSummaries();

  return (
    <Suspense fallback={<BlogPageFallback />}>
      <BlogPostsPage posts={posts} />
    </Suspense>
  );
}

function BlogPageFallback() {
  return (
    <div className="section-padding pt-28">
      <div className="container-custom">
        <SectionHeading
          label="Blog"
          title="All Articles"
          description="Data analytics tutorials, career tips, and technical deep-dives."
        />
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    </div>
  );
}
