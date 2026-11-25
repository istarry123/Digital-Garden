"use client";

import Script from "next/script";
import { blogConfig } from "@/config/blog.config";

const { analytics } = blogConfig;

/**
 * 第三方统计加载器（GA4 + 百度 + Vercel）。
 *
 * 2026-11 优化：在不关闭/不减少任何统计 Provider、不修改 ID 的前提下，
 * 把三套统计移出「首屏关键资源」与「hydration 前置路径」。
 *
 * 加载时序（改后）：
 * - GA4 初始化命令：hydration 后立即执行（内联脚本没有 src → Next 不会输出 preload），
 *   先把 dataLayer / gtag() / gtag('config') 排进队列。
 * - GA4 gtag.js 本体：`strategy="lazyOnload"`，在 window load + requestIdleCallback
 *   之后才下载。Next 的 lazyOnload 分支不会调用 ReactDOM.preload()，
 *   所以 HTML 里不再出现 `<link rel="preload" href="…gtag/js…">`。
 *   首次 page_view 不会丢：config 已在队列里，gtag.js 到达后消费队列并发出首次 PV。
 * - 百度统计：初始化 + 注入 hm.js 从 beforeInteractive 改为 afterInteractive。
 *   内联脚本没有 src，不参与 SSR preload；执行时机从「hydration 之前」后移到
 *   「hydration 之后」，不再挡住 hydrate。
 * - Vercel Analytics：保持原样（@vercel/analytics 自己管理脚本与路由事件）。
 *
 * 为什么百度不直接改成 `<Script src="…hm.js"> strategy="afterInteractive"`：
 * Next 15.5 在 App Router 下会对带 src 的 afterInteractive Script 调用
 * `ReactDOM.preload(src)`（node_modules/next/dist/client/script.js 的 appDir 分支），
 * 那会把 11 KiB 的 hm.js 又放回 HTML 解析期的下载队列。内联 afterInteractive
 * 既没有 src、不会 preload，又能保留百度官方 snippet 的 `_hmt` 队列语义。
 */
export function Analytics() {
  if (!analytics.enabled) return null;

  const { providers } = analytics;

  return (
    <>
      {/* Umami（默认关闭，保持原样） */}
      {providers.umami.enabled && providers.umami.id && (
        <Script
          async
          defer
          src={providers.umami.scriptUrl}
          data-website-id={providers.umami.id}
          strategy="afterInteractive"
        />
      )}

      {/* Google Analytics 4
          - 初始化命令先行排队：内联、无 src、afterInteractive → hydration 后执行、不 preload
          - gtag.js 本体：lazyOnload → window load + idle 后下载，不再占首屏带宽
          注意：内联 config 先定义 window.gtag 并写入 dataLayer；无论 gtag.js 先到还是后到，
          gtag('config') 都会在 gtag.js 消费队列时生效，因此首次 page_view 只发一次。 */}
      {providers.google.enabled && providers.google.measurementId && (
        <>
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${providers.google.measurementId}');
              `,
            }}
          />
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${providers.google.measurementId}`}
            strategy="lazyOnload"
          />
        </>
      )}

      {/* 百度统计
          beforeInteractive → afterInteractive：不再进入 __next_s 的 hydration 前置队列。
          保留百度官方 snippet 语义：先建 _hmt 队列，再异步插入 hm.js；
          内联、无 src → Next 不会生成 preload。 */}
      {providers.baidu.enabled && providers.baidu.id && (
        <Script
          id="baidu-tongji"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              window._hmt = _hmt;
              (function() {
                var hm = document.createElement("script");
                hm.async = true;
                hm.src = "https://hm.baidu.com/hm.js?${providers.baidu.id}";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
      )}

      {/* Microsoft Clarity（默认关闭，保持原样） */}
      {providers.clarity.enabled && providers.clarity.id && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${providers.clarity.id}");
            `,
          }}
        />
      )}
    </>
  );
}
