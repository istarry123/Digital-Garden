import type { TocItem } from "@/types";
import { blogConfig } from "@/config/blog.config";

const { toc } = blogConfig;

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-neutral-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-neutral-700/50 dark:bg-neutral-950/70"
    >
      <h2 className="mb-3 text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
        {toc.heading}
      </h2>
      <ul className="space-y-0.5 border-l border-neutral-200 dark:border-neutral-700">
        {items.map((item) => (
          <li
            key={item.slug}
            className={item.level === 3 ? "pl-3" : ""}
          >
            <a
              href={`#${item.slug}`}
              className="block py-1 text-sm leading-snug text-neutral-500 transition-colors duration-200 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
