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
    <Suspense fallback={<PageSkeleton />}>
      <AdminToastProvider>{children}</AdminToastProvider>
    </Suspense>
  );
}
