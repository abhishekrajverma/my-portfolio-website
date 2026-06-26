import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  createBlogPost,
  validateBlogPostInput,
} from "@/lib/blog/admin-service";

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const body = (await request.json()) as {
      title?: string;
      slug?: string;
      excerpt?: string;
      category?: string;
      date?: string;
      readTime?: string;
      image?: string;
      content?: string;
    };

    const post = validateBlogPostInput(body);
    await createBlogPost(post);

    return NextResponse.json({ message: "Blog post published.", post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to publish.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
