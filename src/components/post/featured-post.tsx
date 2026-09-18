import Link from "next/link";
import type { Post } from "@/types";
import { formatDate } from "@/lib/format";
import { TagList } from "@/components/post/tag-list";
import { CoverImage } from "@/components/post/cover-image";

/**
 * 列表页首篇 —— 唯一带边框与封面的"抬升"元素，
 * 其余文章用行式列表，靠层级差而不是靠同一套卡片重复来区分主次。
 */
export function FeaturedPost({ post }: { post: Post }) {
  const href = `/posts/${post.slug}`;

  return (
    <article className="group overflow-hidden rounded-card border border-hairline bg-surface shadow-card transition-colors hover:border-hairline-strong">
      {post.cover && (
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-raised">
          <CoverImage
            src={post.cover}
            sizes="(min-width: 1088px) 1040px, 100vw"
            priority
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        <p className="flex items-center gap-2.5 font-mono text-xs text-faint">
          <span className="text-accent-text">最新</span>
          <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
          <span>{post.readingTime} min read</span>
        </p>

        <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink">
          <Link
            href={href}
            className="transition-colors group-hover:text-accent-text"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          {post.summary}
        </p>

        <TagList tags={post.tags} className="mt-5" />
      </div>
    </article>
  );
}
