"use client";

import Image from "next/image";
import { useState } from "react";
import { isOptimizableSrc, warnUnconfiguredHost } from "@/lib/image-host";

interface CoverImageProps {
  src: string;
  sizes: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

/**
 * 封面图。两层降级，任何一层都不允许把整页弄崩：
 *
 * 1. 域名未登记进 next.config.ts 的 images.remotePatterns 时，next/image 的
 *    defaultLoader 会直接抛错（Runtime Error，整页白屏）。这种情况改用
 *    `unoptimized` —— 它在调用 loader 之前就返回，因此跳过域名校验：
 *    图片不经过优化，但能正常显示，内容侧换图床不再是故障。
 * 2. 加载失败（404 / 500 / CDN 挂了）时换成同尺寸中性色块，避免出现破图。
 */
export function CoverImage({
  src,
  sizes,
  alt = "",
  priority = false,
  className = "object-cover",
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div aria-hidden="true" className="absolute inset-0 bg-raised" />;
  }

  const optimizable = isOptimizableSrc(src);
  if (!optimizable) warnUnconfiguredHost(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!optimizable}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
