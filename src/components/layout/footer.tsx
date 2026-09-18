import Link from "next/link";
import { blogConfig } from "@/config/blog.config";
import { Container } from "@/components/layout/container";
import { getAllPosts } from "@/lib/posts";
import { getAllExploreEntries } from "@/lib/explore";
import { formatDate } from "@/lib/format";

const { site, footer, navigation, socialLinks } = blogConfig;

// ===================================================================
// 页脚 —— 三栏结构：身份 / 导航 / 联系，底部是版权与备案
//
// 它承担的是"全站最后一张地图"：读者读到底部时仍能横向移动，
// 而不是只看到一行版权。内容最近更新日期来自真实数据，
// 呼应 digital garden"持续生长"的含义。
// ===================================================================
export async function Footer() {
  const { copyrightSince, copyrightName, icp } = footer;
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > copyrightSince
      ? `${copyrightSince}–${currentYear}`
      : `${copyrightSince}`;

  const [posts, explore] = await Promise.all([
    getAllPosts(),
    getAllExploreEntries(),
  ]);
  const dates = [posts[0]?.date, explore[0]?.date].filter(
    (date): date is string => Boolean(date),
  );
  const latest = dates.sort()[dates.length - 1];

  const navItems = [
    navigation.articles,
    navigation.explore,
    navigation.graph,
    navigation.timeline,
    navigation.tags,
  ];

  return (
    <footer className="mt-24 border-t border-hairline">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-base font-semibold tracking-tight text-ink">
              {site.name}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            {latest && (
              <p className="mt-4 font-mono text-xs text-faint">
                最近更新 {formatDate(latest)}
              </p>
            )}
          </div>

          <nav aria-label="页脚导航">
            <p className="font-mono text-xs text-faint">导航</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-xs text-faint">联系</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-ink"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={navigation.rss.href}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {navigation.rss.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6 font-mono text-xs text-faint">
          <p>
            © {yearRange} {copyrightName}
          </p>

          {icp.enabled && (
            <a
              href={icp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-muted"
            >
              {icp.number}
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}
