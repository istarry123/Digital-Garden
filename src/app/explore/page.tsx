import type { Metadata } from "next";
import { getAllExploreEntries } from "@/lib/explore";
import { ExploreCard } from "@/components/explore/explore-card";
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
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {explorePage.heading}
      </h1>

      {entries.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {explorePage.emptyText}
        </p>
      ) : (
        <div className="relative">
          <div
            className="absolute left-[19px] top-2 h-full w-px bg-neutral-200 dark:bg-neutral-700"
            aria-hidden="true"
          />

          <ul className="space-y-8">
            {entries.map((entry) => (
              <li key={entry.slug} className="relative pl-12">
                <div
                  className="absolute left-[11px] top-2 z-10 h-4 w-4 rounded-full border-2 border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-950"
                  aria-hidden="true"
                />
                <ExploreCard entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
