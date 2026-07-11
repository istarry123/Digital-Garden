import type { MetadataRoute } from "next";
import { blogConfig } from "@/config/blog.config";

const { site } = blogConfig;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
