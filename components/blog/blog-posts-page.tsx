"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";
import {
  isBlogCategory,
  type BlogCategoryFilter,
} from "@/constants/blog";
import { filterBlogPostsByCategory } from "@/lib/blog/helpers";
import type { BlogPostSummary } from "@/lib/blog/helpers";
import { BlogCategoryFilterBar } from "@/components/blog/blog-category-filter";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface BlogPostsPageProps {
  posts: BlogPostSummary[];
}

export function BlogPostsPage({ posts }: BlogPostsPageProps) {
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
      <div className="container-custom">
        <SectionHeading
          label="Blog"
          title="All Articles"
          description="Data analytics tutorials, career tips, and technical deep-dives."
        />

        <BlogCategoryFilterBar
          activeCategory={activeCategory}
          onCategoryChange={setCategory}
          className="mb-4"
        />

        <p className="mb-8 text-center text-sm text-muted-foreground">
          Showing {filtered.length} of {posts.length} articles
        </p>

        <div
          key={activeCategory}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <GlassCard className="group h-full overflow-hidden !p-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4" variant="default">
                    {post.category}
                  </Badge>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="mb-2 font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No articles found in this category.
          </p>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
