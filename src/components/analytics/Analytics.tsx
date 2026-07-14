"use client";

import Script from "next/script";
import { blogConfig } from "@/config/blog.config";

const { analytics } = blogConfig;

export function Analytics() {
  if (!analytics.enabled) return null;

  const { providers } = analytics;

  return (
    <>
      {/* Umami */}
      {providers.umami.enabled && providers.umami.id && (
        <Script
          async
          defer
          src={providers.umami.scriptUrl}
          data-website-id={providers.umami.id}
          strategy="afterInteractive"
        />
      )}

      {/* Google Analytics 4 */}
      {providers.google.enabled && providers.google.measurementId && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${providers.google.measurementId}`}
            strategy="afterInteractive"
          />
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
        </>
      )}

      {/* 51la */}
      {providers.la51.enabled && providers.la51.id && (
        <>
          <Script
            id="la51-sdk"
            strategy="afterInteractive"
            src="//sdk.51.la/js-sdk-pro.min.js"
          />
          <Script
            id="la51-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `LA.init({id:"${providers.la51.id}",ck:"${providers.la51.ck}"})`,
            }}
          />
        </>
      )}

      {/* 百度统计 */}
      {providers.baidu.enabled && providers.baidu.id && (
        <Script
          id="baidu-tongji"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?${providers.baidu.id}";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
      )}

      {/* Microsoft Clarity */}
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
