import { env } from "@/lib/env";
import { getDefaultFromEmail, isMailConfigured } from "@/lib/mailer";
import { isBlobStorageConfigured } from "@/lib/newsletter/blob-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function isNewsletterConfigured(): boolean {
  return isMailConfigured();
}

export function getNewsletterSetupError(): string {
  if (isMailConfigured()) {
    return "";
  }

  if (process.env.VERCEL) {
    return "Newsletter email is not set up on Vercel. Add RESEND_API_KEY and RESEND_FROM (or SMTP settings) in Project Settings → Environment Variables, then redeploy.";
  }

  return "Newsletter is not configured yet. Add RESEND_API_KEY and RESEND_FROM to .env.local.";
}

export function isSubscriberStorageConfigured(): boolean {
  return (
    isSupabaseConfigured() ||
    isRedisConfigured() ||
    isBlobStorageConfigured() ||
    !process.env.VERCEL
  );
}

export function getSubscriberStorageError(): string {
  if (isSubscriberStorageConfigured()) {
    return "";
  }

  return "Subscriber storage is not set up on Vercel. Add Supabase, Vercel Blob, or Upstash Redis, then redeploy.";
}

export function getNewsletterConfig() {
  const fromEmail = getDefaultFromEmail();
  if (!fromEmail) {
    throw new Error("Missing RESEND_FROM or SMTP_FROM");
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
