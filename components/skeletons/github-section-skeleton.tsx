import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/glass-card";

export function GitHubSectionSkeleton() {
  return (
    <section
      className="section-padding bg-muted/10"
      aria-busy="true"
      aria-label="Loading GitHub stats"
    >
      <div className="container-custom">
        <div className="mb-10 space-y-3 text-center md:text-left">
          <Skeleton className="mx-auto h-4 w-16 md:mx-0" />
          <Skeleton className="mx-auto h-9 w-56 md:mx-0" />
          <Skeleton className="mx-auto h-5 w-full max-w-xl md:mx-0" />
        </div>

        <GlassCard className="mb-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl" />
            ))}
          </div>
        </GlassCard>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <GlassCard className="min-h-[320px]">
            <Skeleton className="mb-4 h-5 w-36" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </GlassCard>
          <GlassCard className="min-h-[320px]">
            <Skeleton className="mb-4 h-5 w-44" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <Skeleton className="mb-6 h-5 w-48" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-3 p-4">
                <Skeleton className="h-28 w-28 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
