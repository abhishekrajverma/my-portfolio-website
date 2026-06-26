"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type BlogCategoryFilter } from "@/constants/blog";
import { filterBlogPostsByCategory } from "@/lib/blog/helpers";
import type { BlogPostSummary } from "@/lib/blog/helpers";
import { BlogCategoryFilterBar } from "@/components/blog/blog-category-filter";
import { BlogFeedCard } from "@/components/blog/blog-feed-card";
import { Button } from "@/components/ui/button";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";

interface BlogSectionProps {
  posts: BlogPostSummary[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryFilter>("All");

  const filtered = useMemo(() => {
    const categoryPosts = filterBlogPostsByCategory(posts, activeCategory);
    return categoryPosts.slice(0, 3);
  }, [activeCategory, posts]);

  const viewAllHref =
    activeCategory === "All"
      ? "/blog"
      : `/blog?category=${encodeURIComponent(activeCategory)}`;

  return (
    <section id="blog" className="section-padding">
      <div className="container-custom">
        <div className="blog-feed-column">
          <MotionWrapper>
            <header className="mb-8 border-b border-border pb-8 text-left">
              <p className="mb-3 text-sm font-medium text-primary">Stories</p>
              <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                Insights & Tutorials
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                Practical guides on SQL, Power BI, Python, and data analytics career
                development.
              </p>
            </header>
          </MotionWrapper>

          <MotionWrapper delay={0.1}>
            <BlogCategoryFilterBar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              className="mb-4"
            />
          </MotionWrapper>

          <StaggerContainer key={activeCategory}>
            {filtered.map((post, index) => (
              <StaggerItem key={post.slug}>
                <BlogFeedCard post={post} featured={index === 0} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <MotionWrapper delay={0.3} className="mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href={viewAllHref}>See all stories</Link>
            </Button>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
