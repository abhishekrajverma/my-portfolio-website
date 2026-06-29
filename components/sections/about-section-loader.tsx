import { AboutSection } from "@/components/sections/about";
import { getAboutContent } from "@/lib/content/repository";
import {
  buildEducationTimeline,
  buildExperienceTimeline,
} from "@/lib/content/timelines";

export async function AboutSectionLoader() {
  const content = await getAboutContent();

  return (
    <AboutSection
      content={content}
      experienceTimeline={buildExperienceTimeline(content.experiences)}
      educationTimeline={buildEducationTimeline(content.education)}
    />
  );
}
