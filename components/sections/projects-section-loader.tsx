import { ProjectsSection } from "@/components/sections/projects";
import { getAllProjects } from "@/lib/projects/repository";

export async function ProjectsSectionLoader() {
  const projects = await getAllProjects();
  return <ProjectsSection projects={projects} />;
}
