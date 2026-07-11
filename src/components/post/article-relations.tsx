import Link from "next/link";
import type { Post } from "@/types";
import { blogConfig } from "@/config/blog.config";

const { articleRelations } = blogConfig;

interface Props {
  currentPost: Post;
  allPosts: Post[];
}

function lookup(slug: string | null, posts: Post[]): Post | null {
  if (!slug) return null;
  return posts.find((p) => p.slug === slug) ?? null;
}

function lookupMany(slugs: string[], posts: Post[]): Post[] {
  return slugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is Post => p !== undefined);
}

function RelationLink({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <p className="text-sm font-medium text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
        {post.title}
      </p>
      <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
        {post.summary}
      </p>
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.65rem] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export function ArticleRelations({ currentPost, allPosts }: Props) {
  const parent = lookup(currentPost.relations.parent, allPosts);
  const related = lookupMany(currentPost.relations.related, allPosts);
  const children = lookupMany(currentPost.relations.children, allPosts);

  if (!parent && related.length === 0 && children.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-20 border-t border-neutral-200 pt-12 dark:border-neutral-800"
      aria-labelledby="knowledge-relations-heading"
    >
      <h2
        id="knowledge-relations-heading"
        className="mb-6 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
      >
        {articleRelations.heading}
      </h2>

      <div className="space-y-8">
        {parent && (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              {articleRelations.parentLabel}
            </p>
            <RelationLink post={parent} />
          </div>
        )}

        {related.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              {articleRelations.relatedLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((post) => (
                <RelationLink key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}

        {children.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              {articleRelations.childrenLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {children.map((post) => (
                <RelationLink key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
