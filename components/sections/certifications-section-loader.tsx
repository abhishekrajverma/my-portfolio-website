import { CertificationsSection } from "@/components/sections/certifications";
import { getCertifications } from "@/lib/content/repository";

export async function CertificationsSectionLoader() {
  const certifications = await getCertifications();
  return <CertificationsSection certifications={certifications} />;
}
