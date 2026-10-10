import type { Metadata } from "next";
import { Hero, type HeroStat } from "@/components/home/hero";
import { LatestArticles } from "@/components/home/latest-articles";
import { LatestExplore } from "@/components/home/latest-explore";
import { RelativeDate } from "@/components/home/relative-date";
import { getAllPosts } from "@/lib/posts";
import { getAllExploreEntries } from "@/lib/explore";
import { getTimeline } from "@/lib/timeline";
import { getLatestContentDate } from "@/lib/latest-content";
import { formatDate } from "@/lib/format";
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

/** 首页：首屏索引行 + 可选的 Latest 板块，数据全部来自 content/ */
export default async function HomePage() {
  const [posts, explore, timeline, latestDate] = await Promise.all([
    getAllPosts(),
    getAllExploreEntries(),
    getTimeline(),
    getLatestContentDate(),
  ]);

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
      /**
       * 相对时间交给客户端算（见 RelativeDate）：
       * 这里预渲染的是 fallback 绝对日期，因此首页仍是纯静态快照，
       * 只有这一格在浏览器里换成"13 天前"。
       */
      value: latestDate ? (
        <RelativeDate date={latestDate} fallback={formatDate(latestDate)} />
      ) : (
        "—"
      ),
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
