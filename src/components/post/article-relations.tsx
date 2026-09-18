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
      className="group block rounded-control border border-hairline bg-surface p-4 shadow-card transition-colors hover:border-hairline-strong"
    >
      <p className="text-sm font-medium text-ink group-hover:text-accent-text">
        {post.title}
      </p>
      <p className="mt-1 line-clamp-2 text-xs text-muted">{post.summary}</p>
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-raised px-1.5 py-0.5 text-[0.65rem] text-muted"
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
      className="mt-20 border-t border-hairline pt-12"
      aria-labelledby="knowledge-relations-heading"
    >
      <h2
        id="knowledge-relations-heading"
        className="mb-6 text-xl font-semibold tracking-tight text-ink"
      >
        {articleRelations.heading}
      </h2>

      <div className="space-y-8">
        {parent && (
          <div>
            <p className="mb-2 font-mono text-xs tracking-wide text-faint">
              {articleRelations.parentLabel}
            </p>
            <RelationLink post={parent} />
          </div>
        )}

        {related.length > 0 && (
          <div>
            <p className="mb-2 font-mono text-xs tracking-wide text-faint">
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
            <p className="mb-2 font-mono text-xs tracking-wide text-faint">
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
