"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeletePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export function DeletePostDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  isDeleting = false,
}: DeletePostDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Keep the dialog open when deletion fails.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(85dvh,calc(100dvh-1.5rem))] w-[calc(100vw-1.5rem)] max-w-md flex-col gap-3 overflow-y-auto rounded-xl border-border bg-background! p-4 pr-9 shadow-xl max-sm:top-auto max-sm:bottom-3 max-sm:translate-y-0 sm:gap-5 sm:p-6 sm:pr-12">
        <DialogHeader className="space-y-1.5 text-left sm:space-y-2.5">
          <DialogTitle className="pr-3 text-left text-sm font-semibold leading-snug sm:pr-2 sm:text-lg">
            Delete blog post?
          </DialogTitle>
          <DialogDescription className="text-left text-xs leading-relaxed text-foreground/90! sm:text-sm">
            <span className="font-semibold break-words text-foreground">
              &quot;{title}&quot;
            </span>{" "}
            will be permanently removed. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex shrink-0 flex-row gap-2 sm:justify-end sm:pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 flex-1 px-3 sm:h-10 sm:flex-none sm:px-4"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 flex-1 border-red-500/50 bg-red-600 px-3 text-white shadow-none hover:bg-red-500 hover:text-white sm:h-10 sm:flex-none sm:px-4 dark:border-red-400/40 dark:bg-red-500/90 dark:hover:bg-red-500"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
