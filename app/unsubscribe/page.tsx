import { Suspense } from "react";
import { UnsubscribeForm } from "@/components/layout/unsubscribe-form";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Unsubscribe",
  description: "Manage your newsletter subscription preferences.",
  path: "/unsubscribe",
  noIndex: true,
});

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom section-padding pt-32 text-muted-foreground">
          Loading...
        </div>
      }
    >
      <UnsubscribeForm />
    </Suspense>
  );
}
