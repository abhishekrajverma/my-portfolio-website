"use client";

import { motion } from "framer-motion";
import { ProfileAvatarImage } from "@/components/profile/profile-avatar-image";
import { profile } from "@/data/profile";
import { PROFILE_AVATAR_FALLBACK } from "@/lib/profile/constants";
import { siteConfig } from "@/constants/site";

export function LoadingScreen({ avatarUrl = PROFILE_AVATAR_FALLBACK }: { avatarUrl?: string }) {
  const firstName = siteConfig.name.split(" ")[0];

  return (
    <div
      className="flex h-full min-h-screen w-full items-center justify-center overflow-hidden bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-secondary/25 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="rounded-2xl border-2 border-border bg-card p-8 shadow-2xl">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <motion.span
                className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/50 via-secondary/30 to-accent/40 blur-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div className="relative h-16 w-16 overflow-hidden rounded-xl shadow-lg ring-2 ring-white/20">
                <motion.span
                  className="pointer-events-none absolute inset-0 z-20 rounded-xl border-2 border-white/20 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                />
                <ProfileAvatarImage
                  src={avatarUrl}
                  alt={profile.name}
                  fill
                  sizes="64px"
                />
              </motion.div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {firstName}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              Loading{" "}
              <span className="gradient-text">Portfolio</span>
            </h2>
          </div>

          <div className="relative h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
              animate={{ x: ["-120%", "320%"] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2.5">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.35, 1, 0.35] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
            Preparing projects, skills & insights…
          </p>
        </div>
      </motion.div>
    </div>
  );
}
