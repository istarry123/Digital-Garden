import { blogConfig } from "@/config/blog.config";

const { remoteDomains } = blogConfig.assets;

/**
 * 该图片地址能否交给 next/image 优化。
 *
 * next/image 对远程图片会校验域名白名单（next.config.ts → images.remotePatterns），
 * 未登记就**直接抛错让整页崩掉** —— 内容里新增一个图床不该有这种后果。
 * 所以这里先判断：未登记的域名退化为原生 <img>（不优化但能显示）。
 *
 * ⚠️ images.remotePatterns 必须与 blogConfig.assets.remoteDomains 保持同步。
 *
 * @see src/config/blog.config.ts → assets.remoteDomains
 * @see next.config.ts → images.remotePatterns
 */
export function isOptimizableSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;

  try {
    return remoteDomains.some((domain) => domain === new URL(src).hostname);
  } catch {
    return false;
  }
}

const warned = new Set<string>();

/** 开发环境提示一次：这个域名该登记了（否则图片不经过优化） */
export function warnUnconfiguredHost(src: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (warned.has(src)) return;

  warned.add(src);
  try {
    const host = new URL(src).hostname;
    console.warn(
      `[image] 远程域名 ${host} 未登记，已退化为原生 <img>（不优化）。` +
        `如需优化：把它同时加入 blogConfig.assets.remoteDomains 与 next.config.ts 的 images.remotePatterns。`,
    );
  } catch {
    /* 非法 URL，交给渲染层处理 */
  }
}
