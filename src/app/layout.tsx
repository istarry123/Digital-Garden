import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@/components/analytics/Analytics";
import { blogConfig } from "@/config/blog.config";
import "./globals.css";

/**
 * 字体：一个超家族承担两种角色。
 * IBM Plex 源自技术文档/工程语境，与本站（Linux、网络、信息安全、运维）同源；
 * 自带同族等宽，用于日期、阅读时长、标签、代码等"元信息"。
 * CJK 不做自托管（体积不可接受），在 globals.css 中回退系统黑体。
 * @see src/app/globals.css → @theme inline → --font-sans / --font-mono
 */
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

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
      <body
        className={`${plexSans.variable} ${plexMono.variable} flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased transition-colors`}
      >
        <ThemeProvider>
          <Navbar />
          {/* 撑满剩余高度，使 Footer 始终贴在页面最底部 */}
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
