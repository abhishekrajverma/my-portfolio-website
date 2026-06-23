export const BLOG_CATEGORIES = [
  "All",
  "SQL",
  "Power BI",
  "Excel",
  "Python",
  "Interview",
] as const;

export type BlogCategoryFilter = (typeof BLOG_CATEGORIES)[number];

export function isBlogCategory(value: string | null): value is BlogCategoryFilter {
  return BLOG_CATEGORIES.includes(value as BlogCategoryFilter);
}
