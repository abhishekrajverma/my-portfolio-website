import { resumeData } from "@/data/resume";
import { siteConfig } from "@/constants/site";
import { ResumeActions } from "@/components/resume/resume-actions";
import { Separator } from "@/components/ui/separator";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: `Resume | ${siteConfig.name} — Data Analyst & MIS Executive`,
  description: `Download the resume of ${siteConfig.name}, Data Analyst and MIS Executive skilled in SQL Server, Power BI, Python, and GenAI.`,
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div className="section-padding pt-28">
      <div className="container-custom max-w-3xl">
        <ResumeActions />

        <article className="glass rounded-2xl p-8 md:p-12 print:border-0 print:bg-white print:text-black print:shadow-none">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-wide md:text-4xl print:text-black">
              {resumeData.name.toUpperCase()}
            </h1>
            <p className="mt-2 text-sm font-medium text-primary md:text-base print:text-blue-800">
              {resumeData.title}
            </p>
            <p className="mt-3 text-sm text-muted-foreground print:text-gray-700">
              Phone: {resumeData.contact.phone} | Email: {resumeData.contact.email}
              <br />
              LinkedIn: {resumeData.contact.linkedin} | Location: {resumeData.contact.location}
            </p>
          </header>

          <ResumeSection title="Professional Summary">
            <p className="text-sm leading-relaxed text-muted-foreground print:text-gray-800">
              {resumeData.summary}
            </p>
          </ResumeSection>

          <ResumeSection title="Core Skills">
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs print:border-gray-300 print:bg-gray-100 print:text-gray-900"
                >
                  {skill}
                </span>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Professional Experience">
            {resumeData.experience.map((job) => (
              <div key={job.company} className="mb-6 last:mb-0">
                <h3 className="font-semibold print:text-black">{job.role}</h3>
                <p className="text-sm text-muted-foreground print:text-gray-600">
                  {job.company} | {job.period}
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground print:text-gray-800">
                  {job.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </ResumeSection>

          <ResumeSection title="Projects">
            {resumeData.projects.map((project) => (
              <div key={project.name} className="mb-5 last:mb-0">
                <h3 className="font-semibold print:text-black">
                  {project.name}{" "}
                  <span className="font-normal text-muted-foreground print:text-gray-600">
                    | {project.tech}
                  </span>
                </h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground print:text-gray-800">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </ResumeSection>

          <ResumeSection title="Education">
            <h3 className="font-semibold print:text-black">{resumeData.education.degree}</h3>
            <p className="text-sm text-muted-foreground print:text-gray-600">
              {resumeData.education.institution} | {resumeData.education.period} | GPA:{" "}
              {resumeData.education.gpa}
            </p>
          </ResumeSection>

          <ResumeSection title="Certifications">
            {resumeData.certifications.map((cert) => (
              <p key={cert.title} className="text-sm text-muted-foreground print:text-gray-800">
                {cert.title} — {cert.issuer}
              </p>
            ))}
          </ResumeSection>

          <ResumeSection title="Additional Information">
            <p className="text-sm text-muted-foreground print:text-gray-800">
              Languages: {resumeData.languages.join(", ")}
            </p>
          </ResumeSection>
        </article>
      </div>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 last:mb-0">
      <h2 className="mb-3 border-b border-primary/40 pb-1 text-sm font-bold uppercase tracking-wider text-foreground print:border-blue-700 print:text-black">
        {title}
      </h2>
      {children}
      <Separator className="mt-6 print:hidden" />
    </section>
  );
}
