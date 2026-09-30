import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { rehypeImageOptimizer } from "@/lib/rehype-image-optimizer";
import GithubSlugger from "github-slugger";
import type { Post, PostRelations, TocItem } from "@/types";

const postsDirectory = path.join(process.cwd(), "content", "posts");

interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  cover?: string;
  category?: string;
  relations?: {
    parent?: string;
    related?: string[];
    children?: string[];
  };
}

function parseCategory(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseRelations(raw: PostFrontmatter["relations"]): PostRelations {
  return {
    parent: raw?.parent ?? null,
    related: raw?.related ?? [],
    children: raw?.children ?? [],
  };
}

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const slug = slugger.slug(text);
    items.push({ level, text, slug });
  }

  return items;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultLang: "plaintext",
      grid: true,
      /**
       * 不处理行内代码。
       * 默认行为会把行内 `code` 也包成 <span data-rehype-pretty-code-figure>，
       * 于是被代码块样式命中（display:block），整段正文会被切成一格一行的碎片。
       * 行内代码应当由 Typography 的行内样式负责，而不是 shiki。
       */
      bypassInlineCode: true,
    })
    .use(rehypeImageOptimizer)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

/**
 * 全站文章元信息。
 *
 * 用 React cache 包裹：一次渲染里 Footer、getRelatedPosts、页面组件都会各自取一次，
 * 不缓存的话 content/posts 的 20 个文件会被重复读取 + gray-matter 解析多次。
 * 与 lib/tags.ts → getAllTagGroups 采用同一套去重机制。
 *
 * 注意：这里的 cache 只做「同一次渲染 / 构建过程中的去重」，
 * 不是跨请求的持久缓存，也不改变返回值的数量、顺序与字段。
 */
export const getAllPosts = cache(async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      const frontmatter = data as PostFrontmatter;

      return {
        slug,
        title: frontmatter.title,
        date: frontmatter.date,
        summary: frontmatter.description,
        tags: frontmatter.tags ?? [],
        readingTime: calculateReadingTime(fileContents),
        cover: frontmatter.cover,
        category: parseCategory(frontmatter.category),
        relations: parseRelations(frontmatter.relations),
      } satisfies Post;
    })
    .filter((post) => post.title && post.date)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
});

/**
 * 同一 slug 的文章详情。
 *
 * 用 React cache 包裹：一次渲染里 generateMetadata 与页面组件都会取同一篇文章，
 * 不缓存的话 Markdown 解析与 Shiki 高亮（本站最贵的两步）会完整跑两遍。
 * 与 lib/tags.ts → getAllTagGroups 采用同一套去重机制。
 *
 * 注意：这里的 cache 只做「同一次渲染 / 构建过程中的去重」，
 * 不是跨请求的持久缓存，也不改变返回值。
 */
export const getPostBySlug = cache(
  async function getPostBySlug(
    slug: string,
  ): Promise<(Post & { content: string; toc: TocItem[] }) | null> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;

    if (!frontmatter.title || !frontmatter.date) {
      return null;
    }

    const html = await markdownToHtml(content);
    const toc = extractToc(content);

    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      summary: frontmatter.description,
      tags: frontmatter.tags ?? [],
      readingTime: calculateReadingTime(fileContents),
      cover: frontmatter.cover,
      category: parseCategory(frontmatter.category),
      relations: parseRelations(frontmatter.relations),
      content: html,
      toc,
    };
  },
);

export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3,
): Promise<Post[]> {
  const allPosts = await getAllPosts();

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      overlap: post.tags.filter((t) => tags.includes(t)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ post }) => post);
}
