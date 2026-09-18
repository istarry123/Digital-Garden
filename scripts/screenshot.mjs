/**
 * 视觉自检脚本 —— 多路由 / 深浅主题 / 桌面与移动端全页截图。
 *
 * 用途：UI 改造前后做同条件对比，避免"凭感觉验收"。
 *
 *   node scripts/screenshot.mjs .design/before
 *   BASE_URL=http://localhost:3210 node scripts/screenshot.mjs .design/after
 *
 * ⚠️ 输出目录若位于项目内，dev server 的文件监听会因写入 PNG 而反复重编译，
 *    请求偶发落到重编译中间态（表现为随机的 500）。建议先输出到项目外，
 *    或改用生产构建（npm run build && npm start）后再截图。
 *    可用 ONLY_ROUTES=graph ONLY_THEMES=dark ONLY_VP=desktop 只截指定部分。
 *
 * 说明：
 *   - 优先使用 Playwright 自带的 msedge 通道，未安装下载版 Chromium 也能跑。
 *   - 通过 colorScheme + localStorage('theme') 双重注入，强制指定主题，
 *     不依赖操作系统的 prefers-color-scheme。
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3210";
const OUT_DIR = process.argv[2] ?? ".design/shots";
const EDGE_PATH =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// 可选过滤：ONLY_ROUTES=explore,post ONLY_THEMES=light ONLY_VP=desktop
const pick = (envValue, all) =>
  envValue ? all.filter((item) => envValue.split(",").includes(item)) : all;

const ROUTES = [
  ["home", "/"],
  ["posts", "/posts"],
  ["explore", "/explore"],
  ["timeline", "/timeline"],
  ["graph", "/graph"],
  ["post", "/posts/building-digital-garden"],
  ["tags", "/tags"],
  ["tag-space", "/tags/cloud%20computing"],
  ["tag-cjk", "/tags/%E7%BD%91%E7%BB%9C"],
  ["not-found", "/this-page-does-not-exist"],
];

const THEMES = ["dark", "light"];

const VIEWPORTS = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
};

// 移动端只截关键路由，避免产出一堆低价值图片
const MOBILE_ROUTES = new Set(["home", "posts", "post", "tags"]);

async function launchBrowser() {
  const args = ["--no-first-run", "--hide-scrollbars", "--disable-lcd-text"];
  try {
    return await chromium.launch({ channel: "msedge", args });
  } catch {
    return await chromium.launch({ executablePath: EDGE_PATH, args });
  }
}

const browser = await launchBrowser();
let count = 0;
let problems = 0;

const onlyThemes = process.env.ONLY_THEMES?.split(",");
const onlyRoutes = process.env.ONLY_ROUTES?.split(",");
const onlyVps = process.env.ONLY_VP?.split(",");

for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
  if (onlyVps && !onlyVps.includes(vpName)) continue;
  for (const theme of THEMES) {
    if (onlyThemes && !onlyThemes.includes(theme)) continue;
    const context = await browser.newContext({
      viewport,
      colorScheme: theme,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });

    // next-themes 从 localStorage 读取主题，注入后首帧即为目标主题
    await context.addInitScript((t) => {
      try {
        window.localStorage.setItem("theme", t);
      } catch {
        /* ignore */
      }
    }, theme);

    for (const [name, route] of ROUTES) {
      if (vpName === "mobile" && !MOBILE_ROUTES.has(name)) continue;
      if (onlyRoutes && !onlyRoutes.includes(name)) continue;

      const page = await context.newPage();
      const errors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
      });
      page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

      await page.goto(`${BASE_URL}${route}`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });

      // 等字体加载完成，否则截图会用回退字体
      await page.evaluate(() => document.fonts.ready);
      // 冻结动画，保证前后对比的像素差异只来自设计本身
      await page.addStyleTag({
        content:
          "*,*::before,*::after{animation:none!important;transition:none!important}",
      });
      await page.waitForTimeout(250);

      const file = path.join(OUT_DIR, `${vpName}-${theme}-${name}.png`);
      await mkdir(path.dirname(file), { recursive: true });
      await page.screenshot({ path: file, fullPage: true });

      const { width, height } = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      }));
      console.log(`${file}  (${width}x${height})`);
      if (errors.length > 0) {
        problems += 1;
        console.log(`  ⚠ ${errors.length} client error(s):`);
        for (const line of errors.slice(0, 5)) console.log(`    - ${line}`);
      }
      count += 1;
      await page.close();
    }

    await context.close();
  }
}

await browser.close();
console.log(`\n${count} screenshots written to ${OUT_DIR}`);
if (problems > 0)
  console.log(`⚠ ${problems} page(s) reported client-side errors`);
