"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts, getBlogPostsByCategory } from "@/data/blog";
import { type BlogCategoryFilter } from "@/constants/blog";
import { BlogCategoryFilterBar } from "@/components/blog/blog-category-filter";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";
import { formatDate } from "@/lib/utils";

export function BlogSection() {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryFilter>("All");

  const filtered = useMemo(() => {
    const posts = getBlogPostsByCategory(activeCategory);
    return posts.slice(0, 3);
  }, [activeCategory]);

  const viewAllHref =
    activeCategory === "All"
      ? "/blog"
      : `/blog?category=${encodeURIComponent(activeCategory)}`;

  return (
    <section id="blog" className="section-padding bg-muted/10">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="Blog"
            title="Insights & Tutorials"
            description="Practical guides on SQL, Power BI, Python, and data analytics career development."
          />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <BlogCategoryFilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            className="mb-8"
          />
        </MotionWrapper>

        <StaggerContainer
          key={activeCategory}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
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
                    <h3 className="mb-2 font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <MotionWrapper delay={0.3} className="mt-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href={viewAllHref}>View All Articles</Link>
          </Button>
        </MotionWrapper>
      </div>
    </section>
  );
}
