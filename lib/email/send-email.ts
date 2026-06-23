import { sendMail, getDefaultFromEmail } from "@/lib/mailer";

type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
  headers,
}: SendEmailParams) {
  return sendMail({
    to,
    subject,
    html,
    text,
    from: from ?? getDefaultFromEmail(),
    replyTo,
    headers,
  });
}
