import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SocialDropdown } from "@/components/layout/social-dropdown";
import { NavMenu } from "@/components/layout/nav-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/layout/container";
import { NAV_ICONS } from "@/components/layout/nav-icons";
import { blogConfig } from "@/config/blog.config";

const { site, navigation } = blogConfig;

/**
 * 导航栏。
 *
 * 顶栏只用图标（6 个文字标签会把顶栏拉得很长、很拥挤）。
 * 分隔线把"页面导航"和"工具入口"分成两组，避免 8 个图标连成一片。
 * 每个图标都带 title 悬浮提示与可访问名称，当前页用强调色药丸底标出。
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/80 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-ink transition-colors hover:text-accent-text"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-1">
          <NavMenu />

          <div
            aria-hidden="true"
            className="mx-1.5 hidden h-4 w-px bg-hairline md:block"
          />

          <div className="flex items-center gap-0.5">
            <a
              href={navigation.rss.href}
              title={navigation.rss.title}
              aria-label={navigation.rss.label}
              className="hidden h-9 w-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-raised hover:text-ink md:inline-flex"
            >
              {NAV_ICONS.rss}
            </a>

            <SocialDropdown />

            <ThemeToggle />

            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
