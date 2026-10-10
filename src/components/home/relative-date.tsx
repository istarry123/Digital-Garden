"use client";

import { useEffect, useState } from "react";
import { formatRelativeDays } from "@/lib/content-date";

/**
 * 首页索引行的「最近更新」——「今天 / 昨天 / 13 天前」。
 *
 * 为什么要放到 Client Component：
 * 首页是全站预渲染的静态快照（零 revalidate），如果在 Server Component 里
 * 读时钟，`Date.now()` 只会在 `next build` 那一刻执行一次，算出来的
 * "3 天前"会被永久写进 HTML —— 部署次日就开始失真。相对时间只有在
 * **访问者打开页面时**才有意义，所以只能由浏览器来算。
 *
 * 为什么不会 hydration mismatch：
 *   - `fallback` 是 Server Component 传下来的、服务端已经格式化好的**绝对日期**
 *   - 服务端渲染的是它，客户端首次渲染时 state 初值也是它 → 两边完全一致
 *   - 挂载完成后（useEffect）才换成相对时间，这次更新发生在 hydration 之后
 * 所以不需要 suppressHydrationWarning 兜底。
 *
 * 为什么 fallback 选绝对日期而不是空占位：
 * 禁用 JS 或首屏那一刻，读者看到的是"Sep 27, 2026"—— 一个永远为真的答案，
 * 好过一句不知何时算出来的"3 天前"，也不会让这一格先塌成空白再跳变。
 *
 * 只在挂载时算一次，不挂定时器、不轮询：这一格是内容新鲜度的标注，
 * 不是实时计数器，没有必要为它引入持续运行的代价。
 */
export function RelativeDate({
  date,
  fallback,
}: {
  /** 内容日期，frontmatter 的 `YYYY-MM-DD` */
  date: string;
  /** 服务端格式化好的绝对日期，用于首屏与无 JS 场景 */
  fallback: string;
}) {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    setLabel(formatRelativeDays(date, new Date()));
  }, [date]);

  return <>{label}</>;
}
