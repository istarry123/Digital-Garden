"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/types";
import { blogConfig } from "@/config/blog.config";

const { toc } = blogConfig;

/** 判定"当前章节"的基准线：导航栏高度 + 一点余量 */
const ACTIVE_OFFSET = 112;

/**
 * 文章目录 —— 贴着正文的一条发丝线索引，并标出正在读哪一节。
 *
 * 三处关键行为：
 * 1) 高亮用"最后一个越过基准线的标题"计算，而不是 IntersectionObserver：
 *    观察带会把"通过锚点直接跳到某一节"的情况漏掉（标题恰好落在带子上方），
 *    那时高亮会卡住不动。滚动计算是确定性的，没有盲区。
 * 2) 目录自身是 sticky + 独立滚动容器。文章目录可能很长（本站最长 81 项），
 *    只有 sticky 而没有滚动能力的话，超出视口的部分永远够不到。
 * 3) 当前项自动滚入目录自己的可见区 —— 只调整本容器的 scrollTop，不动整页。
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    items[0]?.slug ?? null,
  );
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.slug))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headings.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= root.scrollHeight - 4;

      let current = headings[0].id;
      if (atBottom) {
        current = headings[headings.length - 1].id;
      } else {
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top <= ACTIVE_OFFSET) {
            current = heading.id;
          } else {
            break;
          }
        }
      }

      setActiveSlug(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // 当前项始终留在目录的可见区内（只滚目录容器，不滚整页）
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const active = nav.querySelector<HTMLAnchorElement>(
      '[aria-current="location"]',
    );
    if (!active) return;

    const navBox = nav.getBoundingClientRect();
    const itemBox = active.getBoundingClientRect();
    const margin = 16;

    if (itemBox.top < navBox.top + margin) {
      nav.scrollTop -= navBox.top + margin - itemBox.top;
    } else if (itemBox.bottom > navBox.bottom - margin) {
      nav.scrollTop += itemBox.bottom - (navBox.bottom - margin);
    }
  }, [activeSlug]);

  if (items.length === 0) return null;

  return (
    <nav
      ref={navRef}
      aria-label="文章目录"
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain pr-2"
    >
      <p className="mb-3 font-mono text-xs tracking-wide text-faint">
        {toc.heading}
      </p>
      <ul className="space-y-0.5 border-l border-hairline">
        {items.map((item) => {
          const active = item.slug === activeSlug;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px block border-l py-1 text-sm leading-snug transition-colors ${
                  item.level === 3 ? "pl-5" : "pl-3"
                } ${
                  active
                    ? "border-accent text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
