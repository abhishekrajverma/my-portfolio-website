import { ProjectCardsSkeleton } from "@/components/skeletons/project-cards-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="section-padding pt-28">
      <div className="container-custom">
        <div className="mb-10 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        <ProjectCardsSkeleton count={3} />
      </div>
    </div>
  );
}
