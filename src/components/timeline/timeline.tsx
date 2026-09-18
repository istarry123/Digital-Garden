import type { TimelineEntry } from "@/types";
import { TimelineItem } from "@/components/timeline/timeline-item";
import { blogConfig } from "@/config/blog.config";

const { pages } = blogConfig;

/**
 * 时间线 —— 以"年份轨道"作为结构：左侧大号等宽年份（滚动时吸附），
 * 右侧是行式条目。此前的"竖线 + 圆点 + 带边框卡片"是两套结构叠加，
 * 现在只留一套，年份本身成为视觉锚点。
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-muted">{pages.timeline.emptyText}</p>;
  }

  const years = Array.from(new Set(entries.map((entry) => entry.year))).sort(
    (a, b) => b - a,
  );

  return (
    <div className="space-y-16">
      {years.map((year) => (
        <section
          key={year}
          className="grid gap-x-8 gap-y-2 lg:grid-cols-[5rem_minmax(0,44rem)] lg:justify-center"
        >
          <h2 className="font-mono text-2xl font-medium tracking-tight text-ink tabular-nums lg:sticky lg:top-24 lg:self-start">
            {year}
          </h2>

          <ol className="divide-y divide-hairline border-t border-hairline">
            {entries
              .filter((entry) => entry.year === year)
              .map((entry) => (
                <TimelineItem key={entry.slug} entry={entry} />
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
