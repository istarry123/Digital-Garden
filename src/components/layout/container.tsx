import type { ElementType, ReactNode } from "react";

/**
 * 全站统一容器。
 *
 * 页面宽度不再各页自行决定（此前 2xl / 5xl / 7xl 混用，导致换页时
 * 内容左边缘横向跳动），而是收敛为三种语义宽度：
 *
 *   prose   44rem   阅读型页面：文本列、正文、时间线
 *   list    68rem   列表型页面与导航/页脚
 *   wide    80rem   宽视图：知识图谱
 *   reading 62rem   文章详情：正文列 + 目录侧栏作为一个整体
 */
const WIDTHS = {
  prose: "max-w-[44rem]",
  list: "max-w-[68rem]",
  reading: "max-w-[62rem]",
  wide: "max-w-[80rem]",
} as const;

export type ContainerWidth = keyof typeof WIDTHS;

interface ContainerProps {
  children: ReactNode;
  /** 语义宽度，默认 list */
  width?: ContainerWidth;
  /** 渲染为其它元素（如 nav / footer / main） */
  as?: ElementType;
  className?: string;
}

export function Container({
  children,
  width = "list",
  as: Tag = "div",
  className = "",
}: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full px-6 ${WIDTHS[width]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
