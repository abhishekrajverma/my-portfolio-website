import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
  return (
    <article
      className="section-padding pt-28"
      aria-busy="true"
      aria-label="Loading article"
    >
      <div className="blog-reading-column px-4 sm:px-6">
        <Skeleton className="mb-10 h-4 w-24" />

        <header className="mb-10 space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full max-w-3xl" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </header>

        <Skeleton className="mb-12 aspect-[2/1] w-full rounded-sm" />

        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="mt-8 h-7 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </article>
  );
}
