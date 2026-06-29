import { SkillsSection } from "@/components/sections/skills";
import { getSkillCategories, getSkills } from "@/lib/content/repository";

export async function SkillsSectionLoader() {
  const [skills, skillCategories] = await Promise.all([
    getSkills(),
    getSkillCategories(),
  ]);

  return <SkillsSection skills={skills} skillCategories={skillCategories} />;
}
