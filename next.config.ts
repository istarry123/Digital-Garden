import type { NextConfig } from "next";

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
      // Image CDN (when NEXT_PUBLIC_IMAGE_CDN is set)
      // Uncomment and replace with your CDN domain:
      // {
      //   protocol: "https",
      //   hostname: "cdn.example.com",
      // },
    ],
  },
};

export default nextConfig;
