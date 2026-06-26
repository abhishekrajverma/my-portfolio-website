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
            "fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur transition-all duration-300",
            isSuccess
              ? "border-emerald-400/30 bg-emerald-500/10"
              : "border-red-400/30 bg-red-500/10",
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          {isSuccess ? (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          )}
          <p
            className={cn(
              "text-sm",
              isSuccess ? "text-emerald-50" : "text-red-50"
            )}
          >
            {toast.message}
          </p>
          <button
            type="button"
            onClick={dismissToast}
            className={cn(
              "ml-auto transition-colors",
              isSuccess
                ? "text-emerald-200/80 hover:text-emerald-50"
                : "text-red-200/80 hover:text-red-50"
            )}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </AdminToastContext.Provider>
  );
}
