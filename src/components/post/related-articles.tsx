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
          // prefetch={false}：相关文章位于正文底部，默认预取会在滚动到这里时
          // 为每篇各下载一份完整正文 RSC（实测单页 31–63 KB brotli）。
          // 改为用户真正点击时再取；导航行为不变。
          // 首页的 PostCard 调用点不传该参数，保持默认行为。
          <PostCard key={post.slug} post={post} prefetch={false} />
        ))}
      </div>
    </section>
  );
}
