import type { ReactNode } from "react";

/**
 * 导航图标 —— 只在移动端抽屉里作为"快速识别"使用；
 * 桌面端用文字标签（图标无法自解释，这是可发现性问题）。
 * 全部图标共用同一套描边参数，保证视觉一致。
 */
const stroke = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const NAV_ICONS: Record<string, ReactNode> = {
  articles: (
    <svg {...stroke} className="h-4.5 w-4.5" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  explore: (
    <svg {...stroke} className="h-4.5 w-4.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  graph: (
    <svg {...stroke} className="h-4.5 w-4.5" aria-hidden="true">
      <circle cx="5" cy="7" r="2" />
      <circle cx="19" cy="17" r="2" />
      <circle cx="12" cy="19" r="2" />
      <line x1="6.5" y1="8.5" x2="17.5" y2="15.5" />
      <line x1="10" y1="18" x2="17.5" y2="16.5" />
    </svg>
  ),
  timeline: (
    <svg {...stroke} className="h-4.5 w-4.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  tags: (
    <svg {...stroke} className="h-4.5 w-4.5" aria-hidden="true">
      <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V4a2 2 0 0 1 2-2h8l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  ),
  rss: (
    <svg {...stroke} className="h-4.5 w-4.5" aria-hidden="true">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  ),
};
