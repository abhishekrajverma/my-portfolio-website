"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed.");
      }

      setStatus("success");
      setMessage(data.message || "You are subscribed.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Subscription failed."
      );
    }
  };

  return (
    <div className="space-y-3">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="your@email.com"
          aria-label="Email for newsletter"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={status === "loading"}
        />
        <Button type="submit" variant="default" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="sr-only">Subscribing</span>
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
      {message && (
        <p
          className={
            status === "error"
              ? "text-sm text-red-400"
              : "text-sm text-emerald-400"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
