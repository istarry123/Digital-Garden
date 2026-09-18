import Link from "next/link";
import type { ExploreEntry } from "@/types";
import { ExploreFeed } from "@/components/explore/explore-feed";
import { Container } from "@/components/layout/container";
import { blogConfig } from "@/config/blog.config";

const explorePage = blogConfig.pages.explore;

/**
 * 首页"最新笔记"板块。
 * 与 /explore 共用同一份笔记流排版，数据来自真实内容
 * （此前这里渲染的是 lib/mock-data 里假的 GitHub 活动流）。
 * 是否展示由 blogConfig.homepage.showLatestExplore 控制。
 */
export function LatestExplore({ entries }: { entries: ExploreEntry[] }) {
  const latest = entries.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="border-t border-hairline">
      <Container width="prose" className="py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            {explorePage.latestHeading}
          </h2>
          <Link
            href="/explore"
            className="text-sm font-medium text-accent-text underline-offset-4 hover:underline"
          >
            {explorePage.viewAll}
          </Link>
        </div>

        <ExploreFeed entries={latest} />
      </Container>
    </section>
  );
}
