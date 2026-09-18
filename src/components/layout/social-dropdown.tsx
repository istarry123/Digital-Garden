"use client";

import { useEffect, useRef, useState } from "react";
import { blogConfig } from "@/config/blog.config";
import { SOCIAL_ICONS } from "@/components/layout/social-icons";

const { socialLinks } = blogConfig;

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/**
 * 社交链接下拉。
 * 同时支持 hover 与 click —— 触屏设备没有 hover，只靠 onMouseEnter
 * 在移动端不可靠（移动端抽屉里另有常驻入口）。
 */
export function SocialDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-raised hover:text-ink"
        aria-label="Social links"
        title="Social links"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <ShareIcon />
      </button>

      <div
        role="menu"
        aria-label="Social links"
        className={`absolute right-0 z-50 min-w-[9rem] rounded-control border border-hairline bg-overlay p-1 shadow-lg transition-all duration-150 ${
          open
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-1 opacity-0"
        }`}
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex items-center gap-3 rounded-control px-3 py-2 text-sm text-ink transition-colors hover:bg-raised"
          >
            <span className="text-muted">
              {SOCIAL_ICONS[link.icon] ?? null}
            </span>
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
