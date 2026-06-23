import { NextResponse } from "next/server";
import { isNewsletterConfigured } from "@/lib/newsletter/config";
import {
  isValidEmail,
  subscribeEmail,
} from "@/lib/newsletter/subscribers";
import { ensureSubscriberStore } from "@/lib/newsletter/store";
import { sendWelcomeEmail } from "@/lib/newsletter/welcome";

export async function POST(request: Request) {
  if (!isNewsletterConfigured()) {
    return NextResponse.json(
      { error: "Newsletter is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await ensureSubscriberStore();
    const isNewSubscriber = await subscribeEmail(email);

    if (isNewSubscriber) {
      await sendWelcomeEmail(email);
    }

    return NextResponse.json({
      message: isNewSubscriber
        ? "Thanks for subscribing! Check your inbox for a welcome email."
        : "You are already subscribed. New blog posts will be emailed to you.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Subscription failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
