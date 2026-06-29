import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_CACHE_TAGS, CONTENT_PATHS } from "@/lib/content/constants";
import {
  ensurePortfolioStorageBucket,
  isPortfolioStorageConfigured,
  uploadContentToStorage,
} from "@/lib/content/storage";
import type {
  AboutContent,
  CertificationsContent,
  ContactContent,
  FaqsContent,
  SkillsContent,
  TestimonialsContent,
} from "@/lib/content/types";

function assertPortfolioStorageReady(): void {
  if (!isPortfolioStorageConfigured()) {
    throw new Error(
      "Supabase is not configured. Add your Supabase credentials first."
    );
  }
}

function revalidateContent(cacheTag: string, paths: string[] = ["/"]): void {
  revalidateTag(cacheTag, "max");
  paths.forEach((path) => revalidatePath(path));
}

export async function saveSkills(items: SkillsContent): Promise<SkillsContent> {
  assertPortfolioStorageReady();
  await ensurePortfolioStorageBucket();
  await uploadContentToStorage(CONTENT_PATHS.skills, items);
  revalidateContent(CONTENT_CACHE_TAGS.skills);
  revalidatePath("/admin/skills");
  return items;
}

export async function saveCertifications(
  items: CertificationsContent
): Promise<CertificationsContent> {
  assertPortfolioStorageReady();
  await ensurePortfolioStorageBucket();
  await uploadContentToStorage(CONTENT_PATHS.certifications, items);
  revalidateContent(CONTENT_CACHE_TAGS.certifications);
  revalidatePath("/admin/certifications");
  return items;
}

export async function saveTestimonials(
  items: TestimonialsContent
): Promise<TestimonialsContent> {
  assertPortfolioStorageReady();
  await ensurePortfolioStorageBucket();
  await uploadContentToStorage(CONTENT_PATHS.testimonials, items);
  revalidateContent(CONTENT_CACHE_TAGS.testimonials);
  revalidatePath("/admin/testimonials");
  return items;
}

export async function saveFaqs(items: FaqsContent): Promise<FaqsContent> {
  assertPortfolioStorageReady();
  await ensurePortfolioStorageBucket();
  await uploadContentToStorage(CONTENT_PATHS.faqs, items);
  revalidateContent(CONTENT_CACHE_TAGS.faqs);
  revalidatePath("/admin/faqs");
  return items;
}

export async function saveAboutContent(content: AboutContent): Promise<AboutContent> {
  assertPortfolioStorageReady();
  await ensurePortfolioStorageBucket();
  await uploadContentToStorage(CONTENT_PATHS.about, content);
  revalidateContent(CONTENT_CACHE_TAGS.about, ["/", "/resume"]);
  revalidatePath("/admin/about");
  return content;
}

export async function saveContactContent(
  content: ContactContent
): Promise<ContactContent> {
  assertPortfolioStorageReady();
  await ensurePortfolioStorageBucket();
  await uploadContentToStorage(CONTENT_PATHS.contact, content);
  revalidateContent(CONTENT_CACHE_TAGS.contact);
  revalidatePath("/admin/contact");
  return content;
}
