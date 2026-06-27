import { env } from "@/lib/env";

export const siteConfig = {
  name: env.siteName,
  title: `${env.siteName} | Data Analyst & MIS Executive | SQL Server & Power BI`,
  description:
    "Abhishek Raj is a Data Analyst and MIS Executive in Gurgaon & Noida, India. Expert in SQL Server, Power BI, Python, and GenAI — building automated dashboards, MIS reports, and KPI analytics for business teams.",
  url: env.siteUrl,
  ogImage: "/opengraph-image",
  author: env.siteName,
  role: "Data Analyst | MIS Executive | Aspiring Data Engineer",
  email: env.email,
  phone: env.phone,
  location: env.location,
  resumeUrl: "/resume.html",
  resumeDownloadName: "Abhishek_Raj_Resume.html",
  linkedin: env.linkedin,
  github: env.github,
  keywords: [
    "Abhishek Raj",
    "Data Analyst",
    "Data Analyst India",
    "Data Analyst Gurgaon",
    "Data Analyst Noida",
    "MIS Executive",
    "Data Engineer",
    "SQL Server",
    "Power BI",
    "Python",
    "GenAI",
    "Advanced Excel",
    "Power Query",
    "Excel VBA",
    "Dashboard Development",
    "MIS Reporting",
    "Business Intelligence",
    "KPI Dashboard",
    "Data Analytics Portfolio",
    "Hire Data Analyst",
  ],
};

export const socialLinks = [
  {
    name: "LinkedIn",
    url: env.linkedin,
    icon: "linkedin",
  },
  {
    name: "GitHub",
    url: env.github,
    icon: "github",
  },
  {
    name: "Email",
    url: `mailto:${env.email}`,
    icon: "mail",
  },
  {
    name: "Phone",
    url: `tel:${env.phone.replace(/\s/g, "")}`,
    icon: "phone",
  },
];
