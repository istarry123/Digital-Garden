import type { Post } from "@/types";
import { PostCard } from "@/components/post/post-card";
import { blogConfig } from "@/config/blog.config";

const { relatedArticles } = blogConfig;

export function RelatedArticles({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-neutral-200 pt-12 dark:border-neutral-800">
      <h2 className="mb-6 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {relatedArticles.heading}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
