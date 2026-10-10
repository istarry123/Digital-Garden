# Contributing to Digital-Garden

感谢你愿意为这个仓库贡献改动。本文档说明如何搭建本地环境、哪些命令是真实可用的、以及提交前必须完成的验证。

> 维护者：istarry123 · 仓库：https://github.com/istarry123/Digital-Garden

---

## 一、项目简介

Digital-Garden 是一个个人技术站点与知识库：以 Markdown 为内容源，通过 Next.js 静态预渲染输出文章、笔记、标签、时间轴与知识图谱页面，并部署在 Vercel 上。

| 项 | 本项目实际使用 |
|---|---|
| 框架 | Next.js 15（**App Router**，根布局 `src/app/layout.tsx`） |
| UI | React 19 + TypeScript 5 |
| 样式 | Tailwind CSS 4（`src/app/globals.css` 中定义设计 token） |
| 内容 | `content/{posts,explore,timeline}/*.md`，frontmatter 由 `gray-matter` 解析，正文经 `unified` / `remark` / `rehype` 渲染 |
| 部署 | Vercel |
| 包管理器 | **npm**（以仓库内 `package-lock.json` 为准，请勿改用 pnpm/yarn 生成第二份锁文件） |
| 运行时要求 | Next.js 15 声明 `engines.node = ^18.18.0 \|\| ^19.8.0 \|\| >= 20.0.0` |

---

## 二、贡献范围

**欢迎的贡献**

- 修复 Bug（页面报错、样式错位、构建失败等）
- 修正文档、错别字、失效链接
- 无障碍与响应式改进
- 性能改进 —— **必须附可复现的测量方法与前后数据**（见第五节）

**请先开 Issue 讨论再动手**

- 新增功能或新增依赖
- 目录结构调整、大规模重构
- 变更 URL 结构、文章 frontmatter 字段语义
- 任何会影响已发布文章链接的改动

**通常不会被接受**

- 与本站定位无关的功能堆叠
- 无测量依据的"性能优化"
- 纯格式化/纯重命名产生的大面积 diff（除非事先沟通）

---

## 三、本地开发环境

```bash
# 1) 克隆
git clone https://github.com/istarry123/Digital-Garden.git
cd Digital-Garden

# 2) 安装依赖（严格遵守锁文件）
npm ci          # 推荐：完全按 package-lock.json 安装
# 或
npm install

# 3) 配置环境变量（可选，缺失时使用代码内默认值）
cp .env.example .env.local     # Windows: copy .env.example .env.local

# 4) 启动开发服务器
npm run dev     # 默认 http://localhost:3000
```

`.env.local` **不得提交**（已由 `.gitignore` 忽略）。`.env.example` 是模板，必须保持可提交状态。

---

## 四、可用的检查命令

命令以仓库根目录 `package.json` 的 `scripts` 为唯一依据：

| 命令 | 用途 |
|---|---|
| `npm run dev` | 启动开发服务器（Next.js dev） |
| `npm run build` | 生产构建（**提交前必须跑通**） |
| `npm start` | 以生产模式启动已构建的产物 |
| `npm run lint` | ESLint 检查（`next lint`） |

### ⚠️ 本仓库没有的脚本

以下命令**不存在**，请不要在 PR 中声称"已运行"：

- **没有 `npm test`** —— 本仓库没有单元测试框架。
- **没有 `npm run typecheck`** —— TypeScript 检查需要显式调用编译器：

```bash
npx tsc --noEmit
```

> 注意：`tsc --noEmit` 与 `next build` **不要并发执行**。`next build` 会重建 `.next/types/`，并发时 `tsc` 可能报 `TS6053: File not found` 这类假阳性错误。请串行运行。
>
> 另：`npm run lint` 使用的 `next lint` 已被 Next.js 标记为弃用（将在 Next.js 16 移除），目前仍可正常使用。

### 附加的浏览器自检脚本

`scripts/` 下有三个基于 Playwright 的本地校验脚本（**需要先自行启动一个服务器**）：

```bash
node scripts/screenshot.mjs .design/before      # 多路由 / 深浅主题 / 桌面+移动端全页截图
node scripts/verify-theme.mjs                   # 用真实浏览器读取计算样式，校验设计 token 与字体
node scripts/verify-interactions.mjs            # 交互回归：导航高亮、移动端抽屉、TOC scroll-spy、复制链接、阅读进度
```

- 三者默认连接 `http://localhost:3210`，可用环境变量覆盖：`BASE_URL=http://localhost:3000 node scripts/verify-theme.mjs`
- 截图输出目录建议放在项目**外部**或已忽略的 `.design/`；若写入项目内，dev server 的文件监听会因反复写入 PNG 而重编译，可能产生随机 500。

---

## 五、提交前必须完成的验证

在发起 PR 前，请**实际执行**并在 PR 中附上真实结果：

```bash
npx tsc --noEmit     # 1. 类型检查
npm run lint         # 2. 静态检查
npm run build        # 3. 生产构建
```

要求：

- 三项必须全部通过。若某项失败，请修复，或在 PR 中**如实说明失败原因与影响**，不要隐瞒。
- 如果改动影响界面，请附上改动前后的截图或说明如何验证。
- 如果改动影响性能，请附测量方法与本机前后数据，并说明机器/网络条件。
- **不确定的结论要写成"未验证"**，不要用推测冒充实测结果。

---

## 六、修改内容（文章 / 笔记 / 时间轴）

内容文件位于 `content/`：

- `content/posts/*.md` —— 文章
- `content/explore/*.md` —— 笔记
- `content/timeline/*.md` —— 时间轴

### frontmatter 字段

