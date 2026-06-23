import type { BlogPost } from "@/types";
import { sendMail } from "@/lib/mailer";
import { env } from "@/lib/env";
import { getNewsletterConfig } from "@/lib/newsletter/config";
import {
  buildNewBlogEmailHtml,
  buildNewBlogEmailText,
  buildNewsletterEmailHeaders,
} from "@/lib/newsletter/email-template";
import {
  getLastNotifiedSlug,
  setLastNotifiedSlug,
} from "@/lib/newsletter/redis";
import { getUnsubscribeUrl } from "@/lib/newsletter/urls";
import { listSubscriberEmails } from "@/lib/newsletter/subscribers";

type NotifyResult = {
  slug: string;
  title: string;
  sent: number;
  skipped: boolean;
};

export async function notifySubscribersAboutPost(
  post: BlogPost,
  options?: { force?: boolean }
): Promise<NotifyResult> {
  const config = getNewsletterConfig();
  const lastNotifiedSlug = await getLastNotifiedSlug();

  if (!options?.force && lastNotifiedSlug === post.slug) {
    return {
      slug: post.slug,
      title: post.title,
      sent: 0,
      skipped: true,
    };
  }

  const subscribers = await listSubscriberEmails();

  if (subscribers.length === 0) {
    await setLastNotifiedSlug(post.slug);
    return {
      slug: post.slug,
      title: post.title,
      sent: 0,
      skipped: false,
    };
  }

  const subject = `${config.siteName}: ${post.title}`;
  const htmlTemplate = buildNewBlogEmailHtml({
    post,
    siteName: config.siteName,
    siteUrl: config.siteUrl,
    unsubscribeUrl: `${config.siteUrl}/unsubscribe?email={EMAIL}`,
  });
  const textTemplate = buildNewBlogEmailText({
    post,
    siteName: config.siteName,
    siteUrl: config.siteUrl,
    unsubscribeUrl: `${config.siteUrl}/unsubscribe?email={EMAIL}`,
  });

  let sent = 0;

  for (const email of subscribers) {
    const unsubscribeUrl = getUnsubscribeUrl(email);

    await sendMail({
      from: config.fromEmail,
      to: email,
      replyTo: env.email,
      subject,
      html: htmlTemplate.replaceAll("{EMAIL}", encodeURIComponent(email)),
      text: textTemplate.replaceAll("{EMAIL}", encodeURIComponent(email)),
      headers: buildNewsletterEmailHeaders(unsubscribeUrl),
    });

    sent += 1;
  }

  await setLastNotifiedSlug(post.slug);

  return {
    slug: post.slug,
    title: post.title,
    sent,
    skipped: false,
  };
}
