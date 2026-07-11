import Link from "next/link";
import { mockPosts } from "@/lib/mock-data";
import { PostCard } from "@/components/post/post-card";
import { blogConfig } from "@/config/blog.config";

const postsPage = blogConfig.pages.posts;

export function LatestArticles() {
  const latest = mockPosts.slice(0, 3);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {postsPage.latestHeading}
          </h2>
          <Link
            href="/posts"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {postsPage.viewAll} &rarr;
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
