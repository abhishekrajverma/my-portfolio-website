import {
  profile,
  experiences,
  education,
  stats,
} from "@/data/profile";
import { skills } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { testimonials, faqs } from "@/data/misc";
import { siteConfig } from "@/constants/site";
import type { AboutContent, ContactContent } from "@/lib/content/types";
import { getDefaultSocialLinks } from "@/lib/content/contact-helpers";

export function getDefaultAboutContent(): AboutContent {
  return {
    name: profile.name,
    role: profile.role,
    tagline: profile.tagline,
    summary: profile.summary,
    careerObjective: profile.careerObjective,
    techStack: [...profile.techStack],
    typingRoles: [...profile.typingRoles],
    languages: [...profile.languages],
    experiences: experiences.map((item) => ({
      ...item,
      highlights: [...item.highlights],
    })),
    education: education.map((item) => ({ ...item })),
    stats: stats.map((item) => ({ ...item })),
  };
}

export function getDefaultContactContent(): ContactContent {
  return {
    email: siteConfig.email,
    phone: siteConfig.phone,
    location: siteConfig.location,
    socialLinks: getDefaultSocialLinks(),
    availabilityTitle: "Open to Opportunities",
    availabilityText:
      "Currently open to full-time Data Analyst, MIS Analyst, and related technology roles across Gurgaon, Noida, and remote-friendly organizations. Recruiters may submit an inquiry through the form or contact me directly by email.",
  };
}

export const defaultSkills = skills;
export const defaultCertifications = certifications;
export const defaultTestimonials = testimonials;
export const defaultFaqs = faqs;
