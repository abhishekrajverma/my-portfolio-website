"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type BlogCategoryFilter } from "@/constants/blog";
import { filterBlogPostsByCategory } from "@/lib/blog/helpers";
import type { BlogPostSummary } from "@/lib/blog/helpers";
import { BlogCategoryFilterBar } from "@/components/blog/blog-category-filter";
import { BlogFeedCard } from "@/components/blog/blog-feed-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";

interface BlogSectionProps {
  posts: BlogPostSummary[];
  avatarUrl: string;
}

export function BlogSection({ posts, avatarUrl }: BlogSectionProps) {
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
            <SectionHeading
              label="Tech Blog"
              title="Build Logs & Sharp Takes"
              description="Tutorials, tool breakdowns, and honest lessons from across tech — dev, systems, workflows, and whatever I'm exploring next."
            />
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
                <BlogFeedCard post={post} avatarUrl={avatarUrl} featured={index === 0} />
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
