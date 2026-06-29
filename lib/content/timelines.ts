import type { Education, Experience, TimelineItem } from "@/types";

export function buildExperienceTimeline(experiences: Experience[]): TimelineItem[] {
  return experiences.map((exp) => {
    const [startDate, endDate] = exp.period.split("—").map((part) => part.trim());

    return {
      id: `exp-timeline-${exp.id}`,
      period: exp.period,
      startDate,
      endDate,
      title: `${exp.role} — ${exp.company}`,
      type: "experience",
    };
  });
}

export function buildEducationTimeline(education: Education[]): TimelineItem[] {
  return education.map((edu) => {
    const [startYear, endYear] = edu.period.split("—").map((part) => part.trim());

    return {
      id: `edu-timeline-${edu.id}`,
      period: edu.period,
      startDate: startYear,
      endDate: endYear,
      title: `${edu.degree.split(",")[0]} — ${edu.institution.split(",")[0]}`,
      description: edu.description.split("—")[0].trim(),
      type: "education",
    };
  });
}
