import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypeImageOptimizer } from "@/lib/rehype-image-optimizer";
import type { ExploreEntry } from "@/types";

const exploreDirectory = path.join(process.cwd(), "content", "explore");

interface ExploreFrontmatter {
  date: string;
  mood: string;
  tags?: string[];
}

async function renderContent(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeImageOptimizer)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

export async function getAllExploreEntries(): Promise<ExploreEntry[]> {
  if (!fs.existsSync(exploreDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(exploreDirectory);

  const entries = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(exploreDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        const frontmatter = data as ExploreFrontmatter;

        const html = await renderContent(content);

        return {
          slug,
          date: frontmatter.date,
          mood: frontmatter.mood ?? "thoughtful",
          tags: frontmatter.tags ?? [],
          content: html,
        } satisfies ExploreEntry;
      }),
  );

  return entries
    .filter((entry) => entry.date)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
