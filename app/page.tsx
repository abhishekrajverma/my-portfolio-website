import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { DashboardSection } from "@/components/sections/dashboard";
import { CertificationsSection } from "@/components/sections/certifications";
import { BlogSection } from "@/components/sections/blog";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <DashboardSection />
      <CertificationsSection />
      <BlogSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
