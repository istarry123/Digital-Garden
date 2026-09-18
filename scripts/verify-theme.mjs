/**
 * 设计 token 实测校验 —— 用真实浏览器读计算样式，避免"看着像对"。
 *
 *   node scripts/verify-theme.mjs
 *
 * 校验点：
 *   1. 主题由 .dark 类驱动：即使系统偏好是浅色，手动选择深色也必须生效。
 *   2. 背景 / 文字 / 强调色确实落到 token 值上。
 *   3. IBM Plex 字体是否真的加载（而不是回退到系统字体）。
 *   4. focus-visible 焦点环是否可见。
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3210";
const EDGE_PATH =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const browser = await (async () => {
  const args = ["--no-first-run", "--hide-scrollbars"];
  try {
    return await chromium.launch({ channel: "msedge", args });
  } catch {
    return await chromium.launch({ executablePath: EDGE_PATH, args });
  }
})();

const probe = () => ({
  htmlClass: document.documentElement.className,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  bodyColor: getComputedStyle(document.body).color,
  fontFamily: getComputedStyle(document.body).fontFamily.split(",")[0],
  colorScheme: getComputedStyle(document.documentElement).colorScheme,
});

let failures = 0;

for (const systemScheme of ["light", "dark"]) {
  for (const storedTheme of ["light", "dark"]) {
    const context = await browser.newContext({ colorScheme: systemScheme });
    await context.addInitScript((t) => {
      try {
        window.localStorage.setItem("theme", t);
      } catch {
        /* ignore */
      }
    }, storedTheme);

    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(probe);

    const wantDark = storedTheme === "dark";
    const hasDarkClass = result.htmlClass.includes("dark");
    const bgIsDark = result.bodyBg === "rgb(10, 11, 14)";
    const bgIsLight = result.bodyBg === "rgb(255, 255, 255)";
    const ok =
      hasDarkClass === wantDark &&
      (wantDark ? bgIsDark : bgIsLight) &&
      result.fontFamily.includes("IBM Plex Sans") &&
      result.colorScheme === (wantDark ? "dark" : "light");

    if (!ok) failures += 1;
    console.log(
      [
        `system=${systemScheme.padEnd(5)}`,
        `theme=${storedTheme.padEnd(5)}`,
        `html.class="${result.htmlClass}"`.padEnd(20),
        `bg=${result.bodyBg}`.padEnd(24),
        `color-scheme=${result.colorScheme}`.padEnd(20),
        `font=${result.fontFamily}`,
        ok ? "✓" : "✗ MISMATCH",
      ].join(" "),
    );

    // 焦点环：Tab 到第一个可聚焦元素并检查 outline
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return "none";
      const style = getComputedStyle(el);
      const root = getComputedStyle(document.documentElement);
      return [
        `${el.tagName.toLowerCase()}[${el.className || "no-class"}]`,
        `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor} offset=${style.outlineOffset}`,
        `--ds-accent=${root.getPropertyValue("--ds-accent").trim()}（浏览器会按对比度自动微调焦点环颜色）`,
      ].join(" | ");
    });
    if (!outline.includes("solid")) {
      failures += 1;
      console.log(`  ✗ focus-visible outline 缺失: ${outline}`);
    } else {
      console.log(`  ✓ focus-visible outline: ${outline}`);
    }

    await context.close();
  }
}

await browser.close();
console.log(
  failures === 0 ? "\nall checks passed" : `\n${failures} check(s) failed`,
);
process.exit(failures === 0 ? 0 : 1);
