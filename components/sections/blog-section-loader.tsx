import { BlogSection } from "@/components/sections/blog";
import { getBlogPostSummaries } from "@/lib/blog/repository";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";

export async function BlogSectionLoader() {
  const [posts, avatarUrl] = await Promise.all([
    getBlogPostSummaries(),
    getProfileAvatarUrl(),
  ]);

  return <BlogSection posts={posts} avatarUrl={avatarUrl} />;
}
