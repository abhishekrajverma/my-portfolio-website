import { Suspense } from "react";
import { BlogPostsPage } from "@/components/blog/blog-posts-page";
import { BlogListSkeleton } from "@/components/skeletons/blog-list-skeleton";
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

async function BlogPageContent() {
  const [posts, avatarUrl] = await Promise.all([
    getBlogPostSummaries(),
    getProfileAvatarUrl(),
  ]);

  return <BlogPostsPage posts={posts} avatarUrl={avatarUrl} />;
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogListSkeleton />}>
      <BlogPageContent />
    </Suspense>
  );
}
