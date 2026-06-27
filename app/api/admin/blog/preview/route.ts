import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import { markdownToHtml } from "@/lib/blog";

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as { content?: string };
    const content = body.content ?? "";
    const html = await markdownToHtml(content);

    return NextResponse.json({ html });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Preview failed.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
