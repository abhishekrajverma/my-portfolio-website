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
        </div>
        <Skeleton className="aspect-square w-full rounded-sm" />
      </div>
    </article>
  );
}

export function BlogSectionSkeleton() {
  return (
    <section
      className="section-padding"
      aria-busy="true"
      aria-label="Loading stories"
    >
      <div className="container-custom">
        <div className="blog-feed-column">
          <div className="mb-8 space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-72 max-w-full" />
            <Skeleton className="h-5 w-full max-w-2xl" />
          </div>
          <div className="mb-4 border-b border-border pb-4">
            <div className="flex gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-14" />
              ))}
            </div>
          </div>
          <BlogFeedCardSkeleton featured />
          <BlogFeedCardSkeleton />
          <BlogFeedCardSkeleton />
        </div>
      </div>
    </section>
  );
}
