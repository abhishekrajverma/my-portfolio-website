import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { Resend } from "resend";

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
  null;
let resendClient: Resend | null = null;

export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      (process.env.RESEND_FROM?.trim() || process.env.SMTP_FROM?.trim())
  );
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.SMTP_FROM?.trim()
  );
}

export function isMailConfigured(): boolean {
  return isResendConfigured() || isSmtpConfigured();
}

export function getDefaultFromEmail(): string {
  return (
    process.env.RESEND_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    ""
  );
}

function requireMailEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getResendClient(): Resend {
  if (!isResendConfigured()) {
    throw new Error(
      "Resend is not configured. Add RESEND_API_KEY and RESEND_FROM to .env.local"
    );
  }

  if (!resendClient) {
    resendClient = new Resend(requireMailEnv("RESEND_API_KEY"));
  }

  return resendClient;
}

export function getMailTransporter() {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM to .env.local"
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: requireMailEnv("SMTP_HOST"),
      port: Number(process.env.SMTP_PORT?.trim() || "587"),
      secure: process.env.SMTP_SECURE?.trim() === "true",
      auth: {
        user: requireMailEnv("SMTP_USER"),
        pass: requireMailEnv("SMTP_PASS"),
      },
    });
  }

  return transporter;
}

type SendMailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  attachments?: Array<{ filename: string; content: Buffer }>;
};

async function sendViaResend({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
  headers,
  attachments,
}: SendMailParams) {
  const resend = getResendClient();
  const recipients = Array.isArray(to) ? to : [to];

  const { data, error } = await resend.emails.send({
    from: from ?? getDefaultFromEmail(),
    to: recipients,
    subject,
    html,
    text,
    replyTo,
    headers,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
    })),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { messageId: data?.id ?? "" };
}

async function sendViaSmtp({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
  headers,
  attachments,
}: SendMailParams) {
  const smtpTransporter = getMailTransporter();

  return smtpTransporter.sendMail({
    from: from ?? getDefaultFromEmail(),
    to,
    replyTo,
    subject,
    html,
    text,
    headers,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
    })),
  });
}

export async function sendMail(params: SendMailParams) {
  if (isResendConfigured()) {
    return sendViaResend(params);
  }

  return sendViaSmtp(params);
}
