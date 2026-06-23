import { env } from "@/lib/env";

export function getSiteUrl(): string {
  return env.siteUrl.replace(/\/$/, "");
}

export function getBlogUrl(): string {
  return `${getSiteUrl()}/blog`;
}

export function getUnsubscribeUrl(email: string): string {
  return `${getSiteUrl()}/unsubscribe?email=${encodeURIComponent(email)}`;
}

export function getBlogPostUrl(slug: string): string {
  return `${getSiteUrl()}/blog/${slug}`;
}
