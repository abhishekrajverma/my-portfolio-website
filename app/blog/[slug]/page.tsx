import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
  getRecommendedBlogPosts,
} from "@/lib/blog/repository";
import { markdownToHtml } from "@/lib/blog";
import { BlogAuthorMeta } from "@/components/blog/blog-author-meta";
import { RecommendedBlogs } from "@/components/blog/recommended-blogs";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
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
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);
  const [recommendedPosts, avatarUrl] = await Promise.all([
    getRecommendedBlogPosts(slug, 3),
    getProfileAvatarUrl(),
  ]);

  return (
    <article className="section-padding pt-28">
      <div className="blog-reading-column px-4 sm:px-6">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All stories
        </Link>

        <header className="mb-10 space-y-6">
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {post.category}
          </Link>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-foreground md:text-5xl md:leading-[1.08]">
            {post.title}
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            {post.excerpt}
          </p>

          <BlogAuthorMeta
            avatarUrl={avatarUrl}
            date={post.date}
            readTime={post.readTime}
          />

          <p className="text-xs text-muted-foreground">
            Published {formatDate(post.date)}
          </p>
        </header>

        <div className="relative mb-12 aspect-[2/1] overflow-hidden rounded-sm bg-muted">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 680px) 100vw, 680px"
          />
        </div>

        <div
          className="prose-medium"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>

      <div className="blog-reading-column mt-20 px-4 sm:px-6">
        <RecommendedBlogs
          posts={recommendedPosts}
          currentCategory={post.category}
          avatarUrl={avatarUrl}
        />
      </div>
    </article>
  );
}
