# chail Blog

个人博客，基于 [Astro](https://astro.build) 构建的纯静态站点（等宽字体 + 极光背景 + 深浅色双主题）。

- 线上地址：<https://chail.tech>
- 仓库：<https://github.com/chail233/chailBlog>

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Astro 7（静态输出，零客户端 JS 为原则） |
| 内容 | Markdown + Content Collections（类型校验） |
| 数学公式 | remark-math + rehype-katex（`$...$` 行内、`$$...$$` 独立） |
| 代码高亮 | Shiki 双主题（github-light / github-dark，随深浅色切换） |
| 字体 | JetBrains Mono（西文/数字）+ 霞鹜文楷等宽版（中文，按 unicode-range 分片加载） |
| 页面过渡 | View Transitions（`ClientRouter`，同文档导航） |
| 访问统计 | 不蒜子（busuanzi） |
| 部署 | 本地 `npm run build` → `wrangler pages deploy dist`（Cloudflare Pages） |

## 目录结构

```
├── astro.config.mjs        # 站点配置：site URL、sitemap(含 lastmod 注入)、KaTeX、Shiki
├── public/                 # 静态资源，构建时原样复制到 dist/ 根部
│   └── images/             # 文章配图（按文章建子目录）
└── src/
    ├── blog/               # ★ 文章 Markdown（ACM/ 算法、WaiWuBao/ 随笔）
    ├── components/         # PostItem / PostNav / TableOfContents / ThemeToggle / CodeEnhancements
    ├── layouts/
    │   └── BaseLayout.astro # 全站布局：head/meta、主题初始化、极光背景、页脚、全局样式与动效
    ├── pages/
    │   ├── index.astro      # 首页（Hero + 最新文章）
    │   ├── blog/[slug].astro# 文章页
    │   ├── category/[slug].astro # 分类页
    │   ├── about.astro      # 关于页
    │   ├── 404.astro        #  NotFound
    │   └── rss.xml.ts       # RSS 订阅源
    ├── utils/
    │   ├── post.ts          # 排序 / 更新时间回退 / 阅读时长
    │   └── git.mjs          # 构建期读取文件 git 最后提交时间
    ├── const.ts             # 站点标题、分类注册表、建站日期、路径工具函数
    └── content.config.ts    # 内容集合 schema 与 loader
```

## 关键实现

- **文章 URL 只用文件名**：`content.config.ts` 的 glob loader 通过 `generateId` 去掉子目录与 `.md` 扩展名，`src/blog/ACM/foo.md` → `/blog/foo`。子目录仅作归类用途。
- **更新时间三级回退**：frontmatter `updated` → 该文件 git 最后提交时间（构建期由 `utils/git.mjs` 读取）→ 无。列表页与 sitemap `lastmod` 共用这套逻辑；更新时间比发布时间晚 1 小时以上才在文章页显示。
- **主题切换防闪烁**：`<head>` 内联脚本在首屏绘制前按 `localStorage` / 系统偏好设定 `data-theme`；无 JS 时由 `<noscript>` 里的媒体查询回退到跟随系统。
- **View Transitions 兼容约定**：所有运行时脚本用 `document` 事件委托或监听 `astro:page-load` / `astro:after-swap` 重建状态；不蒜子统计脚本在 `astro:after-swap` 时克隆重插以触发重新计数。
- **动效体系**：极光背景三团错频漂移、进场错峰、滚动揭示（`js-reveal` + IntersectionObserver）、终端光标闪烁等，全部在 `prefers-reduced-motion: reduce` 下降级关闭。
- **页脚统计**：已运行天数按访客本地时间实时计算（起始日 `SITE_START_DATE`，含当天）；访问量由不蒜子填充，本地 localhost 预览无法按域名识别站点、数字会落到全局公共桶，以线上为准。

## 新增文章指南

### 1. 建文件

在 `src/blog/` 下选一个分类目录新建 `.md` 文件：

- `ACM/` —— 算法题解 / 竞赛（分类页「算法足迹」）
- `WaiWuBao/` —— 随笔杂文（分类页「外物报」）

**文件名会直接成为文章 URL**（`foo.md` → `/blog/foo`），注意：

- 全部文章（跨子目录）文件名不能重复，否则 URL 冲突；
- 中文文件名可用（访问时自动 URL 编码），但避免 `#`、`?` 等字符。

### 2. 写 frontmatter

```yaml
---
title: 文章标题
date: 2026-06-11
categories: [算法足迹]
description: 一句话摘要，用于列表页、RSS 与分享卡片（可省略）
updated: 2026-07-01        # 可省略，省略时自动取 git 最后提交时间
draft: false               # true 则不构建、不出现
---
```

- `date` 写 `YYYY-MM-DD` 即可，不需要时间与时区；只有同一天发多篇时才需要补时间区分先后。
- `categories` 填中文分类名，需在 `src/const.ts` 的 `CATEGORIES` 中登记才能进导航与分类页配色；新增分类时在那里登记一条（name + slug）。

### 3. 正文能力速查

| 需求 | 写法 |
| --- | --- |
| 代码块 | ` ```ts ... ``` `（Shiki 自动高亮，深浅色双主题） |
| 行内公式 | `$E=mc^2$` |
| 独立公式 | `$$...$$` 独占一行 |
| 插入图片 | 图片放 `public/images/<文章名>/`，正文写 `![描述](/images/文章名/foo.png)` —— **必须用 `/` 开头的绝对路径**，相对路径在 `/blog/xxx/` 路由下会 404 |
| 图片控制宽度 | 直接写 HTML：`<img src="/images/x/foo.png" width="480" />` |
| 目录（TOC） | 无需手动插入，文章页自动汇总 h2~h4 标题生成目录并滚动高亮 |
| 上下篇 | 自动生成，按日期降序排列 |

### 4. 本地预览

```bash
npm install     # 首次或依赖变化时
npm run dev     # http://localhost:4321
```

### 5. 部署

```bash
npm run build               # 产物在 dist/
npx wrangler pages deploy dist   # 上传到 Cloudflare Pages
```

推送文章后记得 `git commit`——git 提交时间同时充当文章「更新于」的数据源。

## 其他约定

- 编译配置：TypeScript `strict`（继承 `astro/tsconfigs/strict`，见 `tsconfig.json`）。
- `.astro/`、`dist/`、`node_modules/` 为生成目录，不要手改/入库。
- 站点标题、描述、分类注册表、建站日期集中在 `src/const.ts`，改全局文案优先去那里。
