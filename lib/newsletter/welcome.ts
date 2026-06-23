import { env } from "@/lib/env";
import { sendMail } from "@/lib/mailer";
import { getNewsletterConfig } from "@/lib/newsletter/config";
import {
  buildNewsletterEmailHeaders,
  buildWelcomeEmailHtml,
  buildWelcomeEmailText,
} from "@/lib/newsletter/email-template";
import { getBlogUrl, getUnsubscribeUrl } from "@/lib/newsletter/urls";

export async function sendWelcomeEmail(email: string): Promise<void> {
  const config = getNewsletterConfig();
  const blogUrl = getBlogUrl();
  const unsubscribeUrl = getUnsubscribeUrl(email);

  await sendMail({
    from: config.fromEmail,
    to: email,
    replyTo: env.email,
    subject: `Welcome to ${config.siteName} — you're subscribed`,
    html: buildWelcomeEmailHtml({
      siteName: config.siteName,
      blogUrl,
      unsubscribeUrl,
    }),
    text: buildWelcomeEmailText({
      siteName: config.siteName,
      blogUrl,
      unsubscribeUrl,
    }),
    headers: buildNewsletterEmailHeaders(unsubscribeUrl),
  });
}
