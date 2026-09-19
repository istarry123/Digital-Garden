/**
 * Central blog configuration — single source of truth.
 *
 * 所有组件和页面必须从此文件读取配置。
 * 项目中禁止硬编码任何站点身份信息。
 *
 * 部署时只需修改此文件：
 *   - 换域名       → site.url
 *   - 换 Logo      → branding.favicon / branding.logo
 *   - 修改个人简介 → hero.* / author.*
 *   - 开关功能     → homepage.* / rss.enabled / comments.*
 *   - 增删社交链接 → socialLinks[]
 *   - 修改导航文案 → navigation.*
 *   - 改备案号     → footer.icp.number
 */

export const blogConfig = {
  // ===================================================================
  // 站点身份 — 域名、名称、描述、语言
  // ===================================================================
  site: {
    /** 浏览器标签页默认标题，也用于 RSS / OG */
    name: "IStarry",
    /** 首页 title */
    title: "IStarry's Digital Garden",
    /** 全局 meta description，搜索引擎和社交分享使用 */
    description:
      "A personal digital garden — notes, essays, and explorations about web development, tools, and systems.",
    /** 生产环境域名（含 https://），部署时通过环境变量覆盖 */
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://istarry.top",
    /** <html lang> 属性，影响浏览器翻译和屏幕阅读器 */
    language: "zh-CN",
    /** 日期格式化 locale，用于 toLocaleDateString */
    locale: "en-US",
  },

  // ===================================================================
  // 作者信息 — 名称、简介、头像
  // ===================================================================
  author: {
    name: "IStarry",
    /** 短简介，用于 SEO 结构化数据 */
    bio: "A developer who writes about web, tools, and systems. Building things and sharing what I learn along the way.",
    /** 头像路径，放在 public/assets/images/ 下 */
    avatar: "https://img.istarry.top/images/head.jpg",
  },

  // ===================================================================
  // 品牌 — Favicon、Logo、资源路径
  // ===================================================================
  branding: {
    /** 浏览器标签页图标，放在 public/ 下 */
    favicon: "/assets/images/favicon.ico",
    /** 站点 Logo，放在 public/assets/images/ 下 */
    logo: "https://img.istarry.top/images/favicon.ico",
    /** 默认 OG 分享图（当文章没有 cover 时使用） */
    ogImage: "/assets/images/og-default.png",
  },

  // ===================================================================
  // 图片资源 — 双轨兼容：本地路径 + 网络图床
  // ===================================================================
  assets: {
    /** 本地图片存放目录（相对于 public/），Markdown 中通过 /assets/images/... 引用 */
    localPath: "/assets/images",
    /**
     * 网络图床 CDN 前缀（可选）。
     * 设置后，Markdown 中的图片优先使用 CDN URL。
     * 引用方式：/assets/images/photo.png → https://img.istarry.top/assets/images/photo.png
     */
    cdnUrl: process.env.NEXT_PUBLIC_IMAGE_CDN ?? "https://img.istarry.top",
    /**
     * 远程图片域名白名单。
     * 用于文章 cover 封面图（next/image 远程优化）和 Markdown 正文图片。
     * ⚠️ 新增图床域名时，需同步更新 next.config.ts → images.remotePatterns。
     */
    remoteDomains: [
      "picsum.photos",
      "img.istarry.top",
      "bee-reg-ab.imagency.cn",
    ],
  },

  // ===================================================================
  // 首页 Hero 区域 — 问候语、个人介绍
  // ===================================================================
  // 首页 Hero 区域
  // -------------------------------------------------------------------
  // 渲染方式（P1 起）：
  //   tagline     → 顶部等宽提示行（终端语境标记，不再是大写小标签）
  //   greeting    → 主标题第一行（大字号）
  //   highlight   → 主标题第二行（中字号、次要色，按纯文本渲染，不再注入 HTML）
  //   description → 描述段落
  //   索引行       → 文章 / 笔记 / 里程碑 / 最近更新，数字由真实内容自动统计
  // ===================================================================
  hero: {
    /** 顶部提示行（等宽字体渲染） */
    tagline: "~/garden",
    /** 主标题第一行：站点主人 */
    greeting: "IStarry",
    /** 主标题第二行：一句话定位 */
    highlight: "Systems, Security & Engineering Practice",
    /** 个人描述段落 */
    description:
      "记录我的技术探索与工程实践，涵盖 Linux、网络架构、信息安全、服务器运维以及企业 IT 系统建设。这里不仅是博客，也是一个持续成长的知识库。",
    /** Hero 区按钮 */
    buttons: {
      /** 主按钮 —— 全站唯一的实心按钮，指向内容入口 */
      primary: {
        label: "开始阅读",
        href: "/posts",
      },
      github: {
        label: "GitHub",
        /** 链接读取 blogConfig.social.github */
      },
      rss: {
        label: "RSS Feed",
        href: "/rss.xml",
      },
    },
  },

  // ===================================================================
  // 首页板块开关 — 控制是否展示各内容区域
  // ===================================================================
  homepage: {
    /** 是否展示 "Latest Articles" 板块 */
    showLatestArticles: false,
    /** 是否展示 "Latest Explore" 板块 */
    showLatestExplore: false,
  },

  // ===================================================================
  // 社交链接 — Hero 内联按钮 + Navbar 下拉菜单
  // ===================================================================
  social: {
    /** GitHub 主页 URL（Hero 按钮使用） */
    github: "https://github.com/istarry123",
    /** Twitter handle（layout metadata 使用） */
    twitter: "@Istarry123",
  },

  /** Navbar 社交下拉菜单 — 增删改只需编辑此数组 */
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/istarry123",
      icon: "github" as const,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/Istarry123",
      icon: "twitter" as const,
    },
    {
      name: "Email",
      url: "mailto:hello@example.com",
      icon: "email" as const,
    },
  ],

  // ===================================================================
  // 各子页面元数据 — title、heading、description、空状态文案
  // ===================================================================
  pages: {
    posts: {
      title: "Articles",
      heading: "Articles",
      description:
        "All articles from Digital Garden — notes, essays, and explorations.",
      emptyText: "No articles yet. Check back soon.",
      /** 首页 Latest Articles 板块 */
      viewAll: "View all",
      latestHeading: "Latest Articles",
    },
    explore: {
      title: "Explore",
      heading: "Explore",
      description:
        "Short thoughts, quick notes, and things I discover — a micro-blog timeline.",
      emptyText: "Nothing here yet. Check back soon.",
      viewAll: "View all",
      latestHeading: "Latest Explore",
    },
    graph: {
      title: "Knowledge Graph",
      description:
        "Interactive map of articles — explore connections by topic and relationship.",
    },
    timeline: {
      title: "Timeline",
      description:
        "A chronological journey through milestones, projects, and learning.",
      emptyText: "No milestones yet.",
    },
    tags: {
      title: "Tags",
      heading: "Tags",
      description:
        "All tags across articles, notes, and milestones — pick one to see everything filed under it.",
      emptyText: "No tags yet.",
    },
  },

  // ===================================================================
  // 文章系统配置
  // ===================================================================
  posts: {
    /** 文章列表每页数量（预留分页功能） */
    postsPerPage: 9,
    /** 阅读速度（词/分钟），用于估算阅读时长 */
    readingSpeedWpm: 200,
    /** 相关文章推荐数量 */
    relatedPostsLimit: 3,
    /** 日期格式化 locale */
    dateLocale: "en-US",
  },

  // ===================================================================
  // 代码高亮 — Shiki 双主题
  // ===================================================================
  codeHighlighting: {
    theme: {
      light: "github-light" as const,
      dark: "github-dark" as const,
    },
    /** 未标注语言的代码块默认语言 */
    defaultLanguage: "plaintext",
    /** 是否使用 CSS Grid 行号对齐 */
    grid: true,
  },

  // ===================================================================
  // RSS Feed
  // ===================================================================
  rss: {
    enabled: true,
  },

  // ===================================================================
  // 评论系统 — Giscus (GitHub Discussions)
  // ===================================================================
  comments: {
    provider: "giscus" as const,
    giscus: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "",
      repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "General",
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
    },
  },

  // ===================================================================
  // 搜索（预留）
  // ===================================================================
  search: {
    enabled: false,
  },

  // ===================================================================
  // 站点分析 — 支持同时启用多个统计服务
  // 通过环境变量配置各服务的 ID，将 enabled 设为 true 即可激活
  // ===================================================================
  analytics: {
    /** 全局开关 — 设为 false 则禁用所有统计脚本 */
    enabled: true,
    providers: {
      umami: {
        enabled: false,
        /** Umami 网站 ID，部署时通过环境变量设置 */
        id: process.env.NEXT_PUBLIC_UMAMI_ID ?? "",
        /** Umami 统计脚本 URL（自部署请改为自己的地址） */
        scriptUrl: "https://cloud.umami.is/script.js",
      },
      google: {
        enabled: true,
        /** Google Analytics 4 衡量 ID，格式: G-XXXXXXXXXX */
        measurementId:
          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-TNWHN0DLLC",
      },
      /** 51la 网站统计 */
      la51: {
        enabled: true,
        /** 51la 网站 ID */
        id: process.env.NEXT_PUBLIC_51LA_ID ?? "3QY3fcmNgSjP54ai",
        /** 51la ck 密钥（部分场景需要） */
        ck: process.env.NEXT_PUBLIC_51LA_CK ?? "3QY3fcmNgSjP54ai",
      },
      /** 百度统计 */
      baidu: {
        enabled: true,
        /** 百度统计 token，即 hm.js? 后面的那串 ID */
        id:
          process.env.NEXT_PUBLIC_BAIDU_TONGJI_ID ??
          "7cff641d8826a80981ec7f2a89b5b77f",
      },
      /** Microsoft Clarity */
      clarity: {
        enabled: false,
        /** Clarity 项目 ID */
        id: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
      },
    },
  },

  // ===================================================================
  // 主题 — next-themes 配置
  // ===================================================================
  theme: {
    /** 深色优先：本站以深色为第一公民，浅色为对偶主题 */
    defaultTheme: "dark" as const,
    themes: ["light", "dark", "system"] as const,
    /** 主题注入方式：class → <html class="dark"> */
    attribute: "class" as const,
  },

  // ===================================================================
  // 导航栏 — 每个导航项的路由、文案与图标
  // -------------------------------------------------------------------
  // href 统一放在这里，组件内不再硬编码任何路由。
  // 桌面端渲染文字标签（图标无法自解释），移动端抽屉里图标 + 文字并用。
  // ===================================================================
  navigation: {
    articles: {
      label: "Articles",
      title: "Articles",
      href: "/posts",
      iconKey: "articles" as const,
    },
    explore: {
      label: "Explore",
      title: "Explore",
      href: "/explore",
      iconKey: "explore" as const,
    },
    rss: {
      label: "RSS Feed",
      title: "RSS Feed",
      href: "/rss.xml",
      iconKey: "rss" as const,
    },
    graph: {
      label: "Knowledge Graph",
      title: "Knowledge Graph",
      href: "/graph",
      iconKey: "graph" as const,
    },
    timeline: {
      label: "Timeline",
      title: "Timeline",
      href: "/timeline",
      iconKey: "timeline" as const,
    },
    tags: {
      label: "Tags",
      title: "Tags",
      href: "/tags",
      iconKey: "tags" as const,
    },
  },

  // ===================================================================
  // 文章详情页 — TOC、Knowledge Relations、评论区文案
  // ===================================================================
  toc: {
    heading: "On this page",
  },

  relatedArticles: {
    heading: "Related Articles",
  },

  articleRelations: {
    heading: "Knowledge Relations",
    parentLabel: "Parent Article",
    relatedLabel: "Related Articles",
    childrenLabel: "Child Articles",
  },

  // ===================================================================
  // 404 页面
  // ===================================================================
  notFound: {
    title: "404",
    description: "Page not found",
    /** 404 页的补充说明（告诉用户发生了什么、下一步能去哪） */
    hint: "这个地址没有对应的页面，可能是链接已经移动或被删除了。可以从下面这些入口重新开始：",
    backHome: "Back to home",
  },

  // ===================================================================
  // 页脚 — 版权署名 + ICP 备案（由 Footer 组件全局渲染于每个页面底部）
  // ===================================================================
  footer: {
    /** 版权起始年份 */
    copyrightSince: 2026,
    /** 版权署名 */
    copyrightName: "istarry",
    /**
     * ICP 备案信息。
     * 工信部要求网站页脚展示备案号，并链接至 beian.miit.gov.cn 供核查。
     */
    icp: {
      /** 设为 false 则隐藏备案号 */
      enabled: true,
      /** 备案号文本 */
      number: "鲁ICP备2025169299号",
      /** 工信部备案查询站点 — 官方要求的回跳地址，一般无需修改 */
      link: "https://beian.miit.gov.cn/",
    },
  },
} as const;

/** blogConfig 的完整类型，可用于组件的 props 类型约束 */
export type BlogConfig = typeof blogConfig;
