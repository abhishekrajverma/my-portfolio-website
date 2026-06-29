import { siteConfig } from "@/constants/site";
import type { ContactContent, SocialLink } from "@/lib/content/types";

type LegacyContactContent = ContactContent & {
  linkedinDisplay?: string;
  linkedinUrl?: string;
};

export function createEmptySocialLink(): SocialLink {
  return {
    id: `social-${Date.now()}`,
    platform: "linkedin",
    label: "",
    url: "",
  };
}

export function getDefaultSocialLinks(): SocialLink[] {
  return [
    {
      id: "linkedin",
      platform: "linkedin",
      label: "linkedin.com/in/abhishekrajverma",
      url: siteConfig.linkedin,
    },
    {
      id: "github",
      platform: "github",
      label: "github.com/abhishekrajverma",
      url: siteConfig.github,
    },
  ];
}

export function normalizeContactContent(stored: LegacyContactContent): ContactContent {
  const {
    linkedinDisplay,
    linkedinUrl,
    socialLinks,
    ...rest
  } = stored;

  let normalizedLinks = socialLinks?.length ? [...socialLinks] : [];

  if (normalizedLinks.length === 0 && linkedinUrl) {
    normalizedLinks.push({
      id: "linkedin",
      platform: "linkedin",
      label: linkedinDisplay || linkedinUrl,
      url: linkedinUrl,
    });
  }

  if (normalizedLinks.length === 0) {
    normalizedLinks = getDefaultSocialLinks();
  }

  return {
    ...rest,
    socialLinks: normalizedLinks,
  };
}

export function sanitizeSocialLinksForSave(links: SocialLink[]): SocialLink[] {
  return links.filter((link) => link.label.trim() && link.url.trim());
}
