import type { Post, Activity } from "@/types";

export const mockPosts: Post[] = [
  {
    slug: "building-digital-garden",
    title: "Building a Digital Garden with Next.js 15",
    date: "2026-07-01",
    summary:
      "How I built this digital garden using Next.js 15 App Router, React Server Components, and Tailwind CSS v4.",
    tags: ["Next.js", "React", "TypeScript"],
    readingTime: 8,
    category: [],
    relations: { parent: null, related: [], children: [] },
  },
  {
    slug: "tailwind-v4-dark-mode",
    title: "Dark Mode in Tailwind CSS v4: The Right Way",
    date: "2026-06-20",
    summary:
      "Tailwind v4 changed how dark mode works. Here's how to set up class-based dark mode with next-themes.",
    tags: ["Tailwind", "CSS", "Design"],
    readingTime: 5,
    category: [],
    relations: { parent: null, related: [], children: [] },
  },
  {
    slug: "react-19-server-components",
    title: "React 19 Server Components in Practice",
    date: "2026-06-10",
    summary:
      "Lessons learned from migrating a client-heavy app to React Server Components — what worked, what didn't, and when to use 'use client'.",
    tags: ["React", "JavaScript", "Performance"],
    readingTime: 12,
    category: [],
    relations: { parent: null, related: [], children: [] },
  },
  {
    slug: "typescript-patterns-2026",
    title: "TypeScript Patterns I Use Every Day in 2026",
    date: "2026-05-28",
    summary:
      "A collection of TypeScript patterns that make my code safer and more expressive — from template literal types to satisfies.",
    tags: ["TypeScript", "JavaScript"],
    readingTime: 10,
    category: [],
    relations: { parent: null, related: [], children: [] },
  },
  {
    slug: "vercel-deploy-guide",
    title: "Deploying a Next.js Blog on Vercel: Zero to Production",
    date: "2026-05-15",
    summary:
      "A complete guide to deploying a Next.js blog on Vercel — custom domains, ISR, analytics, and CI/CD with GitHub Actions.",
    tags: ["Next.js", "DevOps", "Vercel"],
    readingTime: 7,
    category: [],
    relations: { parent: null, related: [], children: [] },
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "star",
    repo: "vercel/next.js",
    description: "Starred next.js — the React framework for the web",
    url: "https://github.com/vercel/next.js",
    date: "2026-07-10",
  },
  {
    id: "2",
    type: "commit",
    repo: "digital-garden",
    description: "Add theme system with next-themes and dropdown menu",
    url: "https://github.com/user/digital-garden/commit/abc123",
    date: "2026-07-09",
  },
  {
    id: "3",
    type: "pr",
    repo: "tailwindlabs/tailwindcss",
    description: "Merged PR #14592 — fix dark variant specificity in v4",
    url: "https://github.com/tailwindlabs/tailwindcss/pull/14592",
    date: "2026-07-08",
  },
  {
    id: "4",
    type: "issue",
    repo: "shikijs/shiki",
    description: "Opened issue — support for custom TextMate grammars in Shiki v2",
    url: "https://github.com/shikijs/shiki/issues/712",
    date: "2026-07-05",
  },
  {
    id: "5",
    type: "star",
    repo: "anthropics/claude-code",
    description: "Starred claude-code — CLI for Claude, Anthropic's AI assistant",
    url: "https://github.com/anthropics/claude-code",
    date: "2026-07-03",
  },
];
