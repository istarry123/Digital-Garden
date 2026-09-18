import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTagGroups, getTagGroup, tagBreakdown } from "@/lib/tags";
import { PostRow } from "@/components/post/post-row";
import { ExploreFeed } from "@/components/explore/explore-feed";
import { Container } from "@/components/layout/container";
import { blogConfig } from "@/config/blog.config";

const { site, pages } = blogConfig;
const { tags: tagsPage } = pages;

interface Props {
  // catch-all：标签里将来若出现斜杠（例如 CI/CD）也能正确路由
  params: Promise<{ tag: string[] }>;
}

export async function generateStaticParams() {
  const groups = await getAllTagGroups();
  return groups.map((group) => ({ tag: group.tag.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const group = await getTagGroup(tag);

  if (!group) return {};

  const description = `${tagBreakdown(group).join("，")}，标签为 ${group.tag}。`;

  return {
    title: `#${group.tag}`,
    description,
    openGraph: {
      title: `#${group.tag} | ${site.name}`,
      description,
      url: `${site.url}${group.href}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `#${group.tag} | ${site.name}`,
      description,
    },
  };
}

/**
 * 标签归档 —— 同一个标签可能同时命中文章、笔记、里程碑
 * （本站 Next.js / Docker 就是跨类型出现），因此按内容类型分区展示，
 * 而不是只列文章。
 */
export default async function TagArchivePage({ params }: Props) {
  const { tag } = await params;
  const group = await getTagGroup(tag);

  if (!group) notFound();

  const breakdown = tagBreakdown(group);

  return (
    <Container as="main" width="list" className="py-20">
      <header className="mb-12 border-b border-hairline pb-8">
        <p className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-faint">
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-1.5 shrink-0 bg-accent"
          />
          <Link href="/tags" className="transition-colors hover:text-muted">
            {tagsPage.heading}
          </Link>
          <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
          <span>共 {group.count} 条</span>
        </p>

        <h1 className="mt-7 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          <span aria-hidden="true" className="font-mono text-muted">
            #
          </span>
          {group.tag}
        </h1>

        {breakdown.length > 0 && (
          <p className="mt-4 flex flex-wrap items-center gap-2.5 font-mono text-xs text-faint">
            {breakdown.map((part, index) => (
              <span key={part} className="flex items-center gap-2.5">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="h-3 w-px bg-hairline-strong"
                  />
                )}
                {part}
              </span>
            ))}
          </p>
        )}
      </header>

      <div className="space-y-16">
        {group.posts.length > 0 && (
          <section aria-labelledby="tag-posts-heading">
            <h2
              id="tag-posts-heading"
              className="mb-5 text-lg font-medium text-ink"
            >
              文章
            </h2>
            <ul className="divide-y divide-hairline border-t border-hairline">
              {group.posts.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </ul>
          </section>
        )}

        {group.notes.length > 0 && (
          <section aria-labelledby="tag-notes-heading">
            <h2
              id="tag-notes-heading"
              className="mb-6 text-lg font-medium text-ink"
            >
              笔记
            </h2>
            <ExploreFeed entries={group.notes} />
          </section>
        )}

        {group.milestones.length > 0 && (
          <section aria-labelledby="tag-milestones-heading">
            <h2
              id="tag-milestones-heading"
              className="mb-5 text-lg font-medium text-ink"
            >
              里程碑
            </h2>
            <ol className="divide-y divide-hairline border-t border-hairline">
              {group.milestones.map((milestone) => (
                <li key={milestone.slug} className="py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-base font-medium leading-snug text-ink">
                      {milestone.title}
                    </h3>
                    <span className="shrink-0 font-mono text-xs text-faint tabular-nums">
                      {milestone.year}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </Container>
  );
}
