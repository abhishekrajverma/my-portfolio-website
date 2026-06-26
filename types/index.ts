export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  description: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  title: string;
  description?: string;
  type: "experience" | "education" | "milestone";
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  businessProblem: string;
  dataset: string;
  tools: string[];
  keyInsights: string[];
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  overview: string;
  problemStatement: string;
  dataCleaning: string[];
  sqlQueries: { title: string; query: string }[];
  pythonAnalysis: string[];
  powerBIDashboard: string;
  businessInsights: string[];
  recommendations: string[];
  screenshots: string[];
  technologies: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  platform: "Microsoft" | "Google" | "IBM" | "Coursera" | "Udemy" | "Simplilearn";
  date: string;
  credentialId: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "SQL" | "Power BI" | "Excel" | "Python" | "Interview";
  date: string;
  readTime: string;
  image: string;
  content: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface KPIData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}
