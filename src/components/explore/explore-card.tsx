import type { ExploreEntry } from "@/types";
import { moodOf } from "@/lib/moods";
import { formatDate } from "@/lib/format";
import { TagList } from "@/components/post/tag-list";

/**
 * 笔记条目 —— 无边框、无底色。
 *
 * 这些笔记本身没有独立路由（点不进去），所以它们不该长得像卡片：
 * 之前"时间线竖线 + 卡片边框"两套结构叠在一起，视觉很闷。
 * 现在结构只由外层的时间线脊线承担，条目本身只是一段排版。
 */
export function ExploreCard({ entry }: { entry: ExploreEntry }) {
  const mood = moodOf(entry.mood);

  return (
    <article>
      <div className="mb-3 flex flex-wrap items-center gap-2.5 font-mono text-xs text-faint">
        <span className="text-muted" title={mood.label}>
          <span aria-hidden="true">{mood.emoji}</span> {mood.label}
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />

      <TagList tags={entry.tags} className="mt-4" />
    </article>
  );
}
