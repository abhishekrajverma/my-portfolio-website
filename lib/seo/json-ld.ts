import { siteConfig } from "@/constants/site";
import { profile } from "@/data/profile";
import type { FAQ } from "@/types";
import { absoluteUrl } from "@/lib/seo/metadata";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    image: absoluteUrl("/my-photo.jpeg"),
    sameAs: [siteConfig.linkedin, siteConfig.github],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gurgaon",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
    knowsAbout: profile.techStack,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${siteConfig.name} — Data Analyst Portfolio`,
    description: siteConfig.description,
    url: siteConfig.url,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.role,
    },
  };
}

export function faqPageJsonLd(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function homePageJsonLd(faqs: FAQ[]) {
  return [personJsonLd(), websiteJsonLd(), profilePageJsonLd(), faqPageJsonLd(faqs)];
}

export function blogPostingJsonLd({
  title,
  description,
  slug,
  date,
  image,
  category,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image: string;
  category: string;
}) {
  const url = absoluteUrl(`/blog/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished: date,
    dateModified: date,
    image: image.startsWith("http") ? image : absoluteUrl(image),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
    articleSection: category,
    inLanguage: "en-IN",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function creativeWorkJsonLd({
  title,
  description,
  slug,
  image,
  technologies,
}: {
  title: string;
  description: string;
  slug: string;
  image: string;
  technologies: string[];
}) {
  const url = absoluteUrl(`/projects/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url,
    image: image.startsWith("http") ? image : absoluteUrl(image),
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    keywords: technologies.join(", "),
    inLanguage: "en-IN",
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
