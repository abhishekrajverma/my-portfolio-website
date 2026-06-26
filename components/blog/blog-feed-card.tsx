import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogPostSummary } from "@/lib/blog/helpers";
import { siteConfig } from "@/constants/site";
import { formatDate } from "@/lib/utils";

interface BlogFeedCardProps {
  post: BlogPostSummary;
  featured?: boolean;
}

export function BlogFeedCard({ post, featured = false }: BlogFeedCardProps) {
  return (
    <article className="group border-b border-border py-8 first:pt-0 last:border-b-0">
      <Link
        href={`/blog/${post.slug}`}
        className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_7rem] sm:gap-8 md:grid-cols-[minmax(0,1fr)_8rem]"
      >
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
              <Image
                src="/my-photo.jpeg"
                alt={siteConfig.author}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <p className="truncate text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{siteConfig.author}</span>
              <span className="mx-1.5" aria-hidden>
                ·
              </span>
              {formatDate(post.date)}
            </p>
          </div>

          <h2
            className={
              featured
                ? "text-2xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary md:text-[1.75rem]"
                : "text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary"
            }
          >
            {post.title}
          </h2>

          <p className="text-base leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted/60 px-2.5 py-1 font-medium text-foreground/80">
              {post.category}
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted justify-self-end">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 128px, 128px"
          />
        </div>
      </Link>
    </article>
  );
}
