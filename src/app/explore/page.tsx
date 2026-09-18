import type { Metadata } from "next";
import { getAllExploreEntries } from "@/lib/explore";
import { ExploreFeed } from "@/components/explore/explore-feed";
import { Container } from "@/components/layout/container";
import { blogConfig } from "@/config/blog.config";

const { site, pages } = blogConfig;
const { explore: explorePage } = pages;

export const metadata: Metadata = {
  title: explorePage.title,
  description: explorePage.description,
  openGraph: {
    title: `${explorePage.title} | ${site.name}`,
    description: explorePage.description,
    url: `${site.url}/explore`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${explorePage.title} | ${site.name}`,
    description: explorePage.description,
  },
};

export default async function ExplorePage() {
  const entries = await getAllExploreEntries();

  return (
    <Container as="main" width="prose" className="py-20">
      <header className="mb-12 border-b border-hairline pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {explorePage.heading}
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          {explorePage.description}
        </p>
        <p className="mt-5 font-mono text-xs text-faint">
          共 {entries.length} 条
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="text-muted">{explorePage.emptyText}</p>
      ) : (
        <ExploreFeed entries={entries} />
      )}
    </Container>
  );
}
