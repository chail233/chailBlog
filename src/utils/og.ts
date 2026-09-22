/**
 * OG 分享图渲染（构建期）。
 *
 * 用 Satori 把 HTML/CSS 风格的元素树渲染成 SVG，再交给 resvg 光栅化为 PNG。
 * 中文渲染依赖仓库内置的 Noto Sans SC（OFL 许可），Satori 与 resvg 共用同一字体族名。
 * 纯 Node 端使用，只在构建/预览时执行，不进入浏览器产物。
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { CATEGORIES } from '../const';

const FONT_DIR = path.resolve('src', 'assets', 'og-fonts');
const REGULAR_PATH = path.join(FONT_DIR, 'NotoSansSC-Regular.otf');
const BOLD_PATH = path.join(FONT_DIR, 'NotoSansSC-Bold.otf');

/** 字体只读一次，缓存在模块级，供多张 OG 复用 */
let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;
function loadFonts() {
  if (fontCache) return fontCache;
  const read = (p: string) => readFileSync(p).buffer as ArrayBuffer;
  fontCache = { regular: read(REGULAR_PATH), bold: read(BOLD_PATH) };
  return fontCache;
}

const FONT_FAMILY = 'Noto Sans SC';

/** 深色底渐变，与站点暗色主题同源 */
const COLOR = {
  bg0: '#0b0f14',
  bg1: '#131a22',
  fg: '#e6edf3',
  muted: '#8b949e',
  accent: '#3ddc84',
  border: '#232b33',
};

/** 分类 -> 标签色（沿用站点分类配色，取暗色主题值） */
const CATEGORY_COLORS: Record<string, string> = {
  acm: '#58a6ff',
  waiwubao: '#d29922',
  poetry: '#3ddc84',
};

function categoryColor(name?: string): string {
  if (!name) return COLOR.accent;
  const found = CATEGORIES.find((c) => c.name === name);
  return (found && CATEGORY_COLORS[found.slug]) || COLOR.accent;
}

/** 极简 hyperscript：Satori 接受 { type, props } 形态的普通对象树 */
type Node =
  | { type: string; props: Record<string, unknown> }
  | string;
/**
 * 注意：Satori 规定——只要 children 是数组，父节点就必须显式设置 display。
 * 因此单个字符串子节点直接输出为裸字符串（文本叶子无需 display），
 * 多子节点才用数组（其父容器均已声明 display: flex）。
 */
function h(
  type: string,
  props: Record<string, unknown> = {},
  ...children: Node[]
): Node {
  const kids: unknown =
    children.length === 1 && typeof children[0] === 'string'
      ? children[0]
      : children;
  return { type, props: { ...props, children: kids } };
}

export interface OgInput {
  /** 主标题（文章标题或站点标题） */
  title: string;
  /** 站点名 */
  siteName: string;
  /** 分类名（可选，渲染为右上标签） */
  category?: string;
  /** 摘要（可选，标题较短时展示） */
  description?: string;
  /** 站点域名（右下角） */
  domain?: string;
}

const W = 1200;
const H = 630;

/**
 * 按标题长度自适应字号，避免长标题换行溢出画布。
 * 返回标题字号，并据此决定是否展示摘要。
 */
function titleFontSize(len: number): number {
  if (len <= 12) return 76;
  if (len <= 20) return 64;
  if (len <= 30) return 54;
  return 46;
}

function buildTree({ title, siteName, category, description, domain }: OgInput) {
  const size = titleFontSize(title.length);
  // 标题占位较大时省略摘要，保证不溢出
  const showDesc = !!description && size >= 64;

  // 顶部：站点名 + 分类标签
  const topChildren: Node[] = [
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      h('span', { style: { color: COLOR.accent, fontSize: 30 } }, '#'),
      h('span', { style: { fontSize: 30, letterSpacing: 1, color: COLOR.accent } }, siteName),
    ),
  ];
  if (category) {
    topChildren.push(
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            fontSize: 26,
            padding: '8px 22px',
            borderRadius: 999,
            color: categoryColor(category),
            border: `2px solid ${categoryColor(category)}`,
          },
        },
        category,
      ),
    );
  }

  // 中部：主标题（+ 摘要）
  const centerChildren: Node[] = [
    h(
      'div',
      { style: { fontSize: size, fontWeight: 700, lineHeight: 1.25, color: COLOR.fg } },
      title,
    ),
  ];
  if (showDesc) {
    centerChildren.push(
      h(
        'div',
        { style: { fontSize: 28, lineHeight: 1.5, color: COLOR.muted } },
        description as string,
      ),
    );
  }

  // 底部：域名 + 署名
  const bottomChildren: Node[] = [
    h('span', { style: { fontSize: 24, color: COLOR.muted } }, domain ?? ''),
    h('span', { style: { fontSize: 24, color: COLOR.accent } }, '// chail'),
  ];

  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        fontFamily: FONT_FAMILY,
        backgroundColor: COLOR.bg0,
        backgroundImage: `linear-gradient(135deg, ${COLOR.bg0} 0%, ${COLOR.bg1} 100%)`,
        color: COLOR.fg,
      },
    },
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, ...topChildren),
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 24 } }, ...centerChildren),
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, ...bottomChildren),
  );
}

/** 渲染一张 OG 图为 PNG 字节 */
export async function renderOgPng(input: OgInput): Promise<Uint8Array> {
  const { regular, bold } = loadFonts();
  const svg = await satori(buildTree(input) as never, {
    width: W,
    height: H,
    fonts: [
      { name: FONT_FAMILY, data: regular, weight: 400, style: 'normal' },
      { name: FONT_FAMILY, data: bold, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: {
      fontFiles: [REGULAR_PATH, BOLD_PATH],
      loadSystemFonts: false,
      defaultFontFamily: FONT_FAMILY,
    },
  });

  return resvg.render().asPng();
}
