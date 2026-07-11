/**
 * @deprecated Import from `@/config/blog.config` instead.
 * Kept for backward compatibility — re-exports from blogConfig.
 */
import { blogConfig } from "@/config/blog.config";

export const SITE = {
  name: blogConfig.site.name,
  url: blogConfig.site.url,
  description: blogConfig.site.description,
  language: blogConfig.site.language,
  author: blogConfig.author.name,
  twitter: blogConfig.social.twitter,
};

export const GISCUS = {
  repo: blogConfig.comments.giscus.repo,
  repoId: blogConfig.comments.giscus.repoId,
  category: blogConfig.comments.giscus.category,
  categoryId: blogConfig.comments.giscus.categoryId,
};
