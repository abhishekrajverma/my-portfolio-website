"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { DeletePostDialog } from "@/components/admin/delete-post-dialog";
import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";

interface AdminProjectActionsProps {
  slug: string;
  title: string;
}

export function AdminProjectActions({ slug, title }: AdminProjectActionsProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/projects/${slug}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete project.");
      }

      router.push("/admin/projects?toast=deleted");
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to delete project.",
        "error"
      );
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid w-full shrink-0 grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:w-[300px]">
        <Button
          variant="outline"
          size="sm"
          className="w-full min-[420px]:min-w-[80px]"
          asChild
        >
          <Link href={`/projects/${slug}`} target="_blank">
            View
          </Link>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full min-[420px]:min-w-[80px] border-red-400/40 text-red-400 hover:bg-red-400/10"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete
        </Button>

        <Button size="sm" className="w-full min-[420px]:min-w-[80px]" asChild>
          <Link href={`/admin/projects/${slug}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <DeletePostDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={title}
        entityLabel="project"
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
