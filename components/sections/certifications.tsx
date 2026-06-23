"use client";

import { ExternalLink, Award } from "lucide-react";
import { certifications } from "@/data/certifications";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";
import { formatDate } from "@/lib/utils";

const platformColors: Record<string, string> = {
  Microsoft: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  Google: "from-red-500/20 to-yellow-500/10 border-red-500/30",
  IBM: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
  Coursera: "from-blue-600/20 to-indigo-500/10 border-blue-600/30",
  Simplilearn: "from-emerald-500/20 to-green-500/10 border-emerald-500/30",
  Udemy: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
};

export function CertificationsSection() {
  return (
    <section id="certifications" className="section-padding">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="Certifications"
            title="Professional Credentials"
            description="Industry-recognized certifications validating expertise across the analytics stack."
          />
        </MotionWrapper>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent md:-translate-x-px" />

          <StaggerContainer className="space-y-8">
            {certifications.map((cert, i) => (
              <StaggerItem key={cert.id}>
                <div
                  className={`relative flex flex-col md:flex-row gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div
                    className={`md:w-1/2 ${
                      i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <GlassCard
                      className={`bg-gradient-to-br ${platformColors[cert.platform]} border`}
                    >
                      <div
                        className={`flex items-start gap-4 ${
                          i % 2 === 0 ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`flex flex-wrap items-center gap-2 mb-2 ${
                              i % 2 === 0 ? "md:justify-end" : ""
                            }`}
                          >
                            <Badge variant="accent">{cert.platform}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(cert.date)}
                            </span>
                          </div>
                          <h3 className="font-semibold mb-1">{cert.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {cert.issuer}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            ID: {cert.credentialId}
                          </p>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Verify Credential
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  <div className="absolute left-4 md:left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
