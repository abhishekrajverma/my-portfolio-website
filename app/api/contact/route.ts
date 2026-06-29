import { NextResponse } from "next/server";
import {
  getContactSetupError,
  hasContactMessageOrJd,
  isContactBackendConfigured,
  isValidContactEmail,
  isValidContactPhone,
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
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const jdEntry = formData.get("jd");
    const jdFile = jdEntry instanceof File && jdEntry.size > 0 ? jdEntry : null;

    if (!name) {
      return NextResponse.json(
        { error: "Please enter the contact person's name." },
        { status: 400 }
      );
    }

    if (!email || !isValidContactEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid professional email address." },
        { status: 400 }
      );
    }

    if (!isValidContactPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid contact number." },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Please enter a subject for your inquiry." },
        { status: 400 }
      );
    }

    if (!hasContactMessageOrJd(message, jdFile)) {
      return NextResponse.json(
        {
          error:
            "Please attach a job description document or provide a detailed role summary in your message.",
        },
        { status: 400 }
      );
    }

    await submitContactMessage({
      name,
      email,
      phone,
      subject,
      message,
      jdFile,
    });

    return NextResponse.json({
      message:
        "Thank you for your inquiry. A confirmation has been sent to your email.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to submit your inquiry. Please try again.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
