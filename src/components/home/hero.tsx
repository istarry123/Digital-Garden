import Link from "next/link";
import { blogConfig } from "@/config/blog.config";
import { Container } from "@/components/layout/container";

const { hero, social } = blogConfig;

export interface HeroStat {
  label: string;
  value: string;
  href: string;
}

/**
 * 首页首屏。
 *
 * 结构对应"这个站的题材"：一个以 Linux / 网络 / 信息安全 / 运维为题材的
 * 技术花园。因此首屏用等宽提示行标出语境，用真实内容统计代替口号 ——
 * 索引行的数字全部来自 content/ 目录，是"花园在生长"的证据而不只是装饰。
 */
export function Hero({ stats }: { stats: HeroStat[] }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* 首屏唯一的装饰：极淡栅格 + 顶部径向淡出 */}
      <div
        aria-hidden="true"
        className="hero-grid pointer-events-none absolute inset-0 -z-10"
      />

      <Container width="prose" className="hero-enter pb-24 pt-28 sm:pt-32">
        <p className="flex items-center gap-2.5 font-mono text-xs text-faint">
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-1.5 shrink-0 bg-accent"
          />
          {hero.tagline}
        </p>

        <h1 className="mt-8">
          <span className="block text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[3.5rem]">
            {hero.greeting}
          </span>
          <span className="mt-4 block text-xl leading-snug text-muted sm:text-2xl">
            {hero.highlight}
          </span>
        </h1>

        <p className="mt-8 max-w-[34rem] text-base leading-[1.9] text-muted">
          {hero.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href={hero.buttons.primary.href}
            className="inline-flex items-center gap-2 rounded-control bg-accent-solid px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-solid-hover"
          >
            {hero.buttons.primary.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            {hero.buttons.github.label}
          </a>

          <a
            href={hero.buttons.rss.href}
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            {hero.buttons.rss.label}
          </a>
        </div>

        {stats.length > 0 && (
          <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-hairline pt-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-xs text-faint">{stat.label}</dt>
                <dd className="mt-1.5">
                  <Link
                    href={stat.href}
                    className="text-lg font-medium text-ink transition-colors hover:text-accent-text"
                  >
                    {stat.value}
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
