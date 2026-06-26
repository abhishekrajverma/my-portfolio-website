import { env } from "@/lib/env";
import { isMailConfigured, sendMail } from "@/lib/mailer";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function isValidContactEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim().toLowerCase());
}

export function isContactBackendConfigured(): boolean {
  return isSupabaseConfigured() || isMailConfigured();
}

export function getContactSetupError(): string {
  if (isContactBackendConfigured()) {
    return "";
  }

  if (process.env.VERCEL) {
    return "Contact form is not set up on Vercel. Add Supabase credentials or SMTP settings, then redeploy.";
  }

  return "Contact form is not configured yet. Add Supabase or SMTP settings to .env.local.";
}

async function saveContactMessage(data: ContactSubmission): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("contact_messages").insert({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim(),
    message: data.message.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function notifyOwnerByEmail(data: ContactSubmission): Promise<void> {
  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br />")}</p>
  `;

  await sendMail({
    to: env.email,
    subject: `[Portfolio] ${data.subject}`,
    html,
    text: [
      "New contact form message",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Subject: ${data.subject}`,
      "",
      data.message,
    ].join("\n"),
    replyTo: data.email.trim(),
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function submitContactMessage(
  data: ContactSubmission
): Promise<void> {
  if (isSupabaseConfigured()) {
    await saveContactMessage(data);
  }

  if (isMailConfigured()) {
    await notifyOwnerByEmail(data);
  }
}
