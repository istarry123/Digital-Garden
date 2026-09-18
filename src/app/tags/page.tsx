import type { Metadata } from "next";
import Link from "next/link";
import { getAllTagGroups } from "@/lib/tags";
import { Container } from "@/components/layout/container";
import { blogConfig } from "@/config/blog.config";

const { site, pages } = blogConfig;
const { tags: tagsPage } = pages;

export const metadata: Metadata = {
  title: tagsPage.title,
  description: tagsPage.description,
  openGraph: {
    title: `${tagsPage.title} | ${site.name}`,
    description: tagsPage.description,
    url: `${site.url}/tags`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${tagsPage.title} | ${site.name}`,
    description: tagsPage.description,
  },
};

/** 用得多 → 视觉权重更高，形成一个真正带信息的标签云（不是随机大小） */
function chipSize(count: number): string {
  if (count >= 5) return "px-4 py-2 text-base";
  if (count >= 2) return "px-3 py-1.5 text-sm";
  return "px-3 py-1 text-sm";
}

export default async function TagsPage() {
  const groups = await getAllTagGroups();

  return (
    <Container as="main" width="list" className="py-20">
      <header className="mb-10 border-b border-hairline pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {tagsPage.heading}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {tagsPage.description}
        </p>
        <p className="mt-5 font-mono text-xs text-faint">
          共 {groups.length} 个标签
        </p>
      </header>

      {groups.length === 0 ? (
        <p className="text-muted">{tagsPage.emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.tag}>
              <Link
                href={group.href}
                className={`inline-flex items-center gap-2 rounded-control border border-hairline bg-surface transition-colors hover:border-hairline-strong ${chipSize(group.count)}`}
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-faint"
                >
                  #
                </span>
                <span className="text-ink">{group.tag}</span>
                <span className="font-mono text-xs text-faint tabular-nums">
                  {group.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
