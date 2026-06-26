import type { Experience, Education, TimelineItem } from "@/types";

export const profile = {
  name: "Abhishek Raj",
  role: "Data Analyst | MIS Executive | Aspiring Data Engineer",
  tagline: "Turning Business Data into Clear, Actionable Insights",
  summary:
    "Data-focused MIS Executive and aspiring Data Analyst with 1+ years of hands-on experience in reporting automation, dashboard development, and business performance analysis. Strong working knowledge of SQL Server, Power BI, Excel, Power Query, and Excel VBA. Delivered measurable impact by reducing manual reporting effort by 60% and improving dashboard/report performance by up to 40%. Currently expanding into data engineering, machine learning, generative AI, and modern cloud-native data technologies.",
  careerObjective:
    "Seeking a Data Analyst, MIS Analyst, or Data Engineer role where I can apply SQL Server, Power BI, and Python skills to build scalable reporting systems, data pipelines, and AI-ready analytics workflows that deliver decision-ready KPI insights for business teams.",
  techStack: ["SQL Server", "Power BI", "Python", "Machine Learning"],
  typingRoles: ["Data Analyst", "Data Engineer", "MIS Executive"],
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

const experienceRoleTimeline: TimelineItem[] = experiences.map((exp) => {
  const [startDate, endDate] = exp.period.split("—").map((part) => part.trim());

  return {
    id: `exp-timeline-${exp.id}`,
    period: exp.period,
    startDate,
    endDate,
    title: `${exp.role} — ${exp.company}`,
    type: "experience",
  };
});

export const experienceTimeline: TimelineItem[] = experienceRoleTimeline;

export const educationTimeline: TimelineItem[] = education.map((edu) => {
  const [startYear, endYear] = edu.period.split("—").map((part) => part.trim());

  return {
    id: `edu-timeline-${edu.id}`,
    period: edu.period,
    startDate: startYear,
    endDate: endYear,
    title: `${edu.degree.split(",")[0]} — ${edu.institution.split(",")[0]}`,
    description: edu.description.split("—")[0].trim(),
    type: "education",
  };
});

export const stats = [
  { label: "MIS Reports Built", value: 30, suffix: "+" },
  { label: "Power BI Dashboards", value: 12, suffix: "+" },
  { label: "SQL Queries Optimized", value: 100, suffix: "+" },
  { label: "Manual Effort Reduced", value: 60, suffix: "%" },
];
