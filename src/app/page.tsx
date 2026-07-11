import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
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
    </main>
  );
}
