import { profile, stats } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { env } from "@/lib/env";

export type GitHubFeaturedRepo = {
  name: string;
  url: string;
  description: string;
};

const coreSkills = skills
  .filter((skill) =>
    ["SQL Server", "Power BI", "Advanced Excel", "Python", "Power Query", "DAX"].includes(
      skill.name
    )
  )
  .map((skill) => skill.name);

export const githubProfile = {
  username: "abhishekrajverma",
  role: profile.role,
  tagline: profile.tagline,
  intro: profile.summary,
  location: env.location,
  email: env.email,
  linkedin: env.linkedin,
  portfolioUrl: env.siteUrl,
  summary: [
    `${profile.role} specializing in SQL Server, Power BI, Advanced Excel, and MIS reporting`,
    "Reporting automation, interactive dashboard development, and business performance analysis",
    `Core tools: ${coreSkills.join(", ")}`,
    "Data cleaning, KPI frameworks, ETL with Power Query, and query optimization in SQL Server",
    "Python for exploratory analysis, automation scripts, and data validation workflows",
    "Cross-functional collaboration to translate business questions into trackable KPIs and insight reports",
  ],
  currentFocus: [
    "Scaling SQL Server + Power BI reporting for sales, inventory, finance, and operations",
    "Automating repetitive MIS workflows with Power Query and Excel VBA",
    "Building decision-ready dashboards that reduce manual reporting effort and turnaround time",
    "Growing into data engineering with scalable pipelines, cloud data platforms, and modern ETL/ELT workflows",
  ],
  learningFocus: [
    "Data Engineering — pipelines, orchestration, data modeling, and cloud-native storage",
    "Machine Learning — supervised learning, model evaluation, and applied ML with Python",
    "Generative AI — LLMs, prompt engineering, RAG concepts, and AI-assisted analytics",
    "Emerging tech — Docker, cloud services, CI/CD, and tools across the modern data stack",
  ],
  impactStats: stats,
  featuredRepos: [
    {
      name: "my-portfolio-website",
      url: "https://github.com/abhishekrajverma/my-portfolio-website",
      description:
        "Personal Data Analyst portfolio — Next.js, Power BI showcases, project case studies, and blog",
    },
    {
      name: "ERP System",
      url: "https://github.com/abhishekrajverma/ERP-System",
      description:
        "Enterprise ERP analytics with module-wise dashboards and standardized SQL KPI logic",
    },
    ...projects
      .filter(
        (project) =>
          project.githubUrl.includes("/") &&
          !project.githubUrl.endsWith("/abhishekrajverma") &&
          !project.githubUrl.endsWith("/ERP-System")
      )
      .map((project) => ({
        name: project.title,
        url: project.githubUrl,
        description: project.description,
      })),
    {
      name: "dev-thoughts",
      url: "https://github.com/abhishekrajverma/dev-thoughts",
      description: "Personal tech blog and writing on data, engineering, and learning",
    },
  ] satisfies GitHubFeaturedRepo[],
  quote: profile.tagline,
};
