import Link from "next/link";
import { tagHref } from "@/lib/tags";

/**
 * 标签列表 —— 等宽小字，全站同一种标签皮肤。
 * 指向 /tags/<tag> 归档页（标签里可能有空格或中文，交给 tagHref 统一编码）。
 */
export function TagList({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`.trim()}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={tagHref(tag)}
            className="inline-block rounded bg-raised px-1.5 py-0.5 font-mono text-xs text-muted transition-colors hover:bg-accent-quiet hover:text-ink"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
