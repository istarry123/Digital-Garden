import { blogConfig } from "@/config/blog.config";

/** 全站统一日期格式（locale 来自 blogConfig.posts.dateLocale） */
export function formatDate(dateStr: string, withYear = true): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString(blogConfig.posts.dateLocale, {
    year: withYear ? "numeric" : undefined,
    month: "short",
    day: "numeric",
  });
}
