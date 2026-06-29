import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import { RESUME_CACHE_TAG } from "@/lib/resume/constants";
import { uploadResumePdf } from "@/lib/resume/storage";

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Resume must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const publicUrl = await uploadResumePdf(file, file.type || "application/pdf");
    revalidateTag(RESUME_CACHE_TAG, "max");
    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/admin/resume");

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume upload failed.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
