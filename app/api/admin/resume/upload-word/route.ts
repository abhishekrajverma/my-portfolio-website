import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import { RESUME_CACHE_TAG } from "@/lib/resume/constants";
import { uploadResumeWord } from "@/lib/resume/storage";

const WORD_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Word file is required." }, { status: 400 });
    }

    const lowerName = file.name.toLowerCase();
    const isWord =
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc") ||
      WORD_MIME_TYPES.has(file.type);

    if (!isWord) {
      return NextResponse.json(
        { error: "Only Word files (.doc or .docx) are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Resume must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const contentType =
      file.type ||
      (lowerName.endsWith(".doc")
        ? "application/msword"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    const publicUrl = await uploadResumeWord(file, contentType);
    revalidateTag(RESUME_CACHE_TAG, "max");
    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/admin/resume");

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Word upload failed.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
