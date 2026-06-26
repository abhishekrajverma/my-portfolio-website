"use client";

import { SectionLink } from "@/components/layout/section-link";
import { usePathname } from "next/navigation";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/icons/social-icons";
import { siteConfig, socialLinks } from "@/constants/site";
import { getNavLinks } from "@/constants/navigation";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { BrandAvatar } from "@/components/layout/brand-avatar";

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  mail: <Mail className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
};

const externalIcons = new Set(["linkedin", "github"]);

export function Footer({ avatarUrl }: { avatarUrl: string }) {
  const pathname = usePathname();
  const navLinks = getNavLinks(pathname);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container-custom section-padding !py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrandAvatar avatarUrl={avatarUrl} alt={siteConfig.name} size="sm" />
              <span className="font-semibold">{siteConfig.name}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Data Analyst & MIS Executive specializing in SQL Server, Power BI,
              and automated reporting for business teams in Gurgaon, Noida, and across India.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {siteConfig.location}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <SectionLink
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Connect</h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target={externalIcons.has(link.icon) ? "_blank" : undefined}
                    rel={externalIcons.has(link.icon) ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {iconMap[link.icon]}
                    {link.name}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get an email when a new data analytics article is published.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
