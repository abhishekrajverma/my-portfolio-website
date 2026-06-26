import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  removeBlogPost,
  updateBlogPost,
  validateBlogPostInput,
} from "@/lib/blog/admin-service";
import { getBlogPostBySlug } from "@/lib/blog/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdminUser();
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load post.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdminUser();
    const { slug: previousSlug } = await params;
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
    await updateBlogPost(previousSlug, post);

    return NextResponse.json({ message: "Blog post updated.", post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdminUser();
    const { slug } = await params;
    await removeBlogPost(slug);

    return NextResponse.json({ message: "Blog post deleted." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete post.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
