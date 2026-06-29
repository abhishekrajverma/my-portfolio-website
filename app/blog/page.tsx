import { Suspense } from "react";
import { BlogPostsPage } from "@/components/blog/blog-posts-page";
import { BlogListSkeleton } from "@/components/skeletons/blog-list-skeleton";
import { getBlogPostSummaries } from "@/lib/blog/repository";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Tech Blog | Tutorials, Tools & Build Notes",
  description:
    "Articles on development, dev tools, software engineering, and hands-on tech — written for builders who learn by doing.",
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
