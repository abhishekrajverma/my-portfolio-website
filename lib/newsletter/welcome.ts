import { env } from "@/lib/env";
import { sendMail } from "@/lib/mailer";
import { getNewsletterConfig } from "@/lib/newsletter/config";
import {
  buildNewsletterEmailHeaders,
  buildWelcomeEmailHtml,
  buildWelcomeEmailText,
  getSubscriberDisplayName,
} from "@/lib/newsletter/email-template";
import { getBlogUrl, getSiteUrl, getUnsubscribeUrl } from "@/lib/newsletter/urls";

export async function sendWelcomeEmail(email: string): Promise<void> {
  const config = getNewsletterConfig();
  const siteUrl = getSiteUrl();
  const blogUrl = getBlogUrl();
  const unsubscribeUrl = getUnsubscribeUrl(email);
  const subscriberName = getSubscriberDisplayName(email);
  const templateParams = {
    siteName: config.siteName,
    siteUrl,
    blogUrl,
    unsubscribeUrl,
    subscriberName,
    linkedinUrl: env.linkedin,
    githubUrl: env.github,
  };

  await sendMail({
    from: config.fromEmail,
    to: email,
    replyTo: env.email,
    subject: "Welcome to Analytics Club 🚀",
    html: buildWelcomeEmailHtml(templateParams),
    text: buildWelcomeEmailText(templateParams),
    headers: buildNewsletterEmailHeaders(unsubscribeUrl),
  });
}
