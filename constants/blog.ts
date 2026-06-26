export const BLOG_CATEGORIES = [
  "All",
  "SQL",
  "Power BI",
  "Excel",
  "Python",
  "Interview",
] as const;

export const BLOG_POST_CATEGORIES = [
  "SQL",
  "Power BI",
  "Excel",
  "Python",
  "Interview",
] as const;

export type BlogCategoryFilter = (typeof BLOG_CATEGORIES)[number];
export type BlogPostCategory = (typeof BLOG_POST_CATEGORIES)[number];

export function isBlogCategory(value: string | null): value is BlogCategoryFilter {
  return BLOG_CATEGORIES.includes(value as BlogCategoryFilter);
}
