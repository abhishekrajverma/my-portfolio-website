import { Skeleton } from "@/components/ui/skeleton";

function BlogFeedCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <article className="border-b border-border py-8 first:pt-0 last:border-b-0">
      <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_7rem] sm:gap-8 md:grid-cols-[minmax(0,1fr)_8rem]">
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton
            className={featured ? "h-8 w-full max-w-xl" : "h-7 w-full max-w-lg"}
          />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="aspect-square w-full rounded-sm" />
      </div>
    </article>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="section-padding pt-28" aria-busy="true" aria-label="Loading articles">
      <div className="blog-feed-column px-4 sm:px-0">
        <header className="mb-8 border-b border-border pb-8">
          <Skeleton className="mb-3 h-4 w-16" />
          <Skeleton className="mb-3 h-10 w-full max-w-md" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </header>

        <div className="mb-4 border-b border-border pb-4">
          <div className="flex gap-4 px-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-14" />
            ))}
          </div>
        </div>

        <Skeleton className="mb-6 h-4 w-24" />

        <BlogFeedCardSkeleton featured />
        <BlogFeedCardSkeleton />
        <BlogFeedCardSkeleton />
      </div>
    </div>
  );
}
