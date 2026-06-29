import { TestimonialsSection } from "@/components/sections/testimonials";
import { getTestimonials } from "@/lib/content/repository";

export async function TestimonialsSectionLoader() {
  const testimonials = await getTestimonials();
  return <TestimonialsSection testimonials={testimonials} />;
}
