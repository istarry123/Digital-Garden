import type { Metadata } from "next";
import { getTimeline } from "@/lib/timeline";
import { Timeline } from "@/components/timeline/timeline";
import { blogConfig } from "@/config/blog.config";

const { site, pages } = blogConfig;
const { timeline: timelinePage } = pages;

export const metadata: Metadata = {
  title: timelinePage.title,
  description: timelinePage.description,
  openGraph: {
    title: `${timelinePage.title} | ${site.name}`,
    description: timelinePage.description,
    url: `${site.url}/timeline`,
  },
};

export default async function TimelinePage() {
  const { entries } = await getTimeline();

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="mb-12 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {timelinePage.title}
      </h1>

      <Timeline entries={entries} />
    </main>
  );
}
