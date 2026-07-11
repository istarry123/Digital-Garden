import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { TableOfContents } from "@/components/post/table-of-contents";
import { RelatedArticles } from "@/components/post/related-articles";
import { GiscusComment } from "@/components/comment/giscus";
import { blogConfig } from "@/config/blog.config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      images: post.cover ? [{ url: post.cover }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.cover ? [post.cover] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.tags);

  return (
    <main>
      {/* Cover image — full-width hero above the title */}
      {post.cover ? (
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <div className="relative overflow-hidden rounded-xl bg-neutral-100 shadow-lg dark:bg-neutral-800">
            <Image
              src={post.cover}
              alt={post.title}
              width={1200}
              height={630}
              priority
              className="aspect-[1200/630] w-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="pt-8" />
      )}

      {/* Three-column grid layout */}
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-10">
          {/* Left 1/3: empty whitespace for visual balance */}
          <div className="hidden lg:block" />

          {/* Center 1/3: article content, strictly contained */}
          <article className="min-w-0">
            <header className="mb-10">
              <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
                {post.title}
              </h1>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readingTime} min read</span>
              </div>

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
            </header>

            <div
              className="prose prose-neutral max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related articles at article footer */}
            <RelatedArticles posts={relatedPosts} />

            {/* Giscus comments via GitHub Discussions */}
            {blogConfig.comments.giscus.repoId &&
              blogConfig.comments.giscus.categoryId && (
              <GiscusComment config={blogConfig.comments.giscus} />
            )}
          </article>

          {/* Right 1/3: TOC sidebar */}
          <aside className="hidden lg:block">
            <div
              className="sticky top-[50vh]"
              style={{ transform: "translateY(-50%)" }}
            >
              <TableOfContents items={post.toc} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
