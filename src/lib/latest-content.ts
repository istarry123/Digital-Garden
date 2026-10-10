import { pickLatestContentDate } from "@/lib/content-date";
import { getAllExploreEntries } from "@/lib/explore";
import { getAllPosts } from "@/lib/posts";

/**
 * 全站最新内容日期（归一化的 `YYYY-MM-DD`，没有可用日期时返回 null）。
 *
 * 首页索引行的「最近更新」和页脚的「最近更新」都只能从这里取，
 * 避免两处各写一份"取 posts[0] / explore[0] 再排序"的逻辑再次分叉。
 *
 * 这里只负责取数据 + 拼成一组日期，挑选逻辑在 lib/content-date.ts 的
 * pickLatestContentDate（纯函数，可脱离 Next 环境单独验证）。
 *
 * 两个 loader 都已被 React cache 包裹，与页面组件共用同一份结果，
 * 因此这里不产生额外的读盘或 Markdown 渲染。
 */
export async function getLatestContentDate(): Promise<string | null> {
  const [posts, explore] = await Promise.all([
    getAllPosts(),
    getAllExploreEntries(),
  ]);

  return pickLatestContentDate([
    ...posts.map((post) => post.date),
    ...explore.map((entry) => entry.date),
  ]);
}
