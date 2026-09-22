import type { GetStaticPaths, APIContext } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { SITE_TITLE, SITE_DOMAIN } from '../../const';
import { sortPostsByDate } from '../../utils/post';
import { renderOgPng } from '../../utils/og';

// 构建期为每篇文章产出一张静态 OG 图
export const prerender = true;

type Post = CollectionEntry<'posts'>;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = sortPostsByDate(
    await getCollection('posts', ({ data }) => !data.draft),
  );
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export async function GET({ props }: APIContext) {
  const post = (props as { post: Post }).post;
  const png = await renderOgPng({
    title: post.data.title,
    siteName: SITE_TITLE,
    category: post.data.categories[0],
    description: post.data.description,
    domain: SITE_DOMAIN,
  });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  });
}
