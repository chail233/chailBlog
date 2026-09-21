import type { CollectionEntry } from 'astro:content';
import { gitLastModified } from './git.mjs';

export type Post = CollectionEntry<'posts'>;

/** 按发布时间倒序（新→旧）返回新数组，供首页/分类/文章页复用 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** 文章相对仓库根目录的文件路径（正斜杠）；无 filePath 时返回 null */
function repoRelPath(post: Post): string | null {
  if (!post.filePath) return null;
  return `src/blog/${post.filePath}`.replace(/\\/g, '/');
}

/**
 * 有效更新时间：手动 updated 字段 > git 最后提交时间 > 创建日期。
 * 用于文章页展示与 RSS/sitemap 的 lastmod。
 */
export function updatedDate(post: Post): Date {
  if (post.data.updated) return post.data.updated;
  const rel = repoRelPath(post);
  if (rel) {
    const g = gitLastModified(rel);
    if (g) return g;
  }
  return post.data.date;
}

/** 估算阅读时长（分钟）：中日韩按 ~300 字/分、拉丁词按 ~200 词/分 */
export function readingTime(post: Post): number {
  const body = post.body ?? '';
  const cjk = (body.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) ?? [])
    .length;
  const latinWords = (
    body
      .replace(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g, ' ')
      .match(/[A-Za-z0-9]+/g) ?? []
  ).length;
  return Math.max(1, Math.round(cjk / 300 + latinWords / 200));
}
