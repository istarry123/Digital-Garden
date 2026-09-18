import type { Post } from "@/types";
import { PostCard } from "@/components/post/post-card";
import { blogConfig } from "@/config/blog.config";

const { relatedArticles } = blogConfig;

export function RelatedArticles({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-hairline pt-12">
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-ink">
        {relatedArticles.heading}
      </h2>

      {/* 正文列只有 44rem，两栏才放得下日期/时长/标签；三栏会把卡片压到 215px 造成折行 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
