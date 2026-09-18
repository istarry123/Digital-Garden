import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { TableOfContents } from "@/components/post/table-of-contents";
import { RelatedArticles } from "@/components/post/related-articles";
import { ArticleRelations } from "@/components/post/article-relations";
import { CopyLink } from "@/components/post/copy-link";
import { ReadingProgress } from "@/components/post/reading-progress";
import { TagList } from "@/components/post/tag-list";
import { CoverImage } from "@/components/post/cover-image";
import { AuthorAvatar } from "@/components/post/author-avatar";
import { GiscusComment } from "@/components/comment/giscus";
import { Container } from "@/components/layout/container";
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
  const allPosts = await getAllPosts();
  const { author } = blogConfig;

  return (
    <main>
      <ReadingProgress />

      {/* 正文列 44rem + 目录 15rem 合成一个整体块，封面与正文左边缘对齐 */}
      <Container width="reading" className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,44rem)_15rem] lg:justify-center lg:gap-x-10">
          <article className="w-full min-w-0">
            {post.cover && (
              <div className="relative mb-10 aspect-[1200/630] overflow-hidden rounded-card border border-hairline bg-raised">
                <CoverImage
                  src={post.cover}
                  sizes="(min-width: 1024px) 704px, 100vw"
                  priority
                />
              </div>
            )}

            <header className="mb-10">
              <h1 className="text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
                {post.title}
              </h1>

              {post.summary && (
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  {post.summary}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-hairline pt-5">
                <AuthorAvatar src={author.avatar} name={author.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{author.name}</p>
                  <p className="mt-0.5 flex items-center gap-2.5 font-mono text-xs text-faint">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span
                      aria-hidden="true"
                      className="h-3 w-px bg-hairline-strong"
                    />
                    <span>{post.readingTime} min read</span>
                  </p>
                </div>
                <CopyLink />
              </div>

              <TagList tags={post.tags} className="mt-5" />
            </header>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related articles at article footer */}
            <RelatedArticles posts={relatedPosts} />

            {/* Knowledge relations — parent / related / children */}
            <ArticleRelations currentPost={post} allPosts={allPosts} />

            {/* Giscus comments via GitHub Discussions */}
            {blogConfig.comments.giscus.repoId &&
              blogConfig.comments.giscus.categoryId && (
                <GiscusComment config={blogConfig.comments.giscus} />
              )}
          </article>

          <aside className="hidden lg:block">
            {/* sticky 与内部滚动由 TableOfContents 自己负责（长目录也能滚） */}
            <TableOfContents items={post.toc} />
          </aside>
        </div>
      </Container>
    </main>
  );
}
