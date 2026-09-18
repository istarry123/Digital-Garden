import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllExploreEntries } from "@/lib/explore";
import { getAllTagGroups } from "@/lib/tags";
import { blogConfig } from "@/config/blog.config";

const { site } = blogConfig;

/** 取一组日期里最新的一天；没有则退回当前时间 */
function newestDate(dates: (string | undefined)[]): Date {
  const valid = dates.filter((date): date is string => Boolean(date)).sort();
  const newest = valid[valid.length - 1];
  return newest ? new Date(newest) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, notes, tagGroups] = await Promise.all([
    getAllPosts(),
    getAllExploreEntries(),
    getAllTagGroups(),
  ]);

  const newestPost = newestDate(posts.map((post) => post.date));
  const newestNote = newestDate(notes.map((note) => note.date));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: newestPost,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/posts`,
      lastModified: newestPost,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${site.url}/explore`,
      lastModified: newestNote,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${site.url}/timeline`,
      lastModified: newestPost,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/graph`,
      lastModified: newestPost,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${site.url}/tags`,
      lastModified: newestNote,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 标签归档：href 已做过百分号编码（标签里可能有空格或中文）
  const tagRoutes: MetadataRoute.Sitemap = tagGroups.map((group) => ({
    url: `${site.url}${group.href}`,
    lastModified: newestDate([
      ...group.posts.map((post) => post.date),
      ...group.notes.map((note) => note.date),
    ]),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
