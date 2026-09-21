import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/blog',
    // 文章 URL 只用文件名（去掉扩展名），不带 ACM/WaiWuBao 子目录
    generateId: ({ entry }) => entry.replace(/\.md$/, '').split('/').pop()!,
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // 文章摘要：用于列表页、RSS 与 OG 卡片；缺省时回退到站点描述
    description: z.string().optional(),
    draft: z.boolean().default(false),
    categories: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
