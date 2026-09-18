"use client";

import { useEffect, useState } from "react";

/** 复制当前文章链接；剪贴板不可用时退化为手动复制 */
export function CopyLink() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("复制文章链接：", url);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-8 items-center gap-1.5 rounded-control border border-hairline px-2.5 font-mono text-xs text-muted transition-colors hover:border-hairline-strong hover:text-ink"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? "已复制" : "复制链接"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "文章链接已复制到剪贴板" : ""}
      </span>
    </>
  );
}
