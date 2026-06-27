import { Suspense } from "react";
import { BlogPostsPage } from "@/components/blog/blog-posts-page";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBlogPostSummaries } from "@/lib/blog/repository";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Data Analytics Blog | SQL, Power BI & Python Tutorials",
  description:
    "Practical data analytics articles on SQL Server, Power BI, MIS reporting, Python, and dashboard design by Abhishek Raj.",
  path: "/blog",
});

export const revalidate = 300;

export default async function BlogPage() {
  const [posts, avatarUrl] = await Promise.all([
    getBlogPostSummaries(),
    getProfileAvatarUrl(),
  ]);

  return (
    <Suspense fallback={<BlogPageFallback />}>
      <BlogPostsPage posts={posts} avatarUrl={avatarUrl} />
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
