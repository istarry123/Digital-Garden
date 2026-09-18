"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { blogConfig } from "@/config/blog.config";
import { NAV_ICONS } from "@/components/layout/nav-icons";
import { SOCIAL_ICONS } from "@/components/layout/social-icons";
import {
  NAV_ITEMS,
  RSS_ITEM,
  isActivePath,
} from "@/components/layout/nav-menu";

const { socialLinks } = blogConfig;

/**
 * 移动端导航：汉堡按钮 + 抽屉面板。
 * 原先导航只有一排图标且没有移动端方案，触屏用户既看不清图标含义，
 * 也点不准 36px 的图标按钮；这里改为整行 48px 的"图标 + 文字"。
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 路由变化后自动收起
  useEffect(() => setOpen(false), [pathname]);

  // Escape 关闭并把焦点交还按钮
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-raised hover:text-ink"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-canvas/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <nav
            id="mobile-nav-panel"
            aria-label="Mobile navigation"
            className="fixed inset-x-0 top-16 z-50 border-b border-hairline bg-overlay px-6 py-4 shadow-lg"
          >
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex h-12 items-center gap-3 rounded-control px-3 text-sm transition-colors ${
                        active
                          ? "bg-accent-quiet text-ink"
                          : "text-muted hover:bg-raised hover:text-ink"
                      }`}
                    >
                      <span
                        className={active ? "text-accent-text" : "text-faint"}
                      >
                        {NAV_ICONS[item.iconKey] ?? null}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <a
                  href={RSS_ITEM.href}
                  className="flex h-12 items-center gap-3 rounded-control px-3 text-sm text-muted transition-colors hover:bg-raised hover:text-ink"
                >
                  <span className="text-faint">
                    {NAV_ICONS[RSS_ITEM.iconKey] ?? null}
                  </span>
                  {RSS_ITEM.label}
                </a>
              </li>
            </ul>

            <div className="mt-3 flex items-center gap-1 border-t border-hairline pt-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  title={link.name}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-control text-muted transition-colors hover:bg-raised hover:text-ink"
                >
                  {SOCIAL_ICONS[link.icon] ?? null}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
