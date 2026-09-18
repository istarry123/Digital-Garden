import type { TimelineEntry } from "@/types";
import { TagList } from "@/components/post/tag-list";

/** 时间线条目 —— 行式排版，无卡片边框，分隔交给发丝线 */
export function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <li className="py-6">
      <h3 className="text-lg font-medium leading-snug text-ink">
        {entry.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted">
        {entry.description}
      </p>

      {entry.content && (
        <div
          className="prose prose-sm mt-3 max-w-none"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      )}

      <TagList tags={entry.tags} className="mt-3" />
    </li>
  );
}
