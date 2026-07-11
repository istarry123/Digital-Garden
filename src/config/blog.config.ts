/**
 * Central blog configuration — single source of truth.
 * Every component and page MUST read from this config.
 * No hardcoded site-identity strings anywhere else.
 */

export const blogConfig = {
  // ---- Site identity ----
  site: {
    name: "Digital Garden",
    title: "Digital Garden",
    description:
      "A personal digital garden — notes, essays, and explorations about web development, tools, and systems.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digitalgarden.vercel.app",
    language: "zh-CN",
    locale: "en-US",
  },

  // ---- Author ----
  author: {
    name: "Digital Garden",
    bio: "A developer who writes about web, tools, and systems. Building things and sharing what I learn along the way.",
    avatar: "/images/avatar.png",
  },

  // ---- Favicon & Logo ----
  branding: {
    favicon: "/favicon.ico",
    logo: "/images/logo.png",
  },

  // ---- Homepage hero ----
  hero: {
    tagline: "Welcome to my corner of the internet",
    greeting: "Hi, I&apos;m a developer",
    highlight: "web, tools &amp; systems",
    description:
      "This is my digital garden — a space where I share notes, essays, and things I learn along the way. No pressure to be perfect, just a place to think in public.",
  },

  // ---- Social links ----
  social: {
    github: "https://github.com",
    twitter: "@digitalgarden",
  },

  // ---- Page metadata ----
  pages: {
    posts: {
      title: "Articles",
      heading: "Articles",
      description:
        "All articles from Digital Garden — notes, essays, and explorations.",
      emptyText: "No articles yet. Check back soon.",
      viewAll: "View all",
      latestHeading: "Latest Articles",
    },
    explore: {
      title: "Explore",
      heading: "Explore",
      description:
        "Short thoughts, quick notes, and things I discover — a micro-blog timeline.",
      emptyText: "Nothing here yet. Check back soon.",
      viewAll: "View all",
      latestHeading: "Latest Explore",
    },
  },

  // ---- Posts configuration ----
  posts: {
    postsPerPage: 9,
    readingSpeedWpm: 200,
    relatedPostsLimit: 3,
    dateLocale: "en-US",
  },

  // ---- Code highlighting ----
  codeHighlighting: {
    theme: {
      light: "github-light" as const,
      dark: "github-dark-dimmed" as const,
    },
    defaultLanguage: "plaintext",
    grid: true,
  },

  // ---- RSS ----
  rss: {
    enabled: true,
  },

  // ---- Comments (Giscus) ----
  comments: {
    provider: "giscus" as const,
    giscus: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "",
      repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "General",
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
    },
    labels: {
      title: "Comments",
    },
  },

  // ---- Search (future) ----
  search: {
    enabled: false,
  },

  // ---- Analytics (future) ----
  analytics: {
    enabled: false,
    provider: "umami" as const,
    umamiId: "",
  },

  // ---- Theme ----
  theme: {
    defaultTheme: "system" as const,
    themes: ["light", "dark", "system"] as const,
    attribute: "class" as const,
  },

  // ---- Navigation ----
  navigation: {
    articles: {
      label: "Articles",
      title: "Articles",
    },
    explore: {
      label: "Explore",
      title: "Explore",
    },
    rss: {
      label: "RSS Feed",
      title: "RSS Feed",
    },
  },

  // ---- TOC ----
  toc: {
    heading: "On this page",
  },

  // ---- Related articles ----
  relatedArticles: {
    heading: "Related Articles",
  },

  // ---- Miscellaneous ----
  notFound: {
    title: "404",
    description: "Page not found",
    backHome: "Back to home",
    tagline: "",
  },
} as const;

/** Inferred type of the full config object. */
export type BlogConfig = typeof blogConfig;
