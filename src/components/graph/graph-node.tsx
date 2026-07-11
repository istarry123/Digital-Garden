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

export function ArticleNode({ data }: { data: ArticleNodeData }) {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/posts/${data.slug}`);
  }, [router, data.slug]);

  const catLabel = data.category.length > 0 ? data.category.join(" / ") : null;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border-2 border-neutral-300 bg-white px-5 py-3 shadow-md transition-shadow hover:shadow-lg dark:border-neutral-600 dark:bg-neutral-900"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-neutral-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-neutral-400" />

      {catLabel && (
        <p className="mb-1 text-[0.65rem] font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
          {catLabel}
        </p>
      )}

      <p className="max-w-[180px] text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
        {data.title}
      </p>

      {data.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {data.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.65rem] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
