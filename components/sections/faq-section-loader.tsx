import { FAQSection } from "@/components/sections/faq";
import { getFaqs } from "@/lib/content/repository";

export async function FAQSectionLoader() {
  const faqs = await getFaqs();
  return <FAQSection faqs={faqs} />;
}
