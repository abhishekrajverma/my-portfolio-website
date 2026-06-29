"use client";

import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section id="testimonials" className="section-padding bg-muted/10">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="Testimonials"
            title="What Colleagues Say"
            description="Feedback from managers and peers across enterprise analytics projects."
          />
        </MotionWrapper>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <GlassCard className="h-full flex flex-col">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="flex-1 text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
