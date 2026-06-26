import type { BlogPost } from "@/types";

export type BlogPostSummary = Omit<BlogPost, "content">;

export function toBlogPostSummary(post: BlogPost): BlogPostSummary {
  const { content: _content, ...summary } = post;
  return summary;
}

export function sortBlogPostsByDate(posts: BlogPostSummary[]): BlogPostSummary[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function filterBlogPostsByCategory(
  posts: BlogPostSummary[],
  category: BlogPost["category"] | "All"
): BlogPostSummary[] {
  if (category === "All") return posts;
  return posts.filter((post) => post.category === category);
}

export function getRecommendedFromPosts(
  posts: BlogPostSummary[],
  currentSlug: string,
  limit = 3
): BlogPostSummary[] {
  const current = posts.find((post) => post.slug === currentSlug);
  const others = posts.filter((post) => post.slug !== currentSlug);

  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter((post) => post.category === current.category);
  const otherCategories = others.filter(
    (post) => post.category !== current.category
  );

  return [...sameCategory, ...otherCategories].slice(0, limit);
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
