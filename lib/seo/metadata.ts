import type { Metadata } from "next";
import { siteConfig } from "@/constants/site";
import { env } from "@/lib/env";

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveImageUrl(image?: string): string {
  const source = image ?? siteConfig.ogImage;
  return source.startsWith("http") ? source : absoluteUrl(source);
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  type = "website",
  absoluteTitle = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  absoluteTitle?: boolean;
}): Metadata {
  const url = path ? absoluteUrl(path) : siteConfig.url;
  const resolvedTitle = title ?? siteConfig.title;
  const resolvedDescription = description ?? siteConfig.description;
  const ogImage = resolveImageUrl(image);

  const metadata: Metadata = {
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: "en_IN",
      url,
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
  };

  if (noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  if (env.googleSiteVerification) {
    metadata.verification = {
      google: env.googleSiteVerification,
    };
  }

  if (title) {
    metadata.title = absoluteTitle ? { absolute: title } : title;
  }

  return metadata;
}
