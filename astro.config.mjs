import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { gitLastModified } from './src/utils/git.mjs';

// 构建期扫描 src/blog，为每篇文章算一个 lastmod（手动 updated > git 提交时间）。
// 惰性求值：仅在生成 sitemap 时执行，避免拖慢 astro dev。
let _lastmodMap;
function postLastmodMap() {
  if (_lastmodMap) return _lastmodMap;
  const map = new Map();
  const base = path.resolve('src', 'blog');
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.md')) continue;
      const id = entry.name.replace(/\.md$/, '');
      let lm = null;
      // 1) 优先解析 frontmatter 里的 updated
      try {
        const head = readFileSync(full, 'utf8').slice(0, 600);
        const m = head.match(/^updated:\s*(.+)$/m);
        if (m) {
          const d = new Date(m[1].trim().replace(/^["']|["']$/g, ''));
          if (!Number.isNaN(d.getTime())) lm = d;
        }
      } catch {
        /* ignore */
      }
      // 2) 回退到 git 最后提交时间
      if (!lm) {
        const rel = path.relative(process.cwd(), full).split(path.sep).join('/');
        lm = gitLastModified(rel);
      }
      if (lm) map.set(id, lm.toISOString());
    }
  };
  walk(base);
  _lastmodMap = map;
  return map;
}

// https://astro.build/config
export default defineConfig({
  // 站点绝对 URL：sitemap / RSS / canonical / OG 依赖它生成绝对链接
  site: 'https://chail.tech',
  integrations: [
    sitemap({
      // 该版本集成不支持逐项 lastmod，借助 serialize 回调按文章 URL 注入
      serialize(item) {
        const m = item.url.match(/\/blog\/([^/]+)\/?$/);
        if (m) {
          let id;
          try {
            id = decodeURIComponent(m[1]);
          } catch {
            id = m[1];
          }
          const lm = postLastmodMap().get(id);
          if (lm) return { ...item, lastmod: lm };
        }
        return item;
      },
    }),
  ],
  markdown: {
    // Astro 7 默认处理器为 Sätteri；因 KaTeX 渲染依赖 unified 生态插件，
    // 这里显式声明走 unified 管线（官方推荐、非废弃写法）。
    processor: unified({
      // $...$ 行内、$$...$$ 独立公式
      remarkPlugins: [remarkMath],
      // 用 KaTeX 渲染；容忍文章中混入的中文，不因单个公式报错中断构建
      rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
    }),
    // 代码块高亮（内置 Shiki）：配置双主题，配合 BaseLayout 的 CSS 变量随系统深浅色切换
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
