---
title: "Building a Digital Garden with Next.js 15"
date: "2026-07-01"
description: "How I built this digital garden using Next.js 15 App Router, React Server Components, and Tailwind CSS v4 — from project scaffolding to deployment on Vercel."
tags:
  - Next.js
  - React
  - TypeScript
category: "Web/Next.js"
relations:
  related:
    - "tailwind-v4-dark-mode"
cover: "https://picsum.photos/seed/digital-garden/1200/630"
---

## Why a Digital Garden?

A digital garden is not a blog. Blogs are chronological streams of polished posts. A digital garden is a collection of evolving ideas — notes, essays, and half-formed thoughts that grow over time. It's a place to **think in public**, not just publish finished work.

I chose to build mine with Next.js 15 for three reasons:

1. **React Server Components** — ship zero JavaScript to the client by default
2. **File-system routing** — the `app/` directory maps directly to URLs
3. **Vercel** — deploy with a single `git push`

## Project Setup

The scaffold is minimal. Here's the core configuration:

![Project structure diagram](/images/project-structure.png)

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

With Tailwind CSS v4, the CSS setup is just two lines:

```css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

The `@variant` directive switches dark mode from media-query based to class-based, which is required for `next-themes` to work correctly.

## Content Pipeline

I chose Markdown files stored in a `content/` directory as the content database. The pipeline:

- **gray-matter** parses frontmatter (title, date, tags, description)
- **remark** + **rehype** convert Markdown to HTML at build time
- **Tailwind Typography** styles the rendered HTML with the `prose` class

This means _zero_ client-side JavaScript for content rendering — everything is pre-rendered at build time.

## Theme System

The theme system uses `next-themes` with three modes:

| Mode   | Behavior                          |
|--------|-----------------------------------|
| Light  | Always light                      |
| Dark   | Always dark                       |
| System | Follows OS preference             |

A `<ThemeToggle />` component in the navbar lets visitors switch modes. The preference is persisted in `localStorage` so it survives page refreshes.

## Key Takeaway

> The best tool for a personal site is the one you enjoy maintaining.

Next.js 15 strikes a great balance — powerful enough for complex apps, simple enough for a blog. And with React Server Components, the performance is excellent out of the box.
