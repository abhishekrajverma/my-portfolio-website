import type { Metadata } from "next";
import Image from "next/image";
import { SectionLink } from "@/components/layout/section-link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects/repository";
import { normalizePowerBIDashboard, sanitizePowerBIDashboardForSave } from "@/lib/projects/helpers";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbJsonLd,
  creativeWorkJsonLd,
} from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${slug}`,
    image: project.image,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const powerBIDashboard = sanitizePowerBIDashboardForSave(
    normalizePowerBIDashboard(project.powerBIDashboard)
  );

  return (
    <>
      <JsonLd
        data={[
          creativeWorkJsonLd({
            title: project.title,
            description: project.description,
            slug,
            image: project.image,
            technologies: project.technologies,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${slug}` },
          ]),
        ]}
      />
      <article className="section-padding pt-28">
      <div className="container-custom max-w-4xl">
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <SectionLink href="/#projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </SectionLink>
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
            <div className="space-y-4">
              {project.dataCleaning.map((step, index) => (
                <div
                  key={`${step.description}-${index}`}
                  className="rounded-xl border border-border/70 bg-muted/10 p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="accent">{step.tool}</Badge>
                    {step.tool === "Python" && step.toolDetail ? (
                      <span className="text-xs text-muted-foreground">
                        Libraries: {step.toolDetail}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                  {step.image ? (
                    <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border border-border">
                      <Image
                        src={step.image}
                        alt={`${step.tool} data cleaning step`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
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

          <GlassCard hover={false}>
            <h2 className="mb-4 text-xl font-semibold">Power BI Dashboard</h2>
            {powerBIDashboard.summary ? (
              <p className="mb-4 text-muted-foreground">
                {powerBIDashboard.summary}
              </p>
            ) : null}
            {powerBIDashboard.charts.length > 0 ? (
              <div className="mb-6 flex flex-wrap gap-2">
                {powerBIDashboard.charts.map((chart) => (
                  <Badge key={chart} variant="glass">
                    {chart}
                  </Badge>
                ))}
              </div>
            ) : null}
            {powerBIDashboard.steps.length > 0 ? (
              <div className="space-y-4">
                {powerBIDashboard.steps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="rounded-xl border border-border/70 bg-muted/10 p-4"
                  >
                    <h3 className="mb-2 font-medium">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    {step.image ? (
                      <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border border-border">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </GlassCard>

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
            <SectionLink href="/#contact">Get in Touch</SectionLink>
          </Button>
        </div>
      </div>
    </article>
    </>
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
