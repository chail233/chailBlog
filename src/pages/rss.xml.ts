import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_TITLE, SITE_DESCRIPTION, postPath } from '../const';
import { sortPostsByDate, updatedDate } from '../utils/post';

export async function GET(context: APIContext) {
  const posts = sortPostsByDate(
    await getCollection('posts', ({ data }) => !data.draft),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    // 声明 Atom 命名空间，供下面的 atom:updated 使用
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? SITE_DESCRIPTION,
      pubDate: post.data.date,
      link: postPath(post.id),
      categories: post.data.categories,
      // RSS 2.0 无标准的逐条最后修改时间，用 Atom 的 updated 表达
      customData: `<atom:updated>${updatedDate(post).toISOString()}</atom:updated>`,
    })),
  });
}
