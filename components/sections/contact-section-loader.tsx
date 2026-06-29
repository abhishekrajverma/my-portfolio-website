import { ContactSection } from "@/components/sections/contact";
import { getContactContent } from "@/lib/content/repository";

export async function ContactSectionLoader() {
  const contact = await getContactContent();
  return <ContactSection contact={contact} />;
}
