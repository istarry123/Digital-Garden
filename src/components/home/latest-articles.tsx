import Link from "next/link";
import type { Post } from "@/types";
import { PostCard } from "@/components/post/post-card";
import { Container } from "@/components/layout/container";
import { blogConfig } from "@/config/blog.config";

const postsPage = blogConfig.pages.posts;

/**
 * 首页"最新文章"板块。
 * 数据由首页服务端组件传入（此前这里读的是 lib/mock-data 的假数据）。
 * 是否展示由 blogConfig.homepage.showLatestArticles 控制。
 */
export function LatestArticles({ posts }: { posts: Post[] }) {
  const latest = posts.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="border-t border-hairline">
      <Container className="py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            {postsPage.latestHeading}
          </h2>
          <Link
            href="/posts"
            className="text-sm font-medium text-accent-text underline-offset-4 hover:underline"
          >
            {postsPage.viewAll}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
