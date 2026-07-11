import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post/post-card";
import { blogConfig } from "@/config/blog.config";

const { site, pages } = blogConfig;
const { posts: postsPage } = pages;

export const metadata: Metadata = {
  title: postsPage.title,
  description: postsPage.description,
  openGraph: {
    title: `${postsPage.title} | ${site.name}`,
    description: postsPage.description,
    url: `${site.url}/posts`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${postsPage.title} | ${site.name}`,
    description: postsPage.description,
  },
};

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {postsPage.heading}
      </h1>

      {posts.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {postsPage.emptyText}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
