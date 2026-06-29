import type { ComponentType } from "react";
import { Globe, Link2, type LucideProps } from "lucide-react";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  YouTubeIcon,
} from "@/components/icons/social-icons";
import type { SocialPlatform } from "@/lib/content/types";
import { SOCIAL_PLATFORMS } from "@/lib/content/constants";

type SocialIconComponent = ComponentType<{ className?: string }>;

const socialIconMap: Record<SocialPlatform, SocialIconComponent> = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
  website: Globe,
  other: Link2,
};

export function getSocialPlatformLabel(platform: SocialPlatform): string {
  return SOCIAL_PLATFORMS.find((item) => item.value === platform)?.label ?? "Link";
}

export function getSocialLinkIcon(platform: SocialPlatform): SocialIconComponent {
  return socialIconMap[platform] ?? Link2;
}
