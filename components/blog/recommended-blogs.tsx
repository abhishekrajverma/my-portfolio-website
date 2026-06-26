import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/helpers";
import type { BlogPost } from "@/types";
import { BlogFeedCard } from "@/components/blog/blog-feed-card";
import { Button } from "@/components/ui/button";

interface RecommendedBlogsProps {
  posts: BlogPostSummary[];
  currentCategory: BlogPost["category"];
}

export function RecommendedBlogs({ posts, currentCategory }: RecommendedBlogsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border pt-12">
      <header className="mb-8 text-left">
        <p className="mb-2 text-sm font-medium text-primary">More to read</p>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Recommended stories
        </h2>
        <p className="mt-2 text-muted-foreground">
          More from {currentCategory} and related topics.
        </p>
      </header>

      <div>
        {posts.map((post) => (
          <BlogFeedCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-8">
        <Button variant="outline" asChild>
          <Link href="/blog">Browse all stories</Link>
        </Button>
      </div>
    </section>
  );
}
