import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { blogConfig } from "@/config/blog.config";

const { site, navigation } = blogConfig;

function ArticleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function RssIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  );
}

const navLinkClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-all duration-200 hover:scale-110 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/80 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-neutral-900 transition-colors hover:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-400"
        >
          {site.name}
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/posts"
            className={navLinkClass}
            title={navigation.articles.title}
            aria-label={navigation.articles.label}
          >
            <ArticleIcon />
            <span className="sr-only">{navigation.articles.label}</span>
          </Link>

          <Link
            href="/explore"
            className={navLinkClass}
            title={navigation.explore.title}
            aria-label={navigation.explore.label}
          >
            <ExploreIcon />
            <span className="sr-only">{navigation.explore.label}</span>
          </Link>

          <a
            href="/rss.xml"
            className={navLinkClass}
            title={navigation.rss.title}
            aria-label={navigation.rss.label}
          >
            <RssIcon />
            <span className="sr-only">{navigation.rss.label}</span>
          </a>

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
