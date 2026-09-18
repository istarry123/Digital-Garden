"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { blogConfig } from "@/config/blog.config";
import { NAV_ICONS } from "@/components/layout/nav-icons";

const { navigation } = blogConfig;

export interface NavItem {
  href: string;
  label: string;
  title: string;
  iconKey: string;
}

/** 导航项全部来自 blogConfig.navigation，组件内不硬编码路由 */
export const NAV_ITEMS: NavItem[] = [
  { ...navigation.articles },
  { ...navigation.explore },
  { ...navigation.graph },
  { ...navigation.timeline },
  { ...navigation.tags },
];

export const RSS_ITEM: NavItem = { ...navigation.rss };

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * 桌面端导航 —— 图标形态。
 *
 * 顶栏放 6 个文字标签会让它显得很长、很挤，所以这里只留图标。
 * 代价是图标无法自解释，因此两件事必须做到：
 *   1. 每个图标都有 title 悬浮提示 + aria-label 可访问名称（两者同源，都来自配置）；
 *   2. 当前页用强调色药丸底 + aria-current 标出 —— 图形界面里"我在哪"只能靠这个。
 * 移动端因为位置充足，抽屉里仍然是"图标 + 文字"，可发现性在那里解决。
 */
export function NavMenu() {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-0.5 md:flex">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              title={item.title}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-control transition-colors ${
                active
                  ? "bg-accent-quiet text-accent-text"
                  : "text-muted hover:bg-raised hover:text-ink"
              }`}
            >
              {NAV_ICONS[item.iconKey] ?? null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
