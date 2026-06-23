import nodemailer from "nodemailer";

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
  subject: "Portfolio blog update test",
  text: "If you can read this, Nodemailer is working on your portfolio site.",
  html: "<p>If you can read this, <strong>Nodemailer</strong> is working on your portfolio site.</p>",
});

console.log("Email sent successfully:", info.messageId);
