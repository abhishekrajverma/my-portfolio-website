import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminToastProvider } from "@/components/admin/admin-toast-provider";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";

export const metadata: Metadata = {
  title: "Blog Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminToastProvider>
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </AdminToastProvider>
  );
}
