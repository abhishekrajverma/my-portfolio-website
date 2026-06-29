export const PORTFOLIO_STORAGE_BUCKET = "portfolio";

export const CONTENT_PATHS = {
  skills: "content/skills.json",
  certifications: "content/certifications.json",
  testimonials: "content/testimonials.json",
  faqs: "content/faqs.json",
  about: "content/about.json",
  contact: "content/contact.json",
} as const;

export const CONTENT_CACHE_TAGS = {
  skills: "content-skills",
  certifications: "content-certifications",
  testimonials: "content-testimonials",
  faqs: "content-faqs",
  about: "content-about",
  contact: "content-contact",
} as const;

export const SKILL_ICONS = [
  "database",
  "table",
  "bar-chart-3",
  "code-2",
  "layers",
  "calculator",
  "line-chart",
  "pie-chart",
  "sigma",
  "filter",
  "workflow",
  "function-square",
  "git-branch",
  "layout-dashboard",
  "trending-up",
] as const;

export const CERTIFICATION_PLATFORMS = [
  "Microsoft",
  "Google",
  "IBM",
  "Coursera",
  "Udemy",
  "Simplilearn",
] as const;

export const SOCIAL_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
] as const;
