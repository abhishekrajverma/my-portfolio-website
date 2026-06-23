"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/misc";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/10">
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
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
