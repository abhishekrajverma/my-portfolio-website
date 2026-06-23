import type { BlogPost } from "@/types";
import { getBlogPostUrl } from "@/lib/newsletter/urls";

type NewBlogEmailParams = {
  post: BlogPost;
  siteName: string;
  siteUrl: string;
  unsubscribeUrl: string;
};

function buildEmailButton(label: string, href: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td align="center" bgcolor="#3b82f6" style="border-radius:999px;">
      <a
        href="${href}"
        target="_blank"
        rel="noopener noreferrer"
        style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;border-radius:999px;"
      >
        ${label}
      </a>
    </td>
  </tr>
</table>
  `.trim();
}

export function buildNewBlogEmailHtml({
  post,
  siteName,
  siteUrl,
  unsubscribeUrl,
}: NewBlogEmailParams): string {
  const postUrl = getBlogPostUrl(post.slug);

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:24px 20px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;font-size:14px;color:#4b5563;">
            New article from ${siteName}
          </p>
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#111827;">
            ${post.title}
          </h1>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#374151;">
            ${post.excerpt}
          </p>
          <p style="margin:0 0 24px;">
            <a href="${postUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">
              Read the full article
            </a>
          </p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
            You subscribed to blog updates from ${siteName}.
            <a href="${unsubscribeUrl}" style="color:#2563eb;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export function buildNewBlogEmailText({
  post,
  siteName,
  siteUrl,
  unsubscribeUrl,
}: NewBlogEmailParams): string {
  const postUrl = getBlogPostUrl(post.slug);

  return [
    `New article from ${siteName}`,
    "",
    post.title,
    "",
    post.excerpt,
    "",
    `Read the full article: ${postUrl}`,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}

export function buildNewsletterEmailHeaders(unsubscribeUrl: string) {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

type WelcomeEmailParams = {
  siteName: string;
  blogUrl: string;
  unsubscribeUrl: string;
};

export function buildWelcomeEmailHtml({
  siteName,
  blogUrl,
  unsubscribeUrl,
}: WelcomeEmailParams): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#020617;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f172a;border:1px solid #1e293b;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="height:4px;background:linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4);font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px 28px 8px;">
                <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#60a5fa;font-weight:700;">
                  Welcome aboard
                </p>
                <h1 style="margin:0;font-size:28px;line-height:1.25;color:#f8fafc;font-weight:700;">
                  Thanks for subscribing
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0;">
                <p style="margin:0;font-size:16px;line-height:1.7;color:#cbd5e1;">
                  You are now on the list for data analytics articles, SQL tips, Power BI insights, and MIS reporting guides from <strong style="color:#f8fafc;">${siteName}</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border:1px solid #1f2937;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">
                        What you will get
                      </p>
                      <p style="margin:0;font-size:15px;line-height:1.7;color:#e2e8f0;">
                        • New blog posts delivered to your inbox<br />
                        • Practical analytics tutorials<br />
                        • Dashboard and reporting best practices
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;" align="center">
                ${buildEmailButton("Explore the blog", blogUrl)}
                <p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#94a3b8;text-align:center;">
                  Or open:
                  <a href="${blogUrl}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;word-break:break-all;">
                    ${blogUrl}
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 28px 28px;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;text-align:center;">
                  You can unsubscribe anytime.
                  <a href="${unsubscribeUrl}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;">Unsubscribe</a>
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#475569;text-align:center;">
            © ${siteName}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export function buildWelcomeEmailText({
  siteName,
  blogUrl,
  unsubscribeUrl,
}: WelcomeEmailParams): string {
  return [
    `Thanks for subscribing to ${siteName}!`,
    "",
    "You will receive new blog posts about data analytics, SQL, Power BI, and MIS reporting.",
    "",
    `Explore the blog: ${blogUrl}`,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}
