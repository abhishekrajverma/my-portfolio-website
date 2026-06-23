import { NextResponse } from "next/server";
import { getBlogPostBySlug, getLatestBlogPost } from "@/data/blog";
import { isNewsletterConfigured } from "@/lib/newsletter/config";
import { notifySubscribersAboutPost } from "@/lib/newsletter/notify";

function isAuthorized(request: Request): boolean {
  const secret = process.env.NEWSLETTER_NOTIFY_SECRET?.trim();
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

export async function POST(request: Request) {
  if (!isNewsletterConfigured()) {
    return NextResponse.json(
      { error: "Newsletter is not configured yet." },
      { status: 503 }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      slug?: string;
      force?: boolean;
    };

    const post = body.slug
      ? getBlogPostBySlug(body.slug)
      : getLatestBlogPost();

    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    const result = await notifySubscribersAboutPost(post, {
      force: body.force === true,
    });

    return NextResponse.json({
      message: result.skipped
        ? "Subscribers were already notified for this post."
        : `Newsletter sent to ${result.sent} subscriber(s).`,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Notification failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
