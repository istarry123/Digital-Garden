"use client";

import Image from "next/image";
import { useState } from "react";

/** 作者头像 —— 远程头像失效时退化为姓名首字母，避免出现破图 */
export function AuthorAvatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-raised font-mono text-xs text-muted"
      >
        {initial}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={32}
      height={32}
      // 32px 头像不值得走图片优化管线：省掉一次服务端远程抓取，
      // 远程图床异常时也不会在 next/image 上产生 500。
      unoptimized
      className="h-8 w-8 shrink-0 rounded-full border border-hairline object-cover"
      onError={() => setFailed(true)}
    />
  );
}
