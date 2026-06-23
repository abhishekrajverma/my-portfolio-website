import { NextResponse } from "next/server";
import { isNewsletterConfigured } from "@/lib/newsletter/config";
import {
  isValidEmail,
  unsubscribeEmail,
} from "@/lib/newsletter/subscribers";

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

    await unsubscribeEmail(email);

    return NextResponse.json({
      message: "You have been unsubscribed from blog updates.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unsubscribe failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
