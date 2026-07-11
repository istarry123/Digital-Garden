---
date: "2026-07-05"
mood: creative
tags:
  - Design
  - CSS
---

Weekend project: rebuilt the theme toggle with a dropdown menu instead of a cycling button. Three modes — Light, Dark, System — with a clean glass-morphism menu.

The tricky part was getting Tailwind CSS v4's class-based dark mode to work with `next-themes`. The fix was one line:

```css
@variant dark (&:where(.dark, .dark *));
```

Sometimes the simplest solutions take the longest to find.
