import { env } from "@/lib/env";

export function isNewsletterConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.SMTP_FROM?.trim()
  );
}

export function getNewsletterConfig() {
  const fromEmail = process.env.SMTP_FROM?.trim();
  if (!fromEmail) {
    throw new Error("Missing environment variable: SMTP_FROM");
  }

  return {
    fromEmail,
    siteUrl: env.siteUrl,
    siteName: env.siteName,
    notifySecret: process.env.NEWSLETTER_NOTIFY_SECRET?.trim() ?? "",
  };
}

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}
