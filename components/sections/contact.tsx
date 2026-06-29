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
  FileText,
  X,
} from "lucide-react";
import type { ContactContent } from "@/lib/content/types";
import {
  getSocialLinkIcon,
  getSocialPlatformLabel,
} from "@/lib/content/social-link-icons";
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
  phone: string;
  subject: string;
  message: string;
}

const contactInfo = (contact: ContactContent) => [
  {
    icon: Mail,
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: contact.phone,
    href: `tel:${contact.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: contact.location,
    href: null,
  },
  ...contact.socialLinks.map((link) => ({
    icon: getSocialLinkIcon(link.platform),
    label: getSocialPlatformLabel(link.platform),
    value: link.label,
    href: link.url,
  })),
];

export function ContactSection({ contact }: { contact: ContactContent }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setSubmitError("");

    if (!jdFile && !data.message.trim()) {
      setSubmitError(
        "Please attach a job description document or provide a detailed role summary in your message."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("subject", data.subject);
      formData.append("message", data.message);
      if (jdFile) {
        formData.append("jd", jdFile);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your inquiry. Please try again.");
      }

      setSubmitted(true);
      reset();
      setJdFile(null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit your inquiry. Please try again."
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
            description="Open to full-time roles, consulting engagements, and professional collaborations. I respond to all inquiries within one to two business days."
          />
        </MotionWrapper>

        <div className="grid gap-8 lg:grid-cols-5">
          <MotionWrapper delay={0.1} className="lg:col-span-2">
            <GlassCard className="h-full">
              <h3 className="mb-6 text-xl font-semibold">Contact Information</h3>
              <div className="space-y-5">
                {contactInfo(contact).map((info) => (
                  <div key={info.href ?? info.label} className="flex items-start gap-4">
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
                          target={
                            info.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            info.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
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
                <h4 className="font-semibold mb-2">{contact.availabilityTitle}</h4>
                <p className="text-sm text-muted-foreground">
                  {contact.availabilityText}
                </p>
              </div>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.2} className="lg:col-span-3">
            <GlassCard>
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {submitted
                  ? "Inquiry submitted successfully."
                  : submitError
                    ? submitError
                    : ""}
              </div>
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
                    <h3 className="text-xl font-semibold mb-2">Inquiry Submitted</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. A confirmation has been sent to your email,
                      and you can expect a response within one to two business days.
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
                    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background/50 to-secondary/10 px-4 py-3 text-sm text-muted-foreground shadow-[0_0_30px_-12px_var(--glow-primary)]">
                      <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-primary/25 blur-2xl" />
                      <div className="pointer-events-none absolute -bottom-8 -left-6 h-20 w-20 rounded-full bg-secondary/20 blur-2xl" />
                      <div className="relative">
                        <p className="font-medium text-foreground">
                          For recruiters &amp; hiring teams
                        </p>
                        <p className="mt-1 leading-relaxed">
                          If you&apos;re hiring, share the role title, company name, and whether
                          it&apos;s onsite, hybrid, or remote. Got a JD? Attach it below — if not,
                          write the role details in the message box. I usually reply within a
                          couple of business days.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Contact person</Label>
                        <Input
                          id="name"
                          placeholder="e.g. Priya Sharma, Talent Acquisition"
                          {...register("name", {
                            required: "Please enter the contact person's name.",
                          })}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive" role="alert">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Professional email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="recruiting@company.com"
                          {...register("email", {
                            required: "Please enter a valid professional email address.",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Please enter a valid email address.",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive" role="alert">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Direct contact number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          {...register("phone", {
                            validate: (value) => {
                              const trimmed = value?.trim() ?? "";
                              if (!trimmed) return true;
                              return (
                                /^[+]?[\d\s().-]{8,}$/.test(trimmed) ||
                                "Please enter a valid contact number."
                              );
                            },
                          })}
                        />
                        {errors.phone ? (
                          <p className="text-xs text-destructive" role="alert">
                            {errors.phone.message}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Optional. Recommended for time-sensitive or expedited follow-up.
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Inquiry subject</Label>
                        <Input
                          id="subject"
                          placeholder="e.g. Data Analyst — Gurgaon (Hybrid)"
                          {...register("subject", {
                            required: "Please enter a subject for your inquiry.",
                          })}
                        />
                        {errors.subject && (
                          <p className="text-xs text-destructive" role="alert">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jd">Job description document</Label>
                      <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-background/40 to-accent/10 p-3 shadow-[0_0_35px_-14px_var(--glow-primary)]">
                        <div className="pointer-events-none absolute -left-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-primary/35 blur-3xl" />
                        <div className="pointer-events-none absolute -right-8 top-0 h-16 w-16 rounded-full bg-secondary/30 blur-3xl" />
                        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button
                          type="button"
                          variant="gradient"
                          className="h-9 w-full shrink-0 px-4 text-sm sm:w-auto"
                          asChild
                        >
                          <label htmlFor="jd" className="cursor-pointer">
                            <FileText className="h-4 w-4" />
                            {jdFile ? "Replace document" : "Attach job description"}
                          </label>
                        </Button>
                        <input
                          id="jd"
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            setJdFile(file);
                            setSubmitError("");
                          }}
                        />
                        {jdFile ? (
                          <div className="flex flex-1 items-center justify-between gap-3 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm shadow-[0_0_18px_-8px_var(--glow-secondary)]">
                            <span className="truncate font-medium text-foreground">{jdFile.name}</span>
                            <button
                              type="button"
                              onClick={() => setJdFile(null)}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Remove job description file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground sm:flex-1">
                            Accepted formats: PDF, DOC, DOCX · Maximum size: 10 MB
                          </p>
                        )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Role details</Label>
                      <Textarea
                        id="message"
                        placeholder="If no document is attached, please include the role summary, location, work arrangement, experience level, compensation range (if applicable), and proposed next steps."
                        rows={5}
                        {...register("message")}
                      />
                      <p className="text-xs text-muted-foreground">
                        Required when no job description document is attached.
                      </p>
                      {errors.message && (
                        <p className="text-xs text-destructive" role="alert">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    {submitError ? (
                      <p className="text-sm text-destructive" role="alert">
                        {submitError}
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit inquiry"}
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
