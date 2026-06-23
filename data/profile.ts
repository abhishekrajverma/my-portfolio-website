import type { Experience, Education, TimelineItem } from "@/types";

export const profile = {
  name: "Abhishek Raj",
  role: "Data Analyst | MIS Executive",
  tagline: "Turning Business Data into Clear, Actionable Insights",
  summary:
    "Data-focused MIS Executive and aspiring Data Analyst with 1+ years of hands-on experience in reporting automation, dashboard development, and business performance analysis. Strong working knowledge of SQL Server, Power BI, Excel, Power Query, and Excel VBA. Delivered measurable impact by reducing manual reporting effort by 60% and improving dashboard/report performance by up to 40%.",
  careerObjective:
    "Seeking a Data Analyst or MIS Analyst role where I can apply SQL Server, Power BI, and Advanced Excel skills to build scalable reporting systems, automate workflows, and deliver decision-ready KPI insights for business teams.",
  techStack: ["SQL Server", "Power BI", "Advanced Excel", "Python"],
  typingRoles: ["Data Analyst", "MIS Executive"],
  avatar: "/my-photo.jpeg",
  heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  languages: ["English", "Hindi"],
};

export const experiences: Experience[] = [
  {
    id: "1",
    role: "MIS Executive",
    company: "Worldfa Exports Pvt Ltd",
    period: "May 2025 — Present",
    description:
      "Reporting automation, dashboard development, and business performance analysis for export operations in Haryana, India.",
    highlights: [
      "Created and maintained 30+ daily, weekly, and monthly MIS reports using SQL Server and Advanced Excel, reducing reporting delays by 35%",
      "Designed 12+ Power BI dashboards for sales, inventory, finance, and operations KPIs, cutting decision turnaround time by 25%",
      "Systematized repetitive reporting with Power Query and Excel VBA, reducing manual effort by approximately 60%",
      "Wrote and optimized 100+ SQL queries, views, and stored procedures, improving extraction speed by 40% and reducing data errors by 20%",
      "Collaborated with 6+ cross-functional teams to convert business questions into 20+ trackable KPIs and monthly insight reports",
    ],
  },
];

export const education: Education[] = [
  {
    id: "1",
    degree: "B.Tech, Computer Science and Engineering",
    institution: "MM University, Haryana",
    period: "2020 — 2024",
    description: "GPA: 8.23/10 — Foundation in programming, databases, and software engineering.",
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "1",
    year: "2025",
    title: "MIS Executive at Worldfa Exports",
    description: "Leading MIS reporting, Power BI dashboards, and SQL automation",
    type: "experience",
  },
  {
    id: "2",
    year: "2024",
    title: "B.Tech CSE — MM University",
    description: "Graduated with GPA 8.23/10",
    type: "education",
  },
  {
    id: "3",
    year: "2024",
    title: "Data Analyst Certification",
    description: "Simplilearn — Data Analyst Certification",
    type: "milestone",
  },
  {
    id: "4",
    year: "2024",
    title: "Enterprise ERP Analytics Dashboard",
    description: "Built module-wise Power BI dashboards for 500+ daily users",
    type: "milestone",
  },
];

export const stats = [
  { label: "MIS Reports Built", value: 30, suffix: "+" },
  { label: "Power BI Dashboards", value: 12, suffix: "+" },
  { label: "SQL Queries Optimized", value: 100, suffix: "+" },
  { label: "Manual Effort Reduced", value: 60, suffix: "%" },
];
