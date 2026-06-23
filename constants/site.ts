import { env } from "@/lib/env";

export const siteConfig = {
  name: env.siteName,
  title: `${env.siteName} | Data Analyst Portfolio`,
  description:
    "Data Analyst and MIS Executive specializing in SQL Server, Power BI, Advanced Excel, and business reporting. Delivering automated dashboards and actionable KPI insights.",
  url: env.siteUrl,
  ogImage: "/og-image.png",
  author: env.siteName,
  role: "Data Analyst | MIS Executive",
  email: env.email,
  phone: env.phone,
  location: env.location,
  resumeUrl: "/resume.html",
  resumeDownloadName: "Abhishek_Raj_Resume.html",
  linkedin: env.linkedin,
  keywords: [
    "Data Analyst",
    "MIS Executive",
    "SQL Server",
    "Power BI",
    "Advanced Excel",
    "Power Query",
    "Excel VBA",
    "Dashboard Development",
    "MIS Reporting",
  ],
};

export const socialLinks = [
  {
    name: "LinkedIn",
    url: env.linkedin,
    icon: "linkedin",
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
