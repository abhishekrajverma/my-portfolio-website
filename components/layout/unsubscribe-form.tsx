"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";

export function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unsubscribe failed.");
      }

      setStatus("success");
      setMessage(data.message || "You have been unsubscribed.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Unsubscribe failed."
      );
    }
  };

  return (
    <div className="container-custom section-padding pt-32">
      <GlassCard className="mx-auto max-w-lg">
        <h1 className="text-2xl font-semibold">Unsubscribe</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stop receiving new blog post emails from this site.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="your@email.com"
            aria-label="Email to unsubscribe"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={status === "loading" || status === "success"}
          />
          <Button
            type="submit"
            variant="default"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unsubscribing...
              </>
            ) : (
              "Unsubscribe"
            )}
          </Button>
        </form>

        {message && (
          <p
            className={
              status === "error"
                ? "mt-4 text-sm text-red-400"
                : "mt-4 text-sm text-emerald-400"
            }
          >
            {message}
          </p>
        )}
      </GlassCard>
    </div>
  );
}
