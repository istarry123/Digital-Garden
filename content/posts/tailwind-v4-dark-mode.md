---
title: "Dark Mode in Tailwind CSS v4: The Right Way"
date: "2026-06-20"
description: "Tailwind v4 changed how dark mode works. Here's how to set up class-based dark mode with next-themes and avoid hydration mismatches in Next.js 15."
tags:
  - Tailwind
  - CSS
  - Design
category: "Web/CSS"
relations:
  parent: "building-digital-garden"
---

## What Changed in Tailwind v4

Tailwind CSS v4 made a subtle but important change to dark mode. In v3, you configured dark mode in `tailwind.config.ts`:

```ts
// Tailwind v3
export default {
  darkMode: "class",
  // ...
};
```

In v4, there's **no config file at all**. Instead, dark mode defaults to the `prefers-color-scheme` media query. To switch to class-based mode, you override the `dark` variant in your CSS:

```css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

## Why Class-Based Mode?

Media-query-based dark mode (`prefers-color-scheme: dark`) works well for sites that only follow the OS setting. But for a blog with a manual theme toggle, you need class-based mode.

The `next-themes` library works by adding `class="dark"` to the `<html>` element:

```html
<html class="dark" lang="en">
```

Tailwind's `dark:` prefix then matches elements inside this class:

```html
<div class="bg-white dark:bg-neutral-950">
  This div adapts to the theme
</div>
```

## Avoiding Hydration Mismatches

The trickiest part of dark mode in Next.js is avoiding the **flash of wrong theme**. Here's the solution:

1. Add `suppressHydrationWarning` to `<html>`
2. Use `next-themes` which injects an inline `<script>` before React hydrates
3. In toggle components, use a `mounted` state pattern:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) {
  return <div className="h-9 w-9" />; // placeholder
}
```

This ensures the server and client render identical HTML on the first pass.

## The `@variant` Syntax in Detail

The `@variant dark (&:where(.dark, .dark *))` line uses the `:where()` pseudo-class. This is important because `:where()` has **zero specificity** — it won't accidentally override other styles.

Compare:

| Selector | Specificity |
|----------|-------------|
| `.dark .dark\:text-white` | `0,2,0` |
| `:where(.dark, .dark *) .dark\:text-white` | `0,1,0` |

Using `:where()` keeps the CSS cascade predictable.
