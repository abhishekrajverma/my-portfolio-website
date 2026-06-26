import { NextResponse } from "next/server";
import {
  getContactSetupError,
  isContactBackendConfigured,
  isValidContactEmail,
  submitContactMessage,
} from "@/lib/contact/submit";

export async function POST(request: Request) {
  if (!isContactBackendConfigured()) {
    return NextResponse.json(
      { error: getContactSetupError() },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || !isValidContactEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    await submitContactMessage({ name, email, subject, message });

    return NextResponse.json({
      message: "Thanks for reaching out. I'll get back to you soon.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send message.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
