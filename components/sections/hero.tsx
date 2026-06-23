"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Mail, ArrowDown } from "lucide-react";
import { profile } from "@/data/profile";
import { siteConfig } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeroTypingHeadline,
  HeroTypingRole,
  HeroTypingDescription,
} from "@/components/animations/hero-text";

const descriptionText = `${profile.tagline}. Specializing in ${profile.techStack.join(" · ")} to drive data-informed decisions.`;

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center section-padding pt-32"
    >
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.5 },
              y: {
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge variant="glass" className="text-sm">
                Available for opportunities
              </Badge>
            </motion.div>

            <HeroTypingHeadline name={profile.name} />

            <HeroTypingRole roles={profile.typingRoles} startDelay={1400} />

            <HeroTypingDescription text={descriptionText} startDelay={2200} />

            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.8, duration: 0.6 }}
            >
              {profile.techStack.map((tech) => (
                <Badge key={tech} variant="accent">
                  {tech}
                </Badge>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -2, 0] }}
              transition={{
                opacity: { delay: 4.2, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
                y: { delay: 4.8, duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Button variant="gradient" size="lg" asChild>
                <a
                  href={siteConfig.resumeUrl}
                  download={siteConfig.resumeDownloadName}
                >
                  <Download className="h-5 w-5" />
                  Download Resume
                </a>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <a href="/#contact">
                  <Mail className="h-5 w-5" />
                  Contact Me
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-lg"
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl glass gradient-border">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={500}
                  height={500}
                  className="aspect-square w-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5 }}
          className="mt-16 flex justify-center"
        >
          <motion.a
            href="/#about"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xs">Scroll to explore</span>
            <ArrowDown className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
