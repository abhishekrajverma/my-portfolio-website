import { remark } from "remark";
import html from "remark-html";
import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as { content?: string };
    const content = body.content ?? "";
    const result = await remark().use(html).process(content);

    return NextResponse.json({ html: result.toString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Preview failed.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
