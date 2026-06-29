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
  siteUrl: string;
  blogUrl: string;
  unsubscribeUrl: string;
  subscriberName: string;
  linkedinUrl: string;
  githubUrl: string;
};

export function buildWelcomeEmailHtml({
  siteName,
  siteUrl,
  blogUrl,
  unsubscribeUrl,
  subscriberName,
  linkedinUrl,
  githubUrl,
}: WelcomeEmailParams): string {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta
      content="telephone=no,address=no,email=no,date=no,url=no"
      name="format-detection" />
    <style>
      @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
    </style>
    <style>
      body{margin:0;background:#0b1120;font-family:Arial,sans-serif;color:#e5e7eb}
      .wrapper{max-width:640px;margin:40px auto;background:#111827;border:1px solid #24324a;border-radius:20px;overflow:hidden}
      .hero{padding:48px;background:linear-gradient(135deg,#2563eb,#7c3aed);text-align:center}
      .hero h1{margin:0;font-size:36px;color:#fff}
      .hero p{color:#e5e7eb;font-size:18px}
      .content{padding:40px}
      .card{background:#1f2937;border:1px solid #334155;border-radius:14px;padding:18px;margin:16px 0}
      .card h3{margin:0 0 8px;color:#fff}
      .card p{margin:0;color:#cbd5e1;line-height:1.6}
      .btn{display:inline-block;margin:30px 0;padding:16px 34px;background:#2563eb;color:#fff;text-decoration:none;border-radius:999px;font-weight:bold}
      .footer{padding:30px;text-align:center;color:#94a3b8;font-size:13px;border-top:1px solid #24324a}
      .social a{color:#60a5fa;text-decoration:none;margin:0 10px}
    </style>
  </head>
  <body dir="ltr" lang="en" style="background-color:#0b1120">
    <table
      border="0"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      align="center">
      <tbody>
        <tr>
          <td dir="ltr" lang="en" style="background-color:#0b1120;padding:24px 12px;">
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:640px;width:100%;">
              <tbody>
                <tr>
                  <td style="padding:0;">
                    <div class="wrapper">
                      <div class="hero">
                        <p style="margin:0 0 12px;font-size:14px;letter-spacing:3px;text-transform:uppercase;color:#e5e7eb;">
                          WELCOME TO
                        </p>
                        <h1 style="margin:0 0 12px;font-size:36px;color:#fff;">
                          Analytics Club 🚀
                        </h1>
                        <p style="margin:0;font-size:18px;color:#e5e7eb;">
                          Practical SQL, Power BI, Excel &amp; Python tutorials delivered to your inbox.
                        </p>
                      </div>
                      <div class="content">
                        <h2 style="margin:0 0 16px;color:#fff;font-size:24px;">
                          Hi ${subscriberName},
                        </h2>
                        <p style="margin:0 0 24px;color:#cbd5e1;font-size:16px;line-height:1.8;">
                          Thanks for subscribing! You&apos;ll receive practical, real-world data analytics content,
                          project ideas, interview preparation, dashboards, and free resources.
                        </p>
                        <p style="margin:0 0 24px;text-align:center;">
                          <a
                            href="${siteUrl}"
                            class="btn"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="display:inline-block;padding:16px 34px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:bold;">
                            Start Learning →
                          </a>
                        </p>
                        <div class="card">
                          <h3>📊 SQL Interview Questions</h3>
                          <p>
                            Master Joins, CTEs, Window Functions, Stored Procedures and advanced SQL.
                          </p>
                        </div>
                        <div class="card">
                          <h3>📈 Power BI Dashboards</h3>
                          <p>
                            Create interactive dashboards with DAX, Power Query and business KPIs.
                          </p>
                        </div>
                        <div class="card">
                          <h3>🐍 Python for Analytics</h3>
                          <p>
                            Learn Pandas, NumPy, Matplotlib and automation projects.
                          </p>
                        </div>
                        <div class="card">
                          <h3>📚 Free Resources</h3>
                          <p>
                            Templates, datasets, cheat sheets and portfolio projects.
                          </p>
                        </div>
                        <p style="margin:24px 0 0;text-align:center;">
                          <a
                            href="${blogUrl}"
                            class="btn"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="display:inline-block;padding:16px 34px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:bold;">
                            Explore the Blog
                          </a>
                        </p>
                      </div>
                      <div class="footer">
                        <p style="margin:0 0 16px;">
                          <strong>${siteName}</strong><br />
                          Data Analyst • SQL Server • Power BI
                        </p>
                        <div class="social">
                          <a href="${siteUrl}" target="_blank" rel="noopener noreferrer">Portfolio</a>
                          |
                          <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>
                          |
                          <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </div>
                        <p style="margin:20px 0 0;">
                          You&apos;re receiving this because you subscribed on my website.<br />
                          <a href="${unsubscribeUrl}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">
                            Unsubscribe
                          </a>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
  `.trim();
}

export function buildWelcomeEmailText({
  siteName,
  siteUrl,
  blogUrl,
  unsubscribeUrl,
  subscriberName,
}: WelcomeEmailParams): string {
  return [
    `Welcome to Analytics Club 🚀`,
    "",
    `Hi ${subscriberName},`,
    "",
    `Thanks for subscribing to ${siteName}!`,
    "You'll receive practical data analytics content, project ideas, interview prep, dashboards, and free resources.",
    "",
    `Start learning: ${siteUrl}`,
    `Explore the blog: ${blogUrl}`,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}

export function getSubscriberDisplayName(email: string): string {
  const localPart = email.split("@")[0]?.trim();
  if (!localPart) return "there";

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
