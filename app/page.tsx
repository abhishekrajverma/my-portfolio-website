import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero";
import { getBlogPostSummaries } from "@/lib/blog/repository";

const AboutSection = dynamic(() =>
  import("@/components/sections/about").then((m) => m.AboutSection)
);
const SkillsSection = dynamic(() =>
  import("@/components/sections/skills").then((m) => m.SkillsSection)
);
const ProjectsSection = dynamic(() =>
  import("@/components/sections/projects").then((m) => m.ProjectsSection)
);
const DashboardSection = dynamic(() =>
  import("@/components/sections/dashboard").then((m) => m.DashboardSection)
);
const CertificationsSection = dynamic(() =>
  import("@/components/sections/certifications").then((m) => m.CertificationsSection)
);
const BlogSection = dynamic(() =>
  import("@/components/sections/blog").then((m) => m.BlogSection)
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

export const revalidate = 300;

export default async function HomePage() {
  const blogPosts = await getBlogPostSummaries();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <DashboardSection />
      <CertificationsSection />
      <BlogSection posts={blogPosts} />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
