import type { APIContext } from 'astro';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_DOMAIN } from '../../const';
import { renderOgPng } from '../../utils/og';

// 站点默认 OG 图：非文章页（首页 / 关于 / 分类等）共用
export const prerender = true;

export async function GET(_context: APIContext) {
  const png = await renderOgPng({
    title: SITE_TITLE,
    siteName: SITE_TITLE,
    description: SITE_DESCRIPTION,
    domain: SITE_DOMAIN,
  });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  });
}
