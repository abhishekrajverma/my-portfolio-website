import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function SqlServerIcon({ className }: IconProps) {
  return (
    <Image
      src="/logos/sql-server.svg"
      alt=""
      width={28}
      height={28}
      className={cn("h-7 w-7 shrink-0", className)}
      aria-hidden
    />
  );
}

export function PowerBiIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-7 w-7 shrink-0", className)}
      aria-hidden="true"
    >
      <rect x="3" y="14" width="4" height="7" rx="1" fill="#F2C811" />
      <rect x="9" y="10" width="4" height="11" rx="1" fill="#F2C811" />
      <rect x="15" y="5" width="4" height="16" rx="1" fill="#F2C811" />
    </svg>
  );
}

export function PythonIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-7 w-7 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        fill="#3776AB"
        d="M12 2C8.1 2 8.4 3.7 8.4 3.7v2.3h3.7v.7H6.2C3.5 6.7 2 8.4 2 11.2c0 3.1 1.8 4.7 1.8 4.7l3.2-.1v-1.5c0-3.2 2.8-3 2.8-3h4.3c2.5 0 2.7-1.7 2.7-2.7V5.4C17 3.2 14.9 2 12 2zm-1.9 1.8a.7.7 0 110 1.4.7.7 0 010-1.4z"
      />
      <path
        fill="#FFD43B"
        d="M12 22c3.9 0 3.6-1.7 3.6-1.7v-2.3h-3.7v-.7h5.9c2.7 0 4.2-1.7 4.2-4.5 0-3.1-1.8-4.7-1.8-4.7l-3.2.1v1.5c0 3.2-2.8 3-2.8 3h-4.3c-2.5 0-2.7 1.7-2.7 2.7v3.4C7 20.8 9.1 22 12 22zm1.9-1.8a.7.7 0 110-1.4.7.7 0 010 1.4z"
      />
    </svg>
  );
}

export function GenAiIcon({ className }: IconProps) {
  return (
    <Sparkles
      className={cn("h-7 w-7 shrink-0 text-violet-400", className)}
      aria-hidden="true"
    />
  );
}
