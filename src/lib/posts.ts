import fs from "fs";
import path from "path";
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
import type { Post, TocItem } from "@/types";

const postsDirectory = path.join(process.cwd(), "content", "posts");

interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  cover?: string;
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
        dark: "github-dark-dimmed",
      },
      defaultLang: "plaintext",
      grid: true,
    })
    .use(rehypeImageOptimizer)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

export async function getAllPosts(): Promise<Post[]> {
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
      } satisfies Post;
    })
    .filter((post) => post.title && post.date)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export async function getPostBySlug(
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
    content: html,
    toc,
  };
}

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
