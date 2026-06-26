"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
} from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/icons/social-icons";
import { siteConfig, socialLinks } from "@/constants/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MotionWrapper } from "@/components/animations/motion-wrapper";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: siteConfig.location,
    href: null,
  },
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/abhishekrajverma",
    href: socialLinks.find((s) => s.icon === "linkedin")?.url,
    external: true,
  },
  {
    icon: GitHubIcon,
    label: "GitHub",
    value: "github.com/abhishekrajverma",
    href: socialLinks.find((s) => s.icon === "github")?.url,
    external: true,
  },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to send message."
      );
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="Contact"
            title="Let's Work Together"
            description="Have a project in mind or want to discuss opportunities? I'd love to hear from you."
          />
        </MotionWrapper>

        <div className="grid gap-8 lg:grid-cols-5">
          <MotionWrapper delay={0.1} className="lg:col-span-2">
            <GlassCard className="h-full">
              <h3 className="mb-6 text-xl font-semibold">Get in Touch</h3>
              <div className="space-y-5">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.external ? "_blank" : undefined}
                          rel={info.external ? "noopener noreferrer" : undefined}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-6">
                <h4 className="font-semibold mb-2">Open to Opportunities</h4>
                <p className="text-sm text-muted-foreground">
                  Currently exploring Data Analyst and MIS Analyst roles in
                  Gurgaon, Noida, and remote-friendly teams. Response time: within 24 hours.
                </p>
              </div>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.2} className="lg:col-span-3">
            <GlassCard>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle className="h-16 w-16 text-emerald-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-400">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Project inquiry"
                        {...register("subject", { required: "Subject is required" })}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-400">{errors.subject.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project..."
                        rows={5}
                        {...register("message", { required: "Message is required" })}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-400">{errors.message.message}</p>
                      )}
                    </div>
                    {submitError ? (
                      <p className="text-sm text-red-400">{submitError}</p>
                    ) : null}
                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlassCard>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
