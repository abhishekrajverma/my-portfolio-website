import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import nodemailer from "nodemailer";

const envPath = resolve(process.cwd(), ".env.local");
const subscribersPath = resolve(process.cwd(), "data", "subscribers.json");

const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASS?.trim();
const from = process.env.SMTP_FROM?.trim();

if (!host || !user || !pass || !from) {
  console.error(
    "Missing SMTP settings. Add SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM to .env.local"
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

const transporter = nodemailer.createTransport({
  host,
  port: Number(process.env.SMTP_PORT?.trim() || "587"),
  secure: process.env.SMTP_SECURE?.trim() === "true",
  auth: { user, pass },
});

const info = await transporter.sendMail({
  from,
  to: "abhishekr359@gmail.com",
  replyTo: process.env.NEXT_PUBLIC_CONTACT_EMAIL || user,
  subject: "Your portfolio newsletter is ready",
  html: `
    <p>Hi Abhishek,</p>
    <p>Your blog newsletter now uses Nodemailer.</p>
    <ul>
      <li>Visitors subscribe from the footer on your site.</li>
      <li>After you add a new blog post, run <strong>npm run newsletter:notify</strong>.</li>
    </ul>
  `,
});

console.log("\nNewsletter setup complete.");
console.log(`NEWSLETTER_NOTIFY_SECRET=${notifySecret}`);
console.log(`Test email sent: ${info.messageId}`);
