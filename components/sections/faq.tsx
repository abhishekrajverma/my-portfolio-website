"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/misc";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="section-padding">
      <div className="container-custom max-w-3xl">
        <MotionWrapper>
          <SectionHeading
            label="FAQ"
            title="Frequently Asked Questions"
            description="Common questions about my work, availability, and expertise."
          />
        </MotionWrapper>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const triggerId = `faq-trigger-${faq.id}`;

            return (
              <MotionWrapper key={faq.id} delay={i * 0.05}>
                <GlassCard hover={false} className="!p-0 overflow-hidden">
                  <button
                    id={triggerId}
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between p-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="pr-4 font-medium">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {reduceMotion ? (
                    isOpen ? (
                      <div id={panelId} role="region" aria-labelledby={triggerId}>
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    ) : null
                  ) : (
                    <AnimatePresence>
                      {isOpen ? (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                            {faq.answer}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  )}
                </GlassCard>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
