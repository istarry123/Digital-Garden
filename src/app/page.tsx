import type { Metadata } from "next";
import { Hero, type HeroStat } from "@/components/home/hero";
import { LatestArticles } from "@/components/home/latest-articles";
import { LatestExplore } from "@/components/home/latest-explore";
import { getAllPosts } from "@/lib/posts";
import { getAllExploreEntries } from "@/lib/explore";
import { getTimeline } from "@/lib/timeline";
import { blogConfig } from "@/config/blog.config";

const { site, homepage } = blogConfig;

export const metadata: Metadata = {
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

/** 把日期转成"几天前"，让首屏索引行体现内容的新鲜度 */
function formatRelativeDays(dateStr: string): string {
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "—";

  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 30) return `${days} 天前`;
  if (days < 365) return `${Math.floor(days / 30)} 个月前`;
  return `${Math.floor(days / 365)} 年前`;
}

export default async function HomePage() {
  const [posts, explore, timeline] = await Promise.all([
    getAllPosts(),
    getAllExploreEntries(),
    getTimeline(),
  ]);

  const dates = [posts[0]?.date, explore[0]?.date].filter(
    (date): date is string => Boolean(date),
  );
  const latestDate = dates.sort()[dates.length - 1];

  // 索引行的数字全部来自真实内容，不是硬编码的营销数字
  const stats: HeroStat[] = [
    { label: "文章", value: `${posts.length} 篇`, href: "/posts" },
    { label: "笔记", value: `${explore.length} 条`, href: "/explore" },
    {
      label: "里程碑",
      value: `${timeline.entries.length} 个`,
      href: "/timeline",
    },
    {
      label: "最近更新",
      value: latestDate ? formatRelativeDays(latestDate) : "—",
      href: "/explore",
    },
  ];

  return (
    <main>
      <Hero stats={stats} />
      {/* 板块开关来自 blogConfig.homepage，传的是真实内容数据 */}
      {homepage.showLatestArticles && <LatestArticles posts={posts} />}
      {homepage.showLatestExplore && <LatestExplore entries={explore} />}
    </main>
  );
}
