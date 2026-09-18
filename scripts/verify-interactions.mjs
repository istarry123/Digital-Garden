/**
 * 交互回归 —— P1 新增的交互都要能被自动验证，而不是只靠"看起来对"。
 *
 *   node scripts/verify-interactions.mjs
 *
 * 覆盖：
 *   1. 导航 active 态（aria-current）与指示条
 *   2. 移动端抽屉：打开 / 可见 / Escape 关闭
 *   3. 文章目录 scroll-spy：滚动后 aria-current="location" 跟随
 *   4. 复制链接：点击后状态文案变为"已复制"
 *   5. 阅读进度条：滚到底部宽度接近 100%
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3210";
const EDGE_PATH =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const POST_URL = `${BASE_URL}/posts/building-digital-garden`;
const SHOT_DIR = process.env.SHOT_DIR ?? ".design/p1";

const browser = await (async () => {
  const args = ["--no-first-run", "--hide-scrollbars"];
  try {
    return await chromium.launch({ channel: "msedge", args });
  } catch {
    return await chromium.launch({ executablePath: EDGE_PATH, args });
  }
})();

let failures = 0;

function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function newPage(viewport) {
  const context = await browser.newContext({ viewport, colorScheme: "dark" });
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("theme", "dark");
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();
  return { context, page };
}

/* 1 + 2. 导航 active 态 / 移动端抽屉 ------------------------------------ */
{
  const { context, page } = await newPage({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/posts`, { waitUntil: "networkidle" });

  const button = page.getByRole("button", { name: "Open navigation" });
  check("移动端：汉堡按钮存在", (await button.count()) === 1);

  await button.click();
  const panel = page.locator("#mobile-nav-panel");
  await panel.waitFor({ state: "visible", timeout: 5000 });
  check("移动端：抽屉打开且可见", await panel.isVisible());

  const currentInPanel = await panel
    .locator('[aria-current="page"]')
    .first()
    .textContent();
  check(
    "移动端：抽屉内标出当前页",
    (currentInPanel ?? "").includes("Articles"),
    `aria-current=${currentInPanel?.trim()}`,
  );

  await page.screenshot({
    path: `${SHOT_DIR}/mobile-dark-nav-open.png`,
    fullPage: false,
  });

  await page.keyboard.press("Escape");
  await panel.waitFor({ state: "hidden", timeout: 5000 });
  check("移动端：Escape 关闭抽屉", !(await panel.isVisible()));

  await context.close();
}

/* 3 + 4 + 5. 文章页：目录跟随 / 复制链接 / 阅读进度 -------------------- */
{
  const { context, page } = await newPage({ width: 1440, height: 900 });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(POST_URL, { waitUntil: "networkidle" });

  const toc = page.locator('nav[aria-label="文章目录"]');
  check("文章页：目录渲染", (await toc.count()) === 1);

  const firstActive = await toc
    .locator('[aria-current="location"]')
    .first()
    .textContent();
  check("文章页：目录初始高亮", Boolean(firstActive), firstActive?.trim());

  // 滚到文中某节，检查高亮是否跟随
  await page.evaluate(() => {
    const heading = document.querySelectorAll("article h2")[3];
    heading?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(600);

  const laterActive = await toc
    .locator('[aria-current="location"]')
    .first()
    .textContent();
  check(
    "文章页：目录高亮跟随滚动",
    Boolean(laterActive) && laterActive !== firstActive,
    `${firstActive?.trim()} → ${laterActive?.trim()}`,
  );

  // 复制链接
  const copyButton = page.getByRole("button", { name: /复制链接|已复制/ });
  await copyButton.click();
  await page.waitForTimeout(200);
  check(
    "文章页：复制链接反馈",
    (await copyButton.textContent())?.includes("已复制") ?? false,
  );

  // 阅读进度
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await page.waitForTimeout(400);
  const progressWidth = await page.evaluate(() => {
    const bar = document.querySelector(
      'div[aria-hidden="true"] > div.h-px.bg-accent',
    );
    return bar ? bar.style.width : "";
  });
  check(
    "文章页：阅读进度接近 100%",
    parseFloat(progressWidth) > 95,
    `width=${progressWidth}`,
  );

  await context.close();
}

/* 6. 顶栏：图标导航 / 当前页 / 品牌字标 -------------------------------- */
{
  const { context, page } = await newPage({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/timeline`, { waitUntil: "networkidle" });

  // 当前页只能靠强调色药丸底 + aria-current 表达（图标没有文字）
  const active = page.locator('header [aria-current="page"]').first();
  check(
    "顶栏：标出当前页（aria-label 判定）",
    (await active.getAttribute("aria-label")) === "Timeline",
    `aria-label=${await active.getAttribute("aria-label")}`,
  );

  // 图标形态：有可访问名称、但宽度必须很小（不是文字标签）
  const articles = page
    .locator("header")
    .getByRole("link", { name: "Articles" });
  check(
    "顶栏：图标链接有可访问名称",
    (await articles.count()) === 1,
    `${await articles.count()} 个（页脚同名链接不计入）`,
  );
  const box = await articles.first().boundingBox();
  check(
    "顶栏：导航是图标而非文字标签（宽度 ≤ 44px）",
    box !== null && box.width <= 44,
    `宽度 ${Math.round(box?.width ?? 0)}px`,
  );

  const iconLinks = await page.locator("header ul li a").count();
  check("顶栏：页面级入口全部为图标", iconLinks === 5, `${iconLinks} 个`);

  const brand =
    (await page.locator('header a[href="/"]').first().textContent()) ?? "";
  check(
    "顶栏：品牌字标已去掉 ~/garden",
    !brand.includes("garden"),
    brand.trim(),
  );

  // 时间线：年份作为结构锚点 + 条目存在
  const years = await page.locator("main section h2").allTextContents();
  check(
    "时间线：年份是结构锚点",
    years.length > 0 && /^\d{4}$/.test(years[0].trim()),
    years.join(", "),
  );
  check(
    "时间线：条目渲染为行式列表",
    (await page.locator("main ol > li").count()) > 0,
  );

  await context.close();
}

/* 7. 笔记流 / 404 / 页脚 / 首屏 ---------------------------------------- */
{
  const { context, page } = await newPage({ width: 1440, height: 900 });

  await page.goto(`${BASE_URL}/explore`, { waitUntil: "networkidle" });
  check(
    "笔记流：存在一条脊线结构",
    (await page.locator("main ol.border-l").count()) === 1,
  );
  check(
    "笔记流：条目不再是卡片（去掉了双重结构）",
    (await page.locator("main article.rounded-card").count()) === 0,
  );

  await page.goto(`${BASE_URL}/this-page-does-not-exist`, {
    waitUntil: "networkidle",
  });
  check(
    "404：给出下一步入口",
    (await page.locator("main a").count()) >= 3,
    `${await page.locator("main a").count()} 个链接`,
  );

  await page.goto(`${BASE_URL}/posts`, { waitUntil: "networkidle" });

  // 结构守护：整行可点 + 行内标签链接不得构成 <a> 嵌套 <a>
  const nestedAnchors = await page.evaluate(
    () => document.querySelectorAll("a a").length,
  );
  check(
    "结构：列表行不存在嵌套 <a>（否则水合失败）",
    nestedAnchors === 0,
    `${nestedAnchors} 处`,
  );
  const rowTagLinks = await page.locator('main a[href^="/tags/"]').count();
  check("结构：行内标签仍是独立链接", rowTagLinks > 0, `${rowTagLinks} 个`);

  const footerNav = await page.locator("footer nav a").count();
  const footerLinks = await page.locator("footer ul a").count();
  check(
    "页脚：导航栏与联系栏都有内容",
    footerNav >= 4 && footerLinks >= 3,
    `nav=${footerNav}, links=${footerLinks}`,
  );
  const footerText = (await page.locator("footer").textContent()) ?? "";
  check("页脚：显示内容最近更新时间", footerText.includes("最近更新"));

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  check(
    "首屏：存在唯一实心主按钮",
    (await page.getByRole("link", { name: "开始阅读" }).count()) === 1,
  );
  const statValues = await page.locator("main dl dd").allTextContents();
  check(
    "首屏：索引行是真实统计",
    statValues.length === 4 && statValues.every((v) => v.trim().length > 0),
    statValues.map((v) => v.trim()).join(" / "),
  );
  check(
    "首屏：入场动效容器存在",
    (await page.locator("main .hero-enter").count()) === 1,
  );

  await context.close();
}

/* 8. 长目录（p7，81 项）—— 目录必须能自己滚，高亮项要自动滚入可见区 ----- */
{
  const { context, page } = await newPage({ width: 1440, height: 700 });
  await page.goto(`${BASE_URL}/posts/p7`, { waitUntil: "networkidle" });

  const nav = page.locator('nav[aria-label="文章目录"]');
  check("长目录：目录渲染", (await nav.count()) === 1);

  const metrics = await nav.evaluate((element) => ({
    overflowY: getComputedStyle(element).overflowY,
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
  }));
  check(
    "长目录：自身可滚动，不再被视口截断",
    metrics.overflowY === "auto" && metrics.scrollHeight > metrics.clientHeight,
    `overflowY=${metrics.overflowY}, client=${metrics.clientHeight}px < scroll=${metrics.scrollHeight}px`,
  );

  // 跳到靠后的章节，检查高亮跟随 + 自动滚入可见区 + sticky 仍在工作
  await page.evaluate(() => {
    const headings = document.querySelectorAll("article h2");
    headings[headings.length - 2]?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(500);

  const state = await nav.evaluate((element) => {
    const active = element.querySelector('[aria-current="location"]');
    const navBox = element.getBoundingClientRect();
    const itemBox = active?.getBoundingClientRect();
    return {
      activeText: active?.textContent?.trim() ?? "",
      scrollTop: Math.round(element.scrollTop),
      inside:
        itemBox !== undefined &&
        itemBox.top >= navBox.top - 1 &&
        itemBox.bottom <= navBox.bottom + 1,
      stickyTop: Math.round(navBox.top),
    };
  });

  check(
    "长目录：高亮跟随到后段章节",
    state.activeText.length > 0,
    state.activeText,
  );
  check(
    "长目录：高亮项自动滚入可见区",
    state.inside,
    `scrollTop=${state.scrollTop}`,
  );
  check(
    "长目录：sticky 仍钉在导航栏下方",
    Math.abs(state.stickyTop - 96) <= 4,
    `top=${state.stickyTop}px`,
  );

  await page.screenshot({
    path: `${SHOT_DIR}/desktop-dark-long-toc.png`,
    fullPage: false,
  });

  await context.close();
}

/* 9. 标签归档 ----------------------------------------------------------- */
{
  const { context, page } = await newPage({ width: 1440, height: 900 });

  await page.goto(`${BASE_URL}/tags`, { waitUntil: "networkidle" });
  const chipCount = await page.locator("main ul li a").count();
  check("标签索引：列出全部标签", chipCount >= 25, `${chipCount} 个`);
  check(
    "标签索引：显示总数",
    ((await page.locator("main").textContent()) ?? "").includes("个标签"),
  );

  // 含空格的标签（URL 百分号编码）
  await page.goto(`${BASE_URL}/tags/cloud%20computing`, {
    waitUntil: "networkidle",
  });
  const spaceHeading = (await page.locator("main h1").textContent()) ?? "";
  check(
    "标签归档：含空格的标签正确解码",
    spaceHeading.includes("cloud computing"),
    spaceHeading.trim(),
  );
  check(
    "标签归档：列出该标签的文章",
    (await page.locator("main ul > li").count()) >= 1,
  );

  // 中文标签
  await page.goto(`${BASE_URL}/tags/%E7%BD%91%E7%BB%9C`, {
    waitUntil: "networkidle",
  });
  check(
    "标签归档：中文标签可达",
    ((await page.locator("main h1").textContent()) ?? "").includes("网络"),
  );

  // 跨内容类型：Docker 同时命中文章与里程碑
  await page.goto(`${BASE_URL}/tags/Docker`, { waitUntil: "networkidle" });
  const sections = await page.locator("main section h2").allTextContents();
  check(
    "标签归档：跨类型分区（文章 + 里程碑）",
    sections.includes("文章") && sections.includes("里程碑"),
    sections.join(" / "),
  );

  // 真实点击：文章页标签 → 归档页
  await page.goto(`${BASE_URL}/posts/linux-security-guide`, {
    waitUntil: "networkidle",
  });
  const firstTag = page.locator('article a[href^="/tags/"]').first();
  const tagText = (await firstTag.textContent())?.trim() ?? "";
  await firstTag.click();
  await page.waitForURL(/\/tags\//, { timeout: 10_000 });
  const landed = (await page.locator("main h1").textContent()) ?? "";
  check(
    "标签闭环：点标签进入归档页",
    landed.includes(tagText),
    `${tagText} → ${landed.trim()}`,
  );

  // sitemap 收录
  const response = await page.request.get(`${BASE_URL}/sitemap.xml`);
  const xml = await response.text();
  const tagUrls = (xml.match(/\/tags\//g) ?? []).length;
  check("sitemap：收录标签归档", tagUrls >= 25, `${tagUrls} 条 /tags/ URL`);

  await context.close();
}

await browser.close();
console.log(
  failures === 0 ? "\nall checks passed" : `\n${failures} check(s) failed`,
);
process.exit(failures === 0 ? 0 : 1);
