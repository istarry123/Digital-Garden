import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LatestArticles } from "@/components/home/latest-articles";
import { LatestExplore } from "@/components/home/latest-explore";
import { blogConfig } from "@/config/blog.config";

const { site } = blogConfig;

export const metadata: Metadata = {
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LatestArticles />
      <LatestExplore />
    </main>
  );
}
