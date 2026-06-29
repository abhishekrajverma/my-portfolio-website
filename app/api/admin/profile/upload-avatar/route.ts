import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import { uploadProfileAvatar } from "@/lib/profile/storage";

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    const publicUrl = await uploadProfileAvatar(file, file.type);
    revalidateTag("profile-avatar", "max");
    revalidatePath("/");
    revalidatePath("/admin/about");

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image upload failed.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
