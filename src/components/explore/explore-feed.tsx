import type { ExploreEntry } from "@/types";
import { ExploreCard } from "@/components/explore/explore-card";

/**
 * 笔记流 —— 一条竖向脊线贯穿，节点是脊线上的刻度。
 * /explore 页面与首页"最新笔记"共用同一份排版。
 */
export function ExploreFeed({ entries }: { entries: ExploreEntry[] }) {
  return (
    <ol className="relative space-y-12 border-l border-hairline pl-8">
      {entries.map((entry) => (
        <li key={entry.slug} className="relative">
          {/* 节点坐在脊线上，用 canvas 色描一圈把线"切断" */}
          <span
            aria-hidden="true"
            className="absolute -left-[35px] top-1.5 h-1.5 w-1.5 rounded-full bg-hairline-strong ring-4 ring-canvas"
          />
          <ExploreCard entry={entry} />
        </li>
      ))}
    </ol>
  );
}
