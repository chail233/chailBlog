export const SITE_TITLE = 'chail Blog';
export const SITE_DESCRIPTION = 'chail 的云存档';

/** 导航栏中展示的分类，新增分类时在此登记 */
export const CATEGORIES: { name: string; slug: string }[] = [
  { name: '算法足迹', slug: 'acm' },
  { name: '外物报', slug: 'waiwubao' },
];

/** 分类名 -> 分类页路径（未登记的分类直接用中文名做 slug） */
export function categoryPath(name: string): string {
  const found = CATEGORIES.find((c) => c.name === name);
  return `/category/${found ? found.slug : name}`;
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 文章页相对路径；id 可能含 [] 空格等字符，需 URL 编码 */
export function postPath(id: string): string {
  return `/blog/${encodeURIComponent(id)}`;
}
