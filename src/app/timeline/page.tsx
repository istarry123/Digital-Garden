import type { Metadata } from "next";
import { getTimeline } from "@/lib/timeline";
import { Timeline } from "@/components/timeline/timeline";
import { Container } from "@/components/layout/container";
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
    <Container as="main" width="reading" className="py-20">
      <header className="mb-14 border-b border-hairline pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {timelinePage.title}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {timelinePage.description}
        </p>
        <p className="mt-5 font-mono text-xs text-faint">
          共 {entries.length} 个里程碑
        </p>
      </header>

      <Timeline entries={entries} />
    </Container>
  );
}
