import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import { projects, getProjectBySlug } from "@/data/projects";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="section-padding pt-28">
      <div className="container-custom max-w-4xl">
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/#projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="accent">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {project.title}
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">{project.description}</p>

        <div className="mb-8 flex flex-wrap gap-3">
          <Button variant="gradient" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="h-4 w-4" />
              GitHub Repository
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          </Button>
        </div>

        <div className="space-y-8">
          <Section title="Overview" content={project.overview} />
          <Section title="Problem Statement" content={project.problemStatement} />
          <GlassCard hover={false}>
            <h2 className="mb-3 text-xl font-semibold">Dataset</h2>
            <p className="text-muted-foreground">{project.dataset}</p>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="mb-4 text-xl font-semibold">Data Cleaning</h2>
            <ul className="space-y-2">
              {project.dataCleaning.map((item) => (
                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="mb-4 text-xl font-semibold">SQL Queries</h2>
            <div className="space-y-4">
              {project.sqlQueries.map((q) => (
                <div key={q.title}>
                  <h3 className="mb-2 font-medium">{q.title}</h3>
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                    <code>{q.query}</code>
                  </pre>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="mb-4 text-xl font-semibold">Python Analysis</h2>
            <ul className="space-y-2">
              {project.pythonAnalysis.map((item) => (
                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <Section title="Power BI Dashboard" content={project.powerBIDashboard} />

          <GlassCard hover={false}>
            <h2 className="mb-4 text-xl font-semibold">Business Insights</h2>
            <ul className="space-y-2">
              {project.businessInsights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="mb-4 text-xl font-semibold">Recommendations</h2>
            <ul className="space-y-2">
              {project.recommendations.map((item) => (
                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Screenshots</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {project.screenshots.map((src, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                  <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <GlassCard hover={false}>
            <h2 className="mb-4 text-xl font-semibold">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="glass">
                  {tech}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </div>

        <Separator className="my-12" />

        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Interested in similar work?</p>
          <Button variant="gradient" size="lg" asChild>
            <Link href="/#contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <GlassCard hover={false}>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{content}</p>
    </GlassCard>
  );
}
