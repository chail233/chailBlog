// 构建期通过 git 获取文件的最后提交时间。
// 独立于 astro（不导入虚拟模块），以便 astro.config.mjs 与内容工具共用。
import { execFileSync } from 'node:child_process';

const cache = new Map();

/**
 * 返回文件在 git 中的最后提交时间（ISO 8601 解析出的 Date）。
 * 若 git 不可用、文件未被跟踪或无历史记录，返回 null。
 * @param {string} filePath 相对仓库根目录的路径（正斜杠）
 * @returns {Date | null}
 */
export function gitLastModified(filePath) {
  if (cache.has(filePath)) return cache.get(filePath);

  let result = null;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024,
    }).trim();
    if (out) {
      const d = new Date(out);
      if (!Number.isNaN(d.getTime())) result = d;
    }
  } catch {
    result = null;
  }

  cache.set(filePath, result);
  return result;
}