```yaml
---
title: "文章标题"                    # 必需
date: "2026-07-01"                   # 必需，YYYY-MM-DD
description: "摘要，用于列表卡片 / SEO / RSS"   # 必需
tags:                                # 可选
  - Linux
  - Security
category: "Engineering/Security"     # 可选，斜线分隔表示分类层级
cover: "https://img.istarry.top/..." # 可选，封面图
relations:                           # 可选，知识图谱关系
  parent: "p2"
  related: ["p3"]
  children: ["p4"]
---
```

### 硬性规则

- **文件名即 URL slug。** 必须使用 ASCII：推荐 `kebab-case` 或简短编号（如 `p1.md`）。
  **禁止中文文件名或含空格的文件名**，否则 slug 异常并导致 404。
- 中文标题写在 frontmatter 的 `title` 里，不要写进文件名。
- `relations` 中引用的 slug **必须真实存在**，否则知识图谱与关联文章会指向空页面。
- **不要修改已发布文章的 `date` 与文件路径**，这会改变链接、RSS 与时间轴排序。
- 图片若使用远程图床，域名必须同时存在于 `next.config.ts → images.remotePatterns` 与 `blogConfig.assets.remoteDomains`（两处需保持一致）。

---

## 七、修改组件与样式

- 站点配置（域名、导航、字体、统计开关等）集中在 **`src/config/blog.config.ts`**，这是唯一配置入口。组件只读取配置，**不要**在组件里再次硬编码 ID、开关或站点信息。
- 样式改动请使用 `src/app/globals.css` 中已有的设计 token，而不是散落的魔法值。
- 深色是本站的第一公民主题，改动须同时验证 `light` / `dark` 两种模式。
- 保持 `src/app/layout.tsx` 为 Server Component，除非有明确且必要的理由。
- 不要为了通过检查而降低 lint / 类型严格度，也不要新增 `any` 或类型断言绕过检查。

---

## 八、修改性能相关代码

本仓库有一批性能审计文档（`PERFORMANCE-*.md`）。这些是**本地工作产物，未纳入版本控制**（`.gitignore` 中已忽略），因此 PR 中不应包含它们。

涉及性能的改动必须满足：

1. **先测量，再改动**：给出可复现的测量命令与基线数据。
2. **给出前后对比**：说明测量环境（机器、网络、是否冷启动）。
3. **不得以"看起来更快"作为结论。**
4. 不要在性能 PR 中夹带无关重构。
5. 不要撤销既有的性能优化，除非能证明该优化有害并附数据。

---

## 九、分支、提交信息与 Pull Request

### 分支命名

```
feat/<简短描述>
fix/<简短描述>
docs/<简短描述>
perf/<简短描述>
chore/<简短描述>
```

### 提交信息

使用 Conventional Commits 风格，首行不超过约 72 字符，说明**做了什么、为什么**：

```
fix(toc): 修正深色模式下锚点高亮不可见的问题
feat(analytics): 用 @vercel/analytics 替换失效的 51la
docs: 补充 frontmatter 中 relations 的填写规则
```

避免 `update`、`fix bug`、`修改` 这类无信息量的提交信息。

### Pull Request

发起 PR 时请：

1. 使用仓库提供的 PR 模板（`.github/pull_request_template.md`）逐项填写。
2. 说明**改了什么 / 为什么改 / 如何验证**。
3. 附上第四节三项检查的**真实输出结果**。
4. 关联相关 Issue（如 `Closes #12`）。
5. 保持单个 PR 聚焦一件事；大改动请拆分。

维护者可能要求补充说明或数据；在数据齐备前 PR 会保持未合并状态。

---

## 十、禁止提交的内容

以下内容**一律不得**进入仓库：

- **密钥与令牌**：API Key、访问令牌、私钥（`*.pem`）、Vercel/图床等平台凭据
- **环境变量文件**：`.env`、`.env.local`、`.env.*`（`.env.example` 除外，且其中只能放占位符）
- **构建产物与依赖**：`.next/`、`out/`、`build/`、`node_modules/`
- **无关二进制文件**：安装包、压缩包、视频、字体文件、设计源文件
- **他人隐私数据**：真实姓名、邮箱、手机号、服务器地址、未经授权的日志

如果你**不小心提交了密钥**：立即在对应平台轮换（吊销）该凭据，然后清理仓库 —— 仅删除文件是不够的，因为密钥已存在于 Git 历史中。

---

## 十一、AI Agent 参与开发的规范

本仓库接受借助 AI Agent 完成的贡献，但必须遵守以下约束：

1. **先审计，再改动。** 动手前先读实际代码与配置，不假设目录结构、依赖版本或脚本名称。禁止凭空编造命令或结果。
2. **保护用户已有改动。** 不得 `git reset --hard`、`git checkout .`、`git clean -fd` 等破坏性操作；不得覆盖工作区中与本任务无关的未提交修改。
3. **严格限制任务范围。** 只改任务明确要求的文件；发现的其他问题**记录并报告**，不要顺手修改。
4. **只报告真实执行过的验证。** 必须区分「通过 / 失败 / 未执行 / 不适用」。未运行过的检查不得声称通过。
5. **不得伪造数据。** 不编造测量结果、后台截图、联系邮箱、响应时限或项目政策。
6. **不得自动提交、推送或部署**，除非维护者明确授权。
7. **配置与密钥**：不得把任何密钥写入源码，不得擅自修改生产环境设置。

---

## 十二、许可证

提交贡献即表示你同意：

- **代码部分**按 [MIT License](LICENSE) 授权
- **内容部分**（文章、笔记、图片、文档等）按 [CC BY-NC-SA 4.0](CONTENT_LICENSE.md) 授权

详见 `LICENSE` 与 `CONTENT_LICENSE.md`。
