import { Suspense } from "react";
import { UnsubscribeForm } from "@/components/layout/unsubscribe-form";

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
