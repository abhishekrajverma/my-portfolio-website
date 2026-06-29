"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { BLOG_POST_CATEGORIES } from "@/constants/blog";
import {
  estimateReadTime,
  slugifyTitle,
} from "@/lib/blog/helpers";
import type { BlogPost } from "@/types";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { DeletePostDialog } from "@/components/admin/delete-post-dialog";
import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { ProseContent } from "@/components/blog/prose-content";

interface BlogEditorProps {
  mode: "create" | "edit";
  initialPost?: BlogPost;
}

export function BlogEditor({ mode, initialPost }: BlogEditorProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [category, setCategory] = useState<BlogPost["category"]>(
    initialPost?.category ?? "SQL"
  );
  const [date, setDate] = useState(
    initialPost?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [image, setImage] = useState(initialPost?.image ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [previewHtml, setPreviewHtml] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const readTime = useMemo(() => estimateReadTime(content), [content]);

  useEffect(() => {
    if (!slugTouched && mode === "create") {
      setSlug(slugifyTitle(title));
    }
  }, [title, slugTouched, mode]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!content.trim()) {
        setPreviewHtml("");
        return;
      }

      try {
        const response = await fetch("/api/admin/blog/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const data = (await response.json()) as { html?: string };
        setPreviewHtml(data.html ?? "");
      } catch {
        setPreviewHtml("");
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [content]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/blog/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      setImage(data.url ?? "");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const payload = {
      title,
      slug,
      excerpt,
      category,
      date,
      readTime,
      image,
      content,
    };

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/blog"
          : `/api/admin/blog/${initialPost?.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save blog post.");
      }

      router.push(
        mode === "create"
          ? "/admin/blog?toast=published"
          : "/admin/blog?toast=updated"
      );
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save blog post."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "edit" || !initialPost) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/blog/${initialPost.slug}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog post.");
      }

      router.push("/admin/blog?toast=deleted");
      router.refresh();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete blog post.";
      setError(message);
      showToast(message, "error");
      throw deleteError;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminShell
      studio="blog"
      title={mode === "create" ? "Create Post" : "Edit Post"}
      description="Write in Markdown, upload a cover image, and publish without touching code."
      breadcrumb={
        <AdminBreadcrumb
          items={[
            { label: "Blog Studio", href: "/admin/blog" },
            { label: "All Posts", href: "/admin/blog" },
            {
              label:
                mode === "create"
                  ? "New Post"
                  : initialPost?.title || "Edit Post",
            },
          ]}
        />
      }
      action={
        <Button
          type="submit"
          form="blog-editor-form"
          disabled={isSaving || isUploading}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </Button>
      }
    >
      <form id="blog-editor-form" onSubmit={handleSubmit} className="space-y-6">
        <GlassCard className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="How to build a KPI dashboard in Power BI"
              className="text-lg"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                placeholder="power-bi-kpi-dashboard"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as BlogPost["category"])
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {BLOG_POST_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Publish date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Estimated read time</Label>
              <Input value={readTime} readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Short description</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="A quick summary that appears on the blog cards."
              rows={3}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="image">Cover image</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="image"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://..."
                required
              />
              <Button type="button" variant="outline" disabled={isUploading} asChild>
                <label className="cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </Button>
            </div>
            {image ? (
              <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-border">
                <Image src={image} alt="Cover preview" fill className="object-cover" />
              </div>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard>
          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write" className="mt-4">
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="## Introduction&#10;&#10;Write your article in Markdown..."
                rows={18}
                className="min-h-[420px] font-mono text-sm"
                required
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
              <div className="min-h-[420px] rounded-xl border border-border bg-muted/20 p-6">
                {previewHtml ? (
                  <ProseContent className="prose-medium" html={previewHtml} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Start writing to see a live preview.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </GlassCard>

        {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {mode === "edit" ? (
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-400/40 text-red-400 hover:bg-red-400/10 sm:w-auto"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete post
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            className="w-full sm:ml-auto sm:w-auto"
            disabled={isSaving || isUploading}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </form>

      {mode === "edit" && initialPost ? (
        <DeletePostDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={initialPost.title}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      ) : null}
    </AdminShell>
  );
}
