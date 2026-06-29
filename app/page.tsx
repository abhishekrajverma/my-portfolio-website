import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero";
import { GitHubSection } from "@/components/sections/github";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogSectionLoader } from "@/components/sections/blog-section-loader";
import { ProjectsSectionLoader } from "@/components/sections/projects-section-loader";
import { AboutSectionLoader } from "@/components/sections/about-section-loader";
import { SkillsSectionLoader } from "@/components/sections/skills-section-loader";
import { CertificationsSectionLoader } from "@/components/sections/certifications-section-loader";
import { TestimonialsSectionLoader } from "@/components/sections/testimonials-section-loader";
import { FAQSectionLoader } from "@/components/sections/faq-section-loader";
import { ContactSectionLoader } from "@/components/sections/contact-section-loader";
import { GitHubSectionSkeleton } from "@/components/skeletons/github-section-skeleton";
import { BlogSectionSkeleton } from "@/components/skeletons/blog-section-skeleton";
import { ProjectCardsSkeleton } from "@/components/skeletons/project-cards-skeleton";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { getFaqs } from "@/lib/content/repository";
import { siteConfig } from "@/constants/site";
import { homePageJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const faqs = await getFaqs();

  return (
    <>
      <JsonLd data={homePageJsonLd(faqs)} />
      <HeroSection />
      <Suspense fallback={<PageSkeleton />}>
        <AboutSectionLoader />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <SkillsSectionLoader />
      </Suspense>
      <Suspense fallback={<ProjectCardsSkeleton />}>
        <ProjectsSectionLoader />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <CertificationsSectionLoader />
      </Suspense>
      <Suspense fallback={<GitHubSectionSkeleton />}>
        <GitHubSection />
      </Suspense>
      <Suspense fallback={<BlogSectionSkeleton />}>
        <BlogSectionLoader />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <TestimonialsSectionLoader />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <FAQSectionLoader />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <ContactSectionLoader />
      </Suspense>
    </>
  );
}
