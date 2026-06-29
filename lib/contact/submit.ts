import { env } from "@/lib/env";
import {
  buildContactAcknowledgmentHtml,
  buildContactAcknowledgmentText,
  buildContactNotificationHtml,
  buildContactNotificationText,
} from "@/lib/contact/email-template";
import { getContactJdValidationError, uploadContactJd } from "@/lib/contact/jd";
import { getDefaultFromEmail, isMailConfigured, sendMail } from "@/lib/mailer";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactSubmissionInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  jdFile?: File | null;
};

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  jdFileUrl: string | null;
  jdFileName: string | null;
  jdAttachment: { filename: string; content: Buffer } | null;
};

const PHONE_PATTERN = /^[+]?[\d\s().-]{8,}$/;

export function isValidContactPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return true;
  return PHONE_PATTERN.test(trimmed);
}

export function isValidContactEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim().toLowerCase());
}

export function hasContactMessageOrJd(message: string, jdFile?: File | null): boolean {
  return Boolean(message.trim() || jdFile);
}

export function isContactBackendConfigured(): boolean {
  return isSupabaseConfigured() || isMailConfigured();
}

export function getContactSetupError(): string {
  if (isContactBackendConfigured()) {
    return "";
  }

  if (process.env.VERCEL) {
    return "Contact form is not set up on Vercel. Add Resend (RESEND_API_KEY, RESEND_FROM), Supabase credentials, or SMTP settings, then redeploy.";
  }

  return "Contact form is not configured yet. Add Resend, Supabase, or SMTP settings to .env.local.";
}

async function resolveJdDetails(
  jdFile?: File | null
): Promise<Pick<ContactSubmission, "jdFileUrl" | "jdFileName" | "jdAttachment">> {
  if (!jdFile) {
    return { jdFileUrl: null, jdFileName: null, jdAttachment: null };
  }

  const validationError = getContactJdValidationError(jdFile);
  if (validationError) {
    throw new Error(validationError);
  }

  const buffer = Buffer.from(await jdFile.arrayBuffer());
  const attachment = {
    filename: jdFile.name,
    content: buffer,
  };

  if (isSupabaseConfigured()) {
    const uploaded = await uploadContactJd(jdFile);
    return {
      jdFileUrl: uploaded.url,
      jdFileName: uploaded.fileName,
      jdAttachment: attachment,
    };
  }

  return {
    jdFileUrl: null,
    jdFileName: jdFile.name,
    jdAttachment: attachment,
  };
}

function buildStoredMessage(message: string, jdFileName: string | null): string {
  const trimmed = message.trim();
  if (trimmed) return trimmed;
  if (jdFileName) {
    return `Job description attached: ${jdFileName}`;
  }
  return "";
}

async function saveContactMessage(data: ContactSubmission): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("contact_messages").insert({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim() || null,
    subject: data.subject.trim(),
    message: data.message.trim(),
    jd_url: data.jdFileUrl,
    jd_file_name: data.jdFileName,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function notifyOwnerByEmail(data: ContactSubmission): Promise<void> {
  const templateParams = {
    ...data,
    siteName: env.siteName,
    siteUrl: env.siteUrl,
  };

  await sendMail({
    to: env.email,
    subject: `New message from ${data.name} — ${data.subject}`,
    html: buildContactNotificationHtml(templateParams),
    text: buildContactNotificationText(templateParams),
    replyTo: data.email.trim(),
    attachments: data.jdAttachment ? [data.jdAttachment] : undefined,
  });
}

async function sendAcknowledgmentToSubmitter(data: ContactSubmission): Promise<void> {
  const acknowledgmentParams = {
    name: data.name,
    subject: data.subject,
    siteName: env.siteName,
    siteUrl: env.siteUrl,
    contactEmail: env.email,
    contactPhone: env.phone,
    linkedinUrl: env.linkedin,
    jdFileName: data.jdFileName,
  };

  await sendMail({
    from: getDefaultFromEmail(),
    to: data.email.trim(),
    replyTo: env.email,
    subject: `Message received — thank you for reaching out`,
    html: buildContactAcknowledgmentHtml(acknowledgmentParams),
    text: buildContactAcknowledgmentText(acknowledgmentParams),
  });
}

export async function submitContactMessage(
  input: ContactSubmissionInput
): Promise<void> {
  if (!hasContactMessageOrJd(input.message, input.jdFile)) {
    throw new Error(
      "Please attach a job description document or provide a detailed role summary in your message."
    );
  }

  const jdDetails = await resolveJdDetails(input.jdFile);
  const data: ContactSubmission = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    subject: input.subject.trim(),
    message: buildStoredMessage(input.message, jdDetails.jdFileName),
    ...jdDetails,
  };

  if (isSupabaseConfigured()) {
    await saveContactMessage(data);
  }

  if (isMailConfigured()) {
    await Promise.all([
      notifyOwnerByEmail(data),
      sendAcknowledgmentToSubmitter(data),
    ]);
  }
}
