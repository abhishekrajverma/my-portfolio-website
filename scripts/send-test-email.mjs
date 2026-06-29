import { Resend } from "resend";
import nodemailer from "nodemailer";

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

const subject = "Portfolio email test";
const text = "If you can read this, email delivery is working on your portfolio site.";
const html =
  "<p>If you can read this, <strong>email delivery</strong> is working on your portfolio site.</p>";

if (usingResend) {
  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send({
    from: resendFrom,
    to: contactEmail,
    replyTo: contactEmail,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Resend test email failed:", error.message);
    process.exit(1);
  }

  console.log("Email sent successfully via Resend:", data?.id);
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
    text,
    html,
  });

  console.log("Email sent successfully via SMTP:", info.messageId);
}
