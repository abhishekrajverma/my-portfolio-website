import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  getAdminAboutContent,
  getAdminCertifications,
  getAdminContactContent,
  getAdminFaqs,
  getAdminSkills,
  getAdminTestimonials,
} from "@/lib/content/repository";
import {
  saveAboutContent,
  saveCertifications,
  saveContactContent,
  saveFaqs,
  saveSkills,
  saveTestimonials,
} from "@/lib/content/admin-service";

const sections = new Set([
  "skills",
  "certifications",
  "testimonials",
  "faqs",
  "about",
  "contact",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    await requireAdminUser();
    const { section } = await params;

    if (!sections.has(section)) {
      return NextResponse.json({ error: "Unknown section." }, { status: 404 });
    }

    switch (section) {
      case "skills":
        return NextResponse.json({ items: await getAdminSkills() });
      case "certifications":
        return NextResponse.json({ items: await getAdminCertifications() });
      case "testimonials":
        return NextResponse.json({ items: await getAdminTestimonials() });
      case "faqs":
        return NextResponse.json({ items: await getAdminFaqs() });
      case "about":
        return NextResponse.json({ content: await getAdminAboutContent() });
      case "contact":
        return NextResponse.json({ content: await getAdminContactContent() });
      default:
        return NextResponse.json({ error: "Unknown section." }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load content.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    await requireAdminUser();
    const { section } = await params;
    const body = await request.json();

    if (!sections.has(section)) {
      return NextResponse.json({ error: "Unknown section." }, { status: 404 });
    }

    switch (section) {
      case "skills":
        await saveSkills(body.items);
        return NextResponse.json({ message: "Skills saved." });
      case "certifications":
        await saveCertifications(body.items);
        return NextResponse.json({ message: "Certifications saved." });
      case "testimonials":
        await saveTestimonials(body.items);
        return NextResponse.json({ message: "Testimonials saved." });
      case "faqs":
        await saveFaqs(body.items);
        return NextResponse.json({ message: "FAQs saved." });
      case "about":
        await saveAboutContent(body.content);
        return NextResponse.json({ message: "About section saved." });
      case "contact":
        await saveContactContent(body.content);
        return NextResponse.json({ message: "Contact section saved." });
      default:
        return NextResponse.json({ error: "Unknown section." }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save content.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
