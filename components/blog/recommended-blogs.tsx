import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

interface RecommendedBlogsProps {
  posts: BlogPost[];
  currentCategory: BlogPost["category"];
}

export function RecommendedBlogs({ posts, currentCategory }: RecommendedBlogsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-16">
      <div className="mb-8">
        <span className="mb-3 inline-block rounded-full glass px-4 py-1.5 text-xs font-medium text-primary">
          Keep Reading
        </span>
        <h2 className="text-2xl font-bold md:text-3xl">Recommended Articles</h2>
        <p className="mt-2 text-muted-foreground">
          More from <span className="text-foreground">{currentCategory}</span> and
          related topics
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
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
              <div className="p-5">
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      <Separator className="my-10" />

      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/blog">View All Articles</Link>
        </Button>
      </div>
    </section>
  );
}
