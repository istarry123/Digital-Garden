import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { blogConfig } from "@/config/blog.config";
import "./globals.css";

const { site, social } = blogConfig;

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: social.twitter,
  },
  alternates: {
    types: {
      "application/rss+xml": `${site.url}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={site.language} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-neutral-900 antialiased transition-colors dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
