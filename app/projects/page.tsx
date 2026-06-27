import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Data Analytics Projects | SQL, Power BI & Python",
  description:
    "Portfolio of data analytics projects by Abhishek Raj — ERP dashboards, Zomato market analysis, MIS automation with SQL Server, Power BI, and Python.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="section-padding pt-28">
      <div className="container-custom">
        <SectionHeading
          label="Portfolio"
          title="All Projects"
          description="Complete collection of data analytics projects across retail, telecom, supply chain, and HR domains."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <GlassCard className="group h-full overflow-hidden !p-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="glass" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
