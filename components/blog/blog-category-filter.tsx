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
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {BLOG_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          aria-pressed={activeCategory === cat}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-all",
            activeCategory === cat
              ? "bg-primary text-primary-foreground"
              : "glass text-muted-foreground hover:text-foreground"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
