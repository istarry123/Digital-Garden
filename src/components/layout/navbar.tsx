import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SocialDropdown } from "@/components/layout/social-dropdown";
import { blogConfig } from "@/config/blog.config";
import type { ReactNode } from "react";

const { site, navigation } = blogConfig;

// ===================================================================
// Icon mapping dictionary — all icons share same styles
// ===================================================================
const ICONS: Record<string, ReactNode> = {
  articles: (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  explore: (
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
  ),
  graph: (
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
      <circle cx="5" cy="7" r="2" />
      <circle cx="19" cy="17" r="2" />
      <circle cx="12" cy="19" r="2" />
      <line x1="6.5" y1="8.5" x2="17.5" y2="15.5" />
      <line x1="10" y1="18" x2="17.5" y2="16.5" />
    </svg>
  ),
  timeline: (
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  rss: (
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
  ),
};

// ===================================================================
// Reusable nav link wrapper
// ===================================================================
const navLinkClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-all duration-200 hover:scale-110 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400";

interface NavLinkProps {
  href: string;
  title: string;
  label: string;
  iconKey: string;
  external?: boolean;
}

function NavLink({ href, title, label, iconKey, external }: NavLinkProps) {
  const icon = ICONS[iconKey] ?? null;
  const className = `${navLinkClass}`;

  if (external) {
    return (
      <a href={href} className={className} title={title} aria-label={label}>
        {icon}
        <span className="sr-only">{label}</span>
      </a>
    );
  }

  return (
    <Link href={href} className={className} title={title} aria-label={label}>
      {icon}
      <span className="sr-only">{label}</span>
    </Link>
  );
}

// ===================================================================
// Navbar
// ===================================================================
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
          <NavLink
            href="/posts"
            title={navigation.articles.title}
            label={navigation.articles.label}
            iconKey={navigation.articles.iconKey}
          />

          <NavLink
            href="/explore"
            title={navigation.explore.title}
            label={navigation.explore.label}
            iconKey={navigation.explore.iconKey}
          />

          <NavLink
            href="/rss.xml"
            title={navigation.rss.title}
            label={navigation.rss.label}
            iconKey={navigation.rss.iconKey}
            external
          />

          <NavLink
            href="/graph"
            title={navigation.graph.title}
            label={navigation.graph.label}
            iconKey={navigation.graph.iconKey}
          />

          <NavLink
            href="/timeline"
            title={navigation.timeline.title}
            label={navigation.timeline.label}
            iconKey={navigation.timeline.iconKey}
          />

          <SocialDropdown />

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
