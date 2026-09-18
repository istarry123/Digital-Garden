import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { FeaturedPost } from "@/components/post/featured-post";
import { PostRow } from "@/components/post/post-row";
import { Container } from "@/components/layout/container";
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
  const [featured, ...rest] = posts;

  return (
    <Container as="main" width="list" className="py-20">
      <header className="mb-10 border-b border-hairline pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {postsPage.heading}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {postsPage.description}
        </p>
        <p className="mt-5 font-mono text-xs text-faint">
          共 {posts.length} 篇
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted">{postsPage.emptyText}</p>
      ) : (
        <>
          {featured && <FeaturedPost post={featured} />}

          {rest.length > 0 && (
            <ul className="mt-14 divide-y divide-hairline border-t border-hairline">
              {rest.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </ul>
          )}
        </>
      )}
    </Container>
  );
}
