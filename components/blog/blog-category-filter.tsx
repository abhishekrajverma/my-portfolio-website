"use client";

import { BLOG_CATEGORIES, type BlogCategoryFilter } from "@/constants/blog";
import { cn } from "@/lib/utils";

interface BlogCategoryFilterProps {
  activeCategory: BlogCategoryFilter;
  onCategoryChange: (category: BlogCategoryFilter) => void;
  className?: string;
}

export function BlogCategoryFilterBar({
  activeCategory,
  onCategoryChange,
  className,
}: BlogCategoryFilterProps) {
  return (
    <div className={cn("border-b border-border pb-4", className)}>
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={activeCategory === cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "shrink-0 px-3 py-2 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "text-foreground underline decoration-foreground underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
