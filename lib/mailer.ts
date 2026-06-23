import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
  null;

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.SMTP_FROM?.trim()
  );
}

export function getDefaultFromEmail(): string {
  return process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || "";
}

function requireMailEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getMailTransporter() {
  if (!isMailConfigured()) {
    throw new Error(
      "Email is not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM to .env.local"
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
};

export async function sendMail({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
  headers,
}: SendMailParams) {
  const transporter = getMailTransporter();

  const info = await transporter.sendMail({
    from: from ?? getDefaultFromEmail(),
    to,
    replyTo,
    subject,
    html,
    text,
    headers,
  });

  return info;
}
