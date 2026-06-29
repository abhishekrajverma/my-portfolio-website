"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  isBlogCategory,
  type BlogCategoryFilter,
} from "@/constants/blog";
import { filterBlogPostsByCategory } from "@/lib/blog/helpers";
import type { BlogPostSummary } from "@/lib/blog/helpers";
import { BlogCategoryFilterBar } from "@/components/blog/blog-category-filter";
import { BlogFeedCard } from "@/components/blog/blog-feed-card";
import { Button } from "@/components/ui/button";

interface BlogPostsPageProps {
  posts: BlogPostSummary[];
  avatarUrl: string;
}

export function BlogPostsPage({ posts, avatarUrl }: BlogPostsPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryParam = searchParams.get("category");
  const activeCategory: BlogCategoryFilter = isBlogCategory(categoryParam)
    ? categoryParam
    : "All";

  const filtered = useMemo(
    () => filterBlogPostsByCategory(posts, activeCategory),
    [activeCategory, posts]
  );

  const setCategory = useCallback(
    (category: BlogCategoryFilter) => {
      const params = new URLSearchParams(searchParams.toString());

      if (category === "All") {
        params.delete("category");
      } else {
        params.set("category", category);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="section-padding pt-28">
      <div className="blog-feed-column px-4 sm:px-0">
        <header className="mb-8 border-b border-border pb-8 text-left">
          <p className="mb-3 text-sm font-medium text-primary">Tech Blog</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Build Logs & Sharp Takes
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Tutorials, tool breakdowns, and honest lessons from across tech — dev,
            systems, workflows, and whatever I&apos;m exploring next.
          </p>
        </header>

        <BlogCategoryFilterBar
          activeCategory={activeCategory}
          onCategoryChange={setCategory}
          className="mb-4"
        />

        <p className="mb-2 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "story" : "stories"}
        </p>

        <div key={activeCategory}>
          {filtered.map((post, index) => (
            <BlogFeedCard key={post.slug} post={post} avatarUrl={avatarUrl} featured={index === 0} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-left text-muted-foreground">
            No articles found in this category.
          </p>
        ) : null}

        <div className="mt-12 border-t border-border pt-8">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
