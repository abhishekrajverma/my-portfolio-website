import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
const secret = process.env.NEWSLETTER_NOTIFY_SECRET?.trim();
const slug = process.argv[2]?.trim();
const force = process.argv.includes("--force");

if (!secret) {
  console.error("Missing NEWSLETTER_NOTIFY_SECRET in environment.");
  process.exit(1);
}

const body = JSON.stringify({
  ...(slug ? { slug } : {}),
  ...(force ? { force: true } : {}),
});

const response = await fetch(`${siteUrl}/api/newsletter/notify`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secret}`,
  },
  body,
});

const data = await response.json();

if (!response.ok) {
  console.error(data.error || "Newsletter notify failed.");
  process.exit(1);
}

console.log(data.message);
if (data.slug) {
  console.log(`Post: ${data.title}`);
  console.log(`Slug: ${data.slug}`);
}
if (typeof data.sent === "number") {
  console.log(`Emails sent: ${data.sent}`);
}

// Show current subscribers for debugging
try {
  const subscribers = JSON.parse(
    readFileSync(resolve(process.cwd(), "data/subscribers.json"), "utf8")
  );
  console.log(`Subscribers: ${subscribers.join(", ") || "none"}`);
} catch {
  console.log("Subscribers file not found.");
}
