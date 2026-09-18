"use client";

import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { useRouter } from "next/navigation";

interface ArticleNodeData {
  slug: string;
  title: string;
  category: string[];
  tags: string[];
}

/**
 * 图谱节点 —— 只保留"标题 + 分类"。
 * 之前还叠了最多 3 个标签 chip，一屏几十个节点时会糊成一片；
 * 标签信息在图谱这个尺度上是噪音。
 */
export function ArticleNode({ data }: { data: ArticleNodeData }) {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/posts/${data.slug}`);
  }, [router, data.slug]);

  const catLabel = data.category.length > 0 ? data.category.join(" / ") : null;

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter") onClick();
      }}
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-control border border-hairline bg-surface px-4 py-2.5 shadow-card transition-colors hover:border-accent"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-1.5 !w-1.5 !border-0 !bg-hairline-strong"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-1.5 !w-1.5 !border-0 !bg-hairline-strong"
      />

      {catLabel && (
        <p className="mb-1 font-mono text-[0.65rem] tracking-wide text-faint">
          {catLabel}
        </p>
      )}

      <p className="max-w-[180px] text-sm font-medium leading-snug text-ink">
        {data.title}
      </p>
    </div>
  );
}
