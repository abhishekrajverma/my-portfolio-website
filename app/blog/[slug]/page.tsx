import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import {
  blogPosts,
  getBlogPostBySlug,
  getRecommendedBlogPosts,
} from "@/data/blog";
import { markdownToHtml } from "@/lib/blog";
import { RecommendedBlogs } from "@/components/blog/recommended-blogs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);
  const recommendedPosts = getRecommendedBlogPosts(slug, 3);

  return (
    <article className="section-padding pt-28">
      <div className="container-custom max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <Badge className="mb-4" variant="accent">
          {post.category}
        </Badge>

        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>

      <div className="container-custom mt-4 max-w-5xl">
        <RecommendedBlogs
          posts={recommendedPosts}
          currentCategory={post.category}
        />
      </div>
    </article>
  );
}
