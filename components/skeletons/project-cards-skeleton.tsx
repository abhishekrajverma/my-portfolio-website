import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/glass-card";

export function ProjectCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid gap-6 md:grid-cols-2"
      aria-busy="true"
      aria-label="Loading projects"
    >
      {Array.from({ length: count }).map((_, index) => (
        <GlassCard key={index} className="h-full overflow-hidden !p-0">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-3 p-6">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
