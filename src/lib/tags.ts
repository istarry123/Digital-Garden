import { cache } from "react";
import type { Post, ExploreEntry, TimelineEntry } from "@/types";
import { getAllPosts } from "@/lib/posts";
import { getAllExploreEntries } from "@/lib/explore";
import { getTimeline } from "@/lib/timeline";

export interface TagGroup {
  /** 原始标签文本，用于展示与匹配 */
  tag: string;
  /** 归档页链接 */
  href: string;
  /** 三类内容的合计条目数 */
  count: number;
  posts: Post[];
  notes: ExploreEntry[];
  milestones: TimelineEntry[];
}

/** 标签 → URL 段。中文与空格都要编码（本站 5 个标签含空格、5 个含中文） */
export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * 全站标签索引。
 *
 * 同一个标签可能同时出现在文章、笔记、里程碑里（本站 Next.js / Docker 就是），
 * 所以归档是按"标签"聚合三类内容，而不是只聚合文章。
 *
 * 用 React cache 包裹：一次渲染里 generateStaticParams、generateMetadata、
 * 页面组件都会取这份数据，不缓存的话会把 content/ 重复解析三遍。
 */
export const getAllTagGroups = cache(async (): Promise<TagGroup[]> => {
  const [posts, notes, timeline] = await Promise.all([
    getAllPosts(),
    getAllExploreEntries(),
    getTimeline(),
  ]);

  const groups = new Map<string, TagGroup>();

  const ensure = (tag: string): TagGroup => {
    const existing = groups.get(tag);
    if (existing) return existing;

    const created: TagGroup = {
      tag,
      href: tagHref(tag),
      count: 0,
      posts: [],
      notes: [],
      milestones: [],
    };
    groups.set(tag, created);
    return created;
  };

  for (const post of posts) {
    for (const tag of post.tags) {
      const group = ensure(tag);
      group.posts.push(post);
      group.count += 1;
    }
  }

  for (const note of notes) {
    for (const tag of note.tags) {
      const group = ensure(tag);
      group.notes.push(note);
      group.count += 1;
    }
  }

  for (const milestone of timeline.entries) {
    for (const tag of milestone.tags) {
      const group = ensure(tag);
      group.milestones.push(milestone);
      group.count += 1;
    }
  }

  // 用得多的标签排在前面，其次按名称
  return [...groups.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
});

/** 按 URL 段取标签（同时接受原始值、已编码值与 catch-all 拼接值） */
export async function getTagGroup(
  segment: string | string[],
): Promise<TagGroup | null> {
  const raw = Array.isArray(segment) ? segment.join("/") : segment;
  const decoded = safeDecode(raw);
  const groups = await getAllTagGroups();

  return (
    groups.find(
      (group) =>
        group.tag === raw ||
        group.tag === decoded ||
        group.href === `/tags/${raw}`,
    ) ?? null
  );
}

/** 标签归档的分类计数文案，例如 ["3 篇文章", "1 条笔记"] */
export function tagBreakdown(group: TagGroup): string[] {
  return [
    group.posts.length > 0 ? `${group.posts.length} 篇文章` : null,
    group.notes.length > 0 ? `${group.notes.length} 条笔记` : null,
    group.milestones.length > 0 ? `${group.milestones.length} 个里程碑` : null,
  ].filter((part): part is string => part !== null);
}
