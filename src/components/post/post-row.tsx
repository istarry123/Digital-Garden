import Link from "next/link";
import type { Post } from "@/types";
import { formatDate } from "@/lib/format";
import { TagList } from "@/components/post/tag-list";
import { CoverImage } from "@/components/post/cover-image";

/**
 * 列表行 —— 无边框、靠发丝线分隔。
 * 信息顺序按阅读优先级：标题 → 摘要 → 元信息（此前元信息在最前）。
 *
 * ⚠️ 整行可点，但**不能**用 <Link> 包住整行：行内的标签本身就是链接，
 * 包起来会形成 <a> 嵌套 <a>（非法 HTML，会导致 React 水合失败）。
 * 这里用"标题链接 + 覆盖整行的伪元素"实现整行点击，标签再抬到遮罩之上。
 */
export function PostRow({ post }: { post: Post }) {
  const href = `/posts/${post.slug}`;

  return (
    <li className="group relative">
      <div className="grid grid-cols-[1fr] items-start gap-4 py-6 sm:grid-cols-[7rem_1fr] sm:gap-6">
        {post.cover ? (
          <div className="relative hidden aspect-[4/3] w-28 overflow-hidden rounded-control border border-hairline bg-raised sm:block">
            <CoverImage src={post.cover} sizes="112px" />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="hidden aspect-[4/3] w-28 rounded-control border border-hairline bg-raised sm:block"
          />
        )}

        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-base font-medium leading-snug text-ink transition-colors group-hover:text-accent-text sm:text-lg">
              {/* after: 伪元素撑满整行，使整行可点 */}
              <Link href={href} className="after:absolute after:inset-0">
                {post.title}
              </Link>
            </h3>
            <time
              dateTime={post.date}
              className="shrink-0 font-mono text-xs text-faint"
            >
              {formatDate(post.date)}
            </time>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {post.summary}
          </p>

          {/* 抬到整行遮罩之上，保证标签自己可点 */}
          <div className="relative z-10 mt-3 flex flex-wrap items-center gap-3">
            <TagList tags={post.tags} />
            <span className="font-mono text-xs text-faint">
              {post.readingTime} min
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
