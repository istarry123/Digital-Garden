import type { NextConfig } from "next";

/**
 * ⚠️ images.remotePatterns 必须与 blogConfig.assets.remoteDomains 保持同步。
 * 新增图床域名时两边都要加。
 * @see src/config/blog.config.ts
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "img.istarry.top",
      },
    ],
  },
};

export default nextConfig;
