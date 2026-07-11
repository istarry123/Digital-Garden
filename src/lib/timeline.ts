import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { TimelineEntry, Timeline } from "@/types";

const timelineDirectory = path.join(process.cwd(), "content", "timeline");

interface TimelineFrontmatter {
  year: number;
  title: string;
  description: string;
  tags?: string[];
}

async function renderContent(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

export async function getTimeline(): Promise<Timeline> {
  if (!fs.existsSync(timelineDirectory)) {
    return { entries: [], byYear: new Map(), years: [], tagIndex: new Map() };
  }

  const fileNames = fs.readdirSync(timelineDirectory);

  const entries: TimelineEntry[] = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(timelineDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        const frontmatter = data as TimelineFrontmatter;

        const html = await renderContent(content);

        return {
          slug,
          year: frontmatter.year,
          title: frontmatter.title,
          description: frontmatter.description,
          tags: frontmatter.tags ?? [],
          content: html,
        } satisfies TimelineEntry;
      }),
  );

  // Sort by year descending
  entries.sort((a, b) => b.year - a.year);

  const byYear = new Map<number, TimelineEntry[]>();
  const tagIndex = new Map<string, string[]>();
  const yearSet = new Set<number>();

  for (const entry of entries) {
    // Group by year
    const group = byYear.get(entry.year) ?? [];
    group.push(entry);
    byYear.set(entry.year, group);
    yearSet.add(entry.year);

    // Tag index
    for (const tag of entry.tags) {
      const slugs = tagIndex.get(tag) ?? [];
      slugs.push(entry.slug);
      tagIndex.set(tag, slugs);
    }
  }

  const years = Array.from(yearSet).sort((a, b) => b - a);

  return { entries, byYear, years, tagIndex };
}
