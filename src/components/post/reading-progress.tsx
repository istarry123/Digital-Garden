"use client";

import { useEffect, useState } from "react";

/**
 * 阅读进度线 —— 贴在导航栏下沿的 1px 指示条。
 * 它是对"用户正在滚动"的回应（不是自发动画），因此不违反"克制动效"原则。
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const scrollable = root.scrollHeight - root.clientHeight;
      setProgress(
        scrollable > 0 ? Math.min(1, root.scrollTop / scrollable) : 0,
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-16 z-30 h-px bg-transparent"
    >
      <div
        className="h-px bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
