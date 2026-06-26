import Image from "next/image";
import { Clock } from "lucide-react";
import { siteConfig } from "@/constants/site";
import { formatDate } from "@/lib/utils";

interface BlogAuthorMetaProps {
  date: string;
  readTime: string;
  className?: string;
}

export function BlogAuthorMeta({
  date,
  readTime,
  className = "",
}: BlogAuthorMetaProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
        <Image
          src="/my-photo.jpeg"
          alt={siteConfig.author}
          fill
          className="object-cover"
          sizes="44px"
        />
      </div>
      <div className="min-w-0 text-sm">
        <p className="font-medium text-foreground">{siteConfig.author}</p>
        <p className="flex flex-wrap items-center gap-x-2 text-muted-foreground">
          <span>{formatDate(date)}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </span>
        </p>
      </div>
    </div>
  );
}
