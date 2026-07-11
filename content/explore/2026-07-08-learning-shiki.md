---
date: "2026-07-08"
mood: learning
tags:
  - DevTools
  - Syntax Highlighting
---

Spent the afternoon exploring [Shiki](https://shiki.style) for syntax highlighting. Unlike Prism or Highlight.js, Shiki uses TextMate grammars — the same engine that powers VS Code's syntax highlighting.

It works at build time, so there's zero runtime JS. Perfect for a static blog.

Also discovered that `rehype-pretty-code` supports **dual themes** (light + dark) out of the box. No more ugly single-theme code blocks!
