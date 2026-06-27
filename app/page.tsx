import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero";
import { GitHubSection } from "@/components/sections/github";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogSectionLoader } from "@/components/sections/blog-section-loader";
import { GitHubSectionSkeleton } from "@/components/skeletons/github-section-skeleton";
import { BlogSectionSkeleton } from "@/components/skeletons/blog-section-skeleton";
import { faqs } from "@/data/misc";
import { siteConfig } from "@/constants/site";
import { homePageJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

const AboutSection = dynamic(() =>
  import("@/components/sections/about").then((m) => m.AboutSection)
);
const SkillsSection = dynamic(() =>
  import("@/components/sections/skills").then((m) => m.SkillsSection)
);
const ProjectsSection = dynamic(() =>
  import("@/components/sections/projects").then((m) => m.ProjectsSection)
);
const CertificationsSection = dynamic(() =>
  import("@/components/sections/certifications").then((m) => m.CertificationsSection)
);
const TestimonialsSection = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.TestimonialsSection)
);
const FAQSection = dynamic(() =>
  import("@/components/sections/faq").then((m) => m.FAQSection)
);
const ContactSection = dynamic(() =>
  import("@/components/sections/contact").then((m) => m.ContactSection)
);

export default function HomePage() {
  return (
    <>
      <JsonLd data={homePageJsonLd(faqs)} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertificationsSection />
      <Suspense fallback={<GitHubSectionSkeleton />}>
        <GitHubSection />
      </Suspense>
      <Suspense fallback={<BlogSectionSkeleton />}>
        <BlogSectionLoader />
      </Suspense>
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
