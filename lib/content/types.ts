import type { Certification, Education, Experience, FAQ, Skill, Testimonial } from "@/types";

export interface ProfileStat {
  label: string;
  value: number;
  suffix: string;
}

export interface AboutContent {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  careerObjective: string;
  techStack: string[];
  typingRoles: string[];
  languages: string[];
  experiences: Experience[];
  education: Education[];
  stats: ProfileStat[];
}

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "twitter"
  | "instagram"
  | "youtube"
  | "facebook"
  | "website"
  | "other";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
  availabilityTitle: string;
  availabilityText: string;
}

export type ContentCollectionKey =
  | "skills"
  | "certifications"
  | "testimonials"
  | "faqs";

export type SkillsContent = Skill[];
export type CertificationsContent = Certification[];
export type TestimonialsContent = Testimonial[];
export type FaqsContent = FAQ[];
