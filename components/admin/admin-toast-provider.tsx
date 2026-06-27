"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

type ToastState = {
  message: string;
  type: ToastType;
} | null;

const urlToastMessages: Record<string, string> = {
  deleted: "Blog post deleted successfully.",
  published: "Blog post published successfully.",
  updated: "Blog post updated successfully.",
};

const AdminToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
} | null>(null);

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }
  return context;
}

export function AdminToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<ToastState>(null);
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setVisible(true);
  }, []);

  const dismissToast = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    const message = toastKey ? urlToastMessages[toastKey] : null;

    if (!message) return;

    showToast(message, "success");

    const cleanTimer = window.setTimeout(() => {
      router.replace("/admin/blog", { scroll: false });
    }, 4300);

    return () => window.clearTimeout(cleanTimer);
  }, [searchParams, router, showToast]);

  useEffect(() => {
    if (!toast) return;

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => window.clearTimeout(hideTimer);
  }, [toast]);

  const isSuccess = toast?.type === "success";

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed bottom-4 left-4 right-4 z-[100] flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 shadow-2xl transition-all duration-300 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm",
            "bg-popover text-popover-foreground",
            isSuccess ? "border-emerald-600" : "border-red-600",
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          {isSuccess ? (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          )}
          <p className="min-w-0 flex-1 text-sm font-medium text-foreground">
            {toast.message}
          </p>
          <button
            type="button"
            onClick={dismissToast}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </AdminToastContext.Provider>
  );
}
