import { env } from "@/lib/env";
import { isBlobStorageConfigured } from "@/lib/newsletter/blob-store";

function hasSmtpConfig(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.SMTP_FROM?.trim()
  );
}

export function isNewsletterConfigured(): boolean {
  return hasSmtpConfig();
}

export function getNewsletterSetupError(): string {
  if (hasSmtpConfig()) {
    return "";
  }

  if (process.env.VERCEL) {
    return "Newsletter email is not set up on Vercel. Add SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM in Project Settings → Environment Variables, then redeploy.";
  }

  return "Newsletter is not configured yet. Add SMTP settings to .env.local.";
}

export function isSubscriberStorageConfigured(): boolean {
  return isRedisConfigured() || isBlobStorageConfigured() || !process.env.VERCEL;
}

export function getSubscriberStorageError(): string {
  if (isSubscriberStorageConfigured()) {
    return "";
  }

  return "Subscriber storage is not set up on Vercel. Add Vercel Blob or Upstash Redis, then redeploy.";
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
    (process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()) ||
      (process.env.KV_REST_API_URL?.trim() &&
        process.env.KV_REST_API_TOKEN?.trim())
  );
}
