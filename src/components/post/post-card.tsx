import type { Post } from "@/types";
import Link from "next/link";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-3 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime} min read</span>
      </div>

      <h3 className="mb-2 text-lg font-semibold leading-snug">
        <Link
          href={`/posts/${post.slug}`}
          className="text-neutral-900 decoration-neutral-300 underline-offset-4 hover:underline dark:text-neutral-100 dark:decoration-neutral-600"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {post.summary}
      </p>

      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
