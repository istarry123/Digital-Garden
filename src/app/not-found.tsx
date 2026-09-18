import Link from "next/link";
import { blogConfig } from "@/config/blog.config";
import { Container } from "@/components/layout/container";

const { notFound, navigation } = blogConfig;

const nextSteps = [
  navigation.articles,
  navigation.explore,
  navigation.timeline,
];

/**
 * 404 —— 不是终点，而是"重新导航"的一屏：
 * 用与首屏一致的语气说明发生了什么，并给出下一步能去哪。
 */
export default function NotFound() {
  return (
    <Container
      as="main"
      width="prose"
      className="flex flex-1 flex-col justify-center py-24"
    >
      <p className="flex items-center gap-2.5 font-mono text-xs text-faint">
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-1.5 shrink-0 bg-accent"
        />
        {notFound.title}
      </p>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {notFound.description}
      </h1>

      <p className="mt-4 max-w-[34rem] leading-relaxed text-muted">
        {notFound.hint}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
        <Link
          href="/"
          className="text-accent-text underline-offset-4 hover:underline"
        >
          {notFound.backHome}
        </Link>
        {nextSteps.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted transition-colors hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </Container>
  );
}
