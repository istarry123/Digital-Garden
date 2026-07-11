"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export function GiscusComment({ config }: { config: GiscusConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const resolvedTheme = theme ?? "system";
  const giscusTheme = resolvedTheme === "dark" ? "dark" : "light";

  // Load Giscus script once on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", config.repo);
    script.setAttribute("data-repo-id", config.repoId);
    script.setAttribute("data-category", config.category);
    script.setAttribute("data-category-id", config.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    container.appendChild(script);
    // Only run once on mount — theme changes are handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme with Giscus iframe
  const sendTheme = useCallback(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame",
    );
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      "https://giscus.app",
    );
  }, [giscusTheme]);

  useEffect(() => {
    sendTheme();
  }, [sendTheme]);

  return (
    <section
      ref={containerRef}
      className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800"
      aria-label="Comments"
    />
  );
}
