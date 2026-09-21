import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // 站点绝对 URL：sitemap / RSS / canonical / OG 依赖它生成绝对链接
  site: 'https://chail.tech',
  integrations: [sitemap()],
  markdown: {
    // Astro 7 默认处理器为 Sätteri；因 KaTeX 渲染依赖 unified 生态插件，
    // 这里显式声明走 unified 管线（官方推荐、非废弃写法）。
    processor: unified({
      // $...$ 行内、$$...$$ 独立公式
      remarkPlugins: [remarkMath],
      // 用 KaTeX 渲染；容忍文章中混入的中文，不因单个公式报错中断构建
      rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
    }),
    // 代码块高亮（内置 Shiki），单主题直接内联着色，无需额外 CSS
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
