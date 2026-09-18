import type { Post } from "@/types";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { TagList } from "@/components/post/tag-list";

/**
 * 文章卡片 —— 用于"相关文章"等次级场景。
 * 信息顺序与列表行一致：标题 → 摘要 → 元信息。
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col rounded-card border border-hairline bg-surface p-6 shadow-card transition-colors hover:border-hairline-strong">
      <h3 className="text-lg font-semibold leading-snug">
        <Link
          href={`/posts/${post.slug}`}
          className="text-ink transition-colors group-hover:text-accent-text"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {post.summary}
      </p>

      <div className="mt-4 flex items-center gap-2.5 font-mono text-xs text-faint">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
        <span>{post.readingTime} min read</span>
      </div>

      <TagList tags={post.tags} className="mt-3" />
    </article>
  );
}
