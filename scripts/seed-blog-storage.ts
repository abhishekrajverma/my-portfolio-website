import { blogPosts } from "@/data/blog";
import { toBlogPostSummary } from "@/lib/blog/helpers";
import {
  ensureBlogStorageBucket,
  uploadBlogManifestToStorage,
  uploadBlogPostToStorage,
} from "@/lib/blog/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";

async function main() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local."
    );
  }

  const manifest = blogPosts.map(toBlogPostSummary);

  console.log(`Uploading ${blogPosts.length} blog post(s) to Supabase Storage...`);

  await ensureBlogStorageBucket();

  for (const post of blogPosts) {
    await uploadBlogPostToStorage(post);
    console.log(`  ✓ posts/${post.slug}.json`);
  }

  await uploadBlogManifestToStorage(manifest);
  console.log("  ✓ manifest.json");
  console.log("\nBlog storage seed complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
