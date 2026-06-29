import { unstable_cache } from "next/cache";
import { CONTENT_CACHE_TAGS, CONTENT_PATHS } from "@/lib/content/constants";
import {
  defaultCertifications,
  defaultFaqs,
  defaultSkills,
  defaultTestimonials,
  getDefaultAboutContent,
  getDefaultContactContent,
} from "@/lib/content/defaults";
import {
  fetchContentFromStorage,
  isPortfolioStorageConfigured,
} from "@/lib/content/storage";
import { normalizeContactContent } from "@/lib/content/contact-helpers";
import type {
  AboutContent,
  CertificationsContent,
  ContactContent,
  FaqsContent,
  SkillsContent,
  TestimonialsContent,
} from "@/lib/content/types";
import type { Certification, FAQ, Skill, Testimonial } from "@/types";

function normalizeAboutContent(
  stored: AboutContent & { heroImage?: string }
): AboutContent {
  const { heroImage: _removed, ...content } = stored;
  return content;
}

async function readCollection<T>(path: string, fallback: T): Promise<T> {
  if (!isPortfolioStorageConfigured()) {
    return fallback;
  }

  try {
    const stored = await fetchContentFromStorage<T>(path);
    if (stored) return stored;
  } catch {
    // Fall back to bundled content when storage is unavailable.
  }

  return fallback;
}

const getCachedSkills = unstable_cache(
  () => readCollection<SkillsContent>(CONTENT_PATHS.skills, defaultSkills),
  ["content-skills"],
  { revalidate: 300, tags: [CONTENT_CACHE_TAGS.skills] }
);

const getCachedCertifications = unstable_cache(
  () =>
    readCollection<CertificationsContent>(
      CONTENT_PATHS.certifications,
      defaultCertifications
    ),
  ["content-certifications"],
  { revalidate: 300, tags: [CONTENT_CACHE_TAGS.certifications] }
);

const getCachedTestimonials = unstable_cache(
  () =>
    readCollection<TestimonialsContent>(
      CONTENT_PATHS.testimonials,
      defaultTestimonials
    ),
  ["content-testimonials"],
  { revalidate: 300, tags: [CONTENT_CACHE_TAGS.testimonials] }
);

const getCachedFaqs = unstable_cache(
  () => readCollection<FaqsContent>(CONTENT_PATHS.faqs, defaultFaqs),
  ["content-faqs"],
  { revalidate: 300, tags: [CONTENT_CACHE_TAGS.faqs] }
);

const getCachedAbout = unstable_cache(
  () =>
    readCollection<AboutContent & { heroImage?: string }>(
      CONTENT_PATHS.about,
      getDefaultAboutContent()
    ).then(normalizeAboutContent),
  ["content-about"],
  { revalidate: 300, tags: [CONTENT_CACHE_TAGS.about] }
);

const getCachedContact = unstable_cache(
  () =>
    readCollection<ContactContent & { linkedinDisplay?: string; linkedinUrl?: string }>(
      CONTENT_PATHS.contact,
      getDefaultContactContent()
    ).then(normalizeContactContent),
  ["content-contact"],
  { revalidate: 300, tags: [CONTENT_CACHE_TAGS.contact] }
);

export async function getSkills(): Promise<Skill[]> {
  return getCachedSkills();
}

export async function getSkillCategories(): Promise<string[]> {
  const items = await getSkills();
  return ["All", ...Array.from(new Set(items.map((skill) => skill.category)))];
}

export async function getCertifications(): Promise<Certification[]> {
  return getCachedCertifications();
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return getCachedTestimonials();
}

export async function getFaqs(): Promise<FAQ[]> {
  return getCachedFaqs();
}

export async function getAboutContent(): Promise<AboutContent> {
  return getCachedAbout();
}

export async function getContactContent(): Promise<ContactContent> {
  return getCachedContact();
}

export async function getAdminSkills(): Promise<Skill[]> {
  if (!isPortfolioStorageConfigured()) return getSkills();
  try {
    const stored = await fetchContentFromStorage<SkillsContent>(CONTENT_PATHS.skills);
    if (stored) return stored;
  } catch {
    // ignore
  }
  return getSkills();
}

export async function getAdminCertifications(): Promise<Certification[]> {
  if (!isPortfolioStorageConfigured()) return getCertifications();
  try {
    const stored = await fetchContentFromStorage<CertificationsContent>(
      CONTENT_PATHS.certifications
    );
    if (stored) return stored;
  } catch {
    // ignore
  }
  return getCertifications();
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  if (!isPortfolioStorageConfigured()) return getTestimonials();
  try {
    const stored = await fetchContentFromStorage<TestimonialsContent>(
      CONTENT_PATHS.testimonials
    );
    if (stored) return stored;
  } catch {
    // ignore
  }
  return getTestimonials();
}

export async function getAdminFaqs(): Promise<FAQ[]> {
  if (!isPortfolioStorageConfigured()) return getFaqs();
  try {
    const stored = await fetchContentFromStorage<FaqsContent>(CONTENT_PATHS.faqs);
    if (stored) return stored;
  } catch {
    // ignore
  }
  return getFaqs();
}

export async function getAdminAboutContent(): Promise<AboutContent> {
  if (!isPortfolioStorageConfigured()) return getAboutContent();
  try {
    const stored = await fetchContentFromStorage<AboutContent & { heroImage?: string }>(
      CONTENT_PATHS.about
    );
    if (stored) return normalizeAboutContent(stored);
  } catch {
    // ignore
  }
  return getAboutContent();
}

export async function getAdminContactContent(): Promise<ContactContent> {
  if (!isPortfolioStorageConfigured()) return getContactContent();
  try {
    const stored = await fetchContentFromStorage<
      ContactContent & { linkedinDisplay?: string; linkedinUrl?: string }
    >(CONTENT_PATHS.contact);
    if (stored) return normalizeContactContent(stored);
  } catch {
    // ignore
  }
  return getContactContent();
}
