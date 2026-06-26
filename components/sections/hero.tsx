import { Download, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { siteConfig } from "@/constants/site";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";
import { ProfileAvatarImage } from "@/components/profile/profile-avatar-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroRole } from "@/components/sections/hero-role";
import { SectionAnchor } from "@/components/layout/section-anchor";
import { HeroScrollHint } from "@/components/sections/hero-scroll-hint";

const descriptionText = `${profile.tagline}. Specializing in ${profile.techStack.join(" · ")} to drive data-informed decisions.`;

export async function HeroSection() {
  const avatarUrl = await getProfileAvatarUrl();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center section-padding pt-32"
    >
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 space-y-6 lg:order-1">
            <Badge variant="glass" className="text-sm">
              Available for opportunities
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block text-foreground">Hi, I&apos;m</span>
              <span className="mt-1 block gradient-text">{profile.name}</span>
            </h1>

            <HeroRole roles={profile.typingRoles} />

            <p className="max-w-lg leading-relaxed text-muted-foreground">
              {descriptionText}
            </p>

            <div className="flex flex-wrap gap-2">
              {profile.techStack.map((tech) => (
                <Badge key={tech} variant="accent">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
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
                <SectionAnchor href="/#contact">
                  <Mail className="h-5 w-5" />
                  Contact Me
                </SectionAnchor>
              </Button>
            </div>
          </div>

          <div className="order-1 relative mx-auto w-full max-w-md lg:order-2 lg:max-w-lg">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
              <ProfileAvatarImage
                src={avatarUrl}
                alt={profile.name}
                width={500}
                height={500}
                sizes="(max-width: 1024px) 80vw, 500px"
                className="aspect-square h-full w-full"
                priority
              />
            </div>
          </div>
        </div>

        <HeroScrollHint />
      </div>
    </section>
  );
}
