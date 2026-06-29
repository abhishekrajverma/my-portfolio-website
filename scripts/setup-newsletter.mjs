import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const envPath = resolve(process.cwd(), ".env.local");
const subscribersPath = resolve(process.cwd(), "data", "subscribers.json");

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resendFrom =
  process.env.RESEND_FROM?.trim() || process.env.SMTP_FROM?.trim();
const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASS?.trim();
const smtpFrom = process.env.SMTP_FROM?.trim();
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "abhishekr359@gmail.com";

const usingResend = Boolean(resendApiKey && resendFrom);
const usingSmtp = Boolean(host && user && pass && smtpFrom);

if (!usingResend && !usingSmtp) {
  console.error(
    "Missing email settings. Add RESEND_API_KEY and RESEND_FROM, or SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM to .env.local"
  );
  process.exit(1);
}

const notifySecret =
  process.env.NEWSLETTER_NOTIFY_SECRET?.trim() ||
  randomBytes(24).toString("hex");

let envContent = readFileSync(envPath, "utf8");

function upsertEnv(key, value) {
  const pattern = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}=${value}`;

  if (pattern.test(envContent)) {
    envContent = envContent.replace(pattern, line);
  } else {
    envContent += `\n${line}`;
  }
}

upsertEnv("NEWSLETTER_NOTIFY_SECRET", notifySecret);
writeFileSync(envPath, envContent.trimEnd() + "\n", "utf8");

try {
  await access(subscribersPath);
} catch {
  await mkdir(resolve(process.cwd(), "data"), { recursive: true });
  await writeFile(subscribersPath, "[]\n", "utf8");
}

const subject = "Your portfolio newsletter is ready";
const html = `
  <p>Hi Abhishek,</p>
  <p>Your blog newsletter is now wired up for email delivery.</p>
  <ul>
    <li>Visitors subscribe from the footer on your site.</li>
    <li>New subscribers receive a welcome email automatically.</li>
    <li>After you add a new blog post, run <strong>npm run newsletter:notify</strong>.</li>
  </ul>
`;

let messageId = "";

if (usingResend) {
  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send({
    from: resendFrom,
    to: contactEmail,
    replyTo: contactEmail,
    subject,
    html,
  });

  if (error) {
    console.error("Resend test email failed:", error.message);
    process.exit(1);
  }

  messageId = data?.id ?? "";
} else {
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT?.trim() || "587"),
    secure: process.env.SMTP_SECURE?.trim() === "true",
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: smtpFrom,
    to: contactEmail,
    replyTo: contactEmail,
    subject,
    html,
  });

  messageId = info.messageId;
}

console.log("\nNewsletter setup complete.");
console.log(`Provider: ${usingResend ? "Resend" : "SMTP"}`);
console.log(`NEWSLETTER_NOTIFY_SECRET=${notifySecret}`);
console.log(`Test email sent: ${messageId}`);
