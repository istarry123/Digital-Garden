"use client";

import Image from "next/image";
import { useState } from "react";

interface CoverImageProps {
  src: string;
  sizes: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

/**
 * 封面图 —— 远程图床失效时降级为中性占位块，而不是显示破图。
 *
 * 本站部分封面指向的 CDN 路径已经失效（服务端无法预知远程资源是否可用），
 * 所以把失败处理放在客户端：加载失败就把图片换成同尺寸的 raised 色块，
 * 版面不会被破图打断。
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

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
