import fs from "fs";
import path from "path";
import { cache } from "react";
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

/**
 * 全站笔记条目（含渲染好的 HTML）。
 *
 * 用 React cache 包裹：一次渲染里 Footer 会为了「最近更新日期」取一次，
 * /explore、首页、sitemap、标签聚合也会各自取一次；不缓存的话
 * content/explore 的 11 个文件会被重复读取 + 重复跑完整 Markdown→HTML 渲染。
 * 与 lib/tags.ts → getAllTagGroups 采用同一套去重机制。
 *
 * 注意：这里的 cache 只做「同一次渲染 / 构建过程中的去重」，
 * 不是跨请求的持久缓存，也不改变返回值的数量、顺序与字段。
 */
export const getAllExploreEntries = cache(
  async function getAllExploreEntries(): Promise<ExploreEntry[]> {
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
  },
);
