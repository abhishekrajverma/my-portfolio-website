"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

type ProseContentProps = {
  html: string;
  className?: string;
};

export function ProseContent({ html, className }: ProseContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        "[data-copy-code]"
      );
      if (!button || !containerRef.current?.contains(button)) return;

      const block = button.closest(".code-block");
      const code =
        block?.querySelector("code")?.textContent ??
        block?.querySelector("pre")?.textContent ??
        "";

      try {
        await navigator.clipboard.writeText(code.replace(/\n$/, ""));
        const label = button.querySelector("[data-copy-label]");
        if (label) {
          const original = label.textContent ?? "Copy";
          label.textContent = "Copied!";
          button.setAttribute("data-copied", "true");
          window.setTimeout(() => {
            label.textContent = original;
            button.removeAttribute("data-copied");
          }, 2000);
        }
      } catch {
        // Clipboard API unavailable — ignore silently.
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
