---
title: "The Star Is All I Need"
date: 2026-09-25
draft: false
description: "星星即我所求，我多么想要脱离现在的一切，漂泊在宇宙汪洋之中，可没有大地，星星又该悬挂在哪一片天空"
categories:
  - "诗歌"
---

<style>
  /* —— 本页专属夜景主题：只改设计令牌，整站组件自动跟随 —— */
  html:has(.starfield) {
    color-scheme: dark;
  }
  html:has(.starfield) {
    --fg: #d4dbe6;
    --fg-muted: #8b96ab;
    --bg: #040a16;
    --bg-soft: #0a1428;
    --bg-card: rgba(9, 18, 38, 0.55);
    --border: #1d2b45;
    --accent: #ffd97a;
    --tag-bg: #122142;
    --tag-fg: #ffe9a8;
    --header-bg: rgba(5, 11, 24, 0.72);
    --grid: rgba(120, 160, 255, 0.05);
    --glow: rgba(70, 110, 220, 0.28);
    --glow-2: rgba(150, 120, 255, 0.18);
    --noise: 0.05;
  }
  /* 星空下撤掉站点默认的竖向渐变（base.css 同为单类选择器，靠后出现取胜） */
  html:has(.starfield) body {
    background-image: none;
    background-attachment: scroll;
  }

  /* JS 运行时注入的自定义属性：集中声明默认值兼文档（实际值由内联 style 覆盖） */
  :root {
    --i: 0;        /* 诗句行序号 → 行波相位 */
    --o0: 0.1;     /* 生成星暗期透明度 */
    --o1: 0.9;     /* 生成星亮期透明度 */
    --sz: 3px;     /* 点击粒子尺寸 */
    --c: #ffe9a8;  /* 点击粒子颜色 */
    --dx: 0px;     /* 粒子迸射水平位移 */
    --dy: 0px;     /* 粒子迸射垂直位移 */
  }

  /* —— 星空画布：fixed 铺满视口，作为最底层背景 —— */
  .starfield {
    position: fixed;
    /* 四周留出余量：指针视差会整体平移画布，避免露边 */
    inset: -30px;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    /* 视差平移用长缓动平滑跟随，不必每帧 rAF */
    transition: transform 1.1s cubic-bezier(0.22, 0.61, 0.36, 1);
    will-change: transform;
    background:
      /* 淡淡的银河斜带 */
      linear-gradient(120deg, transparent 42%, rgba(130, 160, 255, 0.07) 50%, transparent 58%),
      radial-gradient(120% 65% at 50% -12%, rgba(130, 170, 255, 0.16), transparent 60%),
      linear-gradient(180deg, #03060f 0%, #061024 52%, #0b1c3e 100%);
  }
  /* 星云：几团错频呼吸的彩色柔光，让背景不再是纯黑 */
  .starfield .nebula {
    position: absolute;
    inset: -20%;
    filter: blur(34px);
    background:
      radial-gradient(28% 24% at 22% 26%, rgba(80, 120, 255, 0.2), transparent 70%),
      radial-gradient(26% 22% at 80% 62%, rgba(150, 90, 230, 0.16), transparent 70%),
      radial-gradient(34% 28% at 58% 12%, rgba(40, 180, 200, 0.12), transparent 70%),
      radial-gradient(24% 20% at 40% 82%, rgba(230, 120, 180, 0.1), transparent 70%);
    animation: neb-breathe 34s ease-in-out infinite alternate;
  }
  @keyframes neb-breathe {
    from { opacity: 0.62; transform: translate(0, 0) scale(1); }
    to { opacity: 1; transform: translate(2%, -2%) scale(1.1); }
  }
  /* starfield 是不透明背景且 fixed 铺满视口，需把同级正文内容整体抬到它之上，
     否则标题头 / 目录 / 上下一篇文章等无动画组件会被盖住。 */
  article.prose > :not(.starfield) {
    position: relative;
    z-index: 1;
  }

  .starfield i {
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    will-change: transform;
  }
  /* 三层远景星：改为缓慢视差漂移（alternate），营造纵深，不再整块同步闪 */
  .starfield .layer1 {
    background: #fff;
    opacity: 0.85;
    box-shadow: 55vw 12vh 0 0 #fff, 12vw 30vh 0 0 #cfe0ff, 78vw 8vh 0 0 #fff,
      32vw 5vh 0 0 #ffe9b3, 90vw 38vh 0 0 #fff, 8vw 55vh 0 0 #cfe0ff,
      45vw 45vh 0 0 #fff, 68vw 60vh 0 0 #ffe9b3, 22vw 72vh 0 0 #fff,
      84vw 78vh 0 0 #cfe0ff, 50vw 88vh 0 0 #fff, 15vw 92vh 0 0 #ffe9b3;
    animation: sway-a 24s ease-in-out infinite alternate;
  }
  .starfield .layer2 {
    width: 3px;
    height: 3px;
    background: #eaf2ff;
    opacity: 0.8;
    box-shadow: 25vw 15vh 0 0 #eaf2ff, 62vw 22vh 0 0 #fff, 5vw 40vh 0 0 #cfe0ff,
      88vw 50vh 0 0 #eaf2ff, 38vw 65vh 0 0 #fff, 72vw 85vh 0 0 #cfe0ff,
      18vw 20vh 0 0 #ffe9b3, 95vw 12vh 0 0 #eaf2ff, 55vw 33vh 0 0 #fff,
      30vw 82vh 0 0 #cfe0ff;
    animation: sway-b 32s ease-in-out infinite alternate;
  }
  .starfield .layer3 {
    width: 1px;
    height: 1px;
    background: #fff;
    opacity: 0.7;
    box-shadow: 40vw 10vh 0 0 #fff, 10vw 8vh 0 0 #9db8e8, 70vw 30vh 0 0 #fff,
      92vw 68vh 0 0 #9db8e8, 28vw 48vh 0 0 #fff, 60vw 72vh 0 0 #9db8e8,
      3vw 75vh 0 0 #fff, 78vw 42vh 0 0 #fff, 48vw 25vh 0 0 #9db8e8,
      20vw 38vh 0 0 #fff, 66vw 5vh 0 0 #fff, 35vw 95vh 0 0 #9db8e8,
      82vw 25vh 0 0 #fff, 12vw 62vh 0 0 #fff;
    animation: sway-c 40s ease-in-out infinite alternate;
  }
  @keyframes sway-a { from { transform: translate(0, 0); } to { transform: translate(-1.6vw, 1.2vh); } }
  @keyframes sway-b { from { transform: translate(0, 0); } to { transform: translate(1.4vw, -1vh); } }
  @keyframes sway-c { from { transform: translate(0, 0); } to { transform: translate(-1vw, -1.4vh); } }

  /* 亮星：带十字星芒，各自不同周期的呼吸闪 */
  .starfield .big {
    width: 3px;
    height: 3px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.9),
      0 0 18px 6px rgba(160, 200, 255, 0.45);
    animation: big-pulse 5.4s ease-in-out infinite;
  }
  .starfield .big::before,
  .starfield .big::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    width: 26px;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
  }
  .starfield .big::after {
    rotate: 90deg;
  }
  .starfield .big::before { /* 沿自身再拉一条 45° 短芒 */
    rotate: 45deg;
    width: 16px;
  }
  .starfield .big1 { top: 14vh; left: 70vw; animation-duration: 4.6s; animation-delay: -0.6s; }
  .starfield .big2 { top: 38vh; left: 10vw; animation-duration: 6.8s; animation-delay: -2.4s; }
  .starfield .big3 { top: 68vh; left: 82vw; animation-duration: 5.2s; animation-delay: -3.6s; }
  .starfield .big4 { top: 84vh; left: 30vw; animation-duration: 7.4s; animation-delay: -1.2s; }
  @keyframes big-pulse {
    0%, 100% { opacity: 0.75; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.18); }
  }

  /* 流星：平时不可见，偶尔划过（纯 CSS，不同延时错开） */
  .starfield .shoot {
    position: absolute;
    top: 0;
    left: 0;
    /* 尾长随屏宽缩放，手机上不会比半屏还长 */
    width: clamp(60px, 18vw, 130px);
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), #fff);
    transform-origin: left center;
    filter: drop-shadow(0 0 6px rgba(180, 210, 255, 0.9));
    opacity: 0;
    will-change: transform, opacity;
  }
  .starfield .shoot1 { top: 10%; animation: shoot 11s ease-in 2s infinite; }
  .starfield .shoot2 { top: 32%; animation: shoot 14s ease-in 8s infinite; }
  .starfield .shoot3 { top: 55%; animation: shoot 17s ease-in 13s infinite; }
  /* 反向流星：从右上方掠向左下，与主方向交错更像真实夜空 */
  .starfield .shoot4 { top: 16%; animation: shoot-r 19s ease-in 6s infinite; }
  /* 轨迹位移 x/y 统一用 vw：位移角只由比例决定、与屏幕长宽比无关，
     保证竖屏手机上滑动方向与尾迹 rotate 角度始终一致，不再斜穿走形 */
  @keyframes shoot {
    0% { opacity: 0; transform: translate(-18vw, -7vw) rotate(20deg) scaleX(0.3); }
    3% { opacity: 1; }
    10% { opacity: 0; transform: translate(56vw, 19.5vw) rotate(20deg) scaleX(1); }
    100% { opacity: 0; transform: translate(56vw, 19.5vw) rotate(20deg) scaleX(1); }
  }
  @keyframes shoot-r {
    0% { opacity: 0; transform: translate(116vw, -7vw) rotate(160deg) scaleX(0.3); }
    3% { opacity: 1; }
    10% { opacity: 0; transform: translate(42vw, 19.5vw) rotate(160deg) scaleX(1); }
    100% { opacity: 0; transform: translate(42vw, 19.5vw) rotate(160deg) scaleX(1); }
  }

  /* JS 生成的独立星：每颗各自随机位置/大小/周期闪烁 */
  .starfield .genstars { position: absolute; inset: 0; }
  .starfield .genstars s {
    position: absolute;
    display: block;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.7);
    animation: tw linear infinite;
  }
  @keyframes tw {
    0%, 100% { opacity: var(--o0, 0.1); transform: scale(0.5); }
    50% { opacity: var(--o1, 0.9); transform: scale(1.1); }
  }

  /* 淡月：右上角一轮凸月 + 大月晕，呼应“一万次月光”；
     缺掉的边缘用页面底色遮罩，与背景无缝融合 */
  .starfield .moon {
    position: absolute;
    top: 9vh;
    left: 76vw;
    width: 74px;
    height: 74px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 62% 40%, rgba(255, 252, 235, 0.95), rgba(255, 250, 230, 0.78) 55%, rgba(235, 235, 220, 0.5) 78%, transparent 86%),
      radial-gradient(circle at 40% 62%, transparent 46%, #071022 54%);
    box-shadow: 0 0 44px 16px rgba(216, 226, 255, 0.22),
      0 0 140px 70px rgba(180, 200, 255, 0.12);
    animation: moon-glow 13s ease-in-out infinite;
  }
  @keyframes moon-glow {
    0%, 100% { box-shadow: 0 0 44px 16px rgba(216, 226, 255, 0.22), 0 0 140px 70px rgba(180, 200, 255, 0.12); }
    50% { box-shadow: 0 0 58px 22px rgba(216, 226, 255, 0.3), 0 0 170px 85px rgba(180, 200, 255, 0.16); }
  }
  /* 月晕：外圈薄环呼吸，古诗里的“月晕而风”，含蓄的华丽 */
  .starfield .moon::before {
    content: '';
    position: absolute;
    inset: -18px;
    border-radius: 50%;
    border: 1px solid rgba(216, 226, 255, 0.16);
    box-shadow: 0 0 22px rgba(216, 226, 255, 0.14), inset 0 0 16px rgba(216, 226, 255, 0.1);
    animation: moon-halo 9s ease-in-out infinite;
  }
  @keyframes moon-halo {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.09); }
  }

  /* —— 情绪曲线：随阅读进度，夜空从暮色大地渐入纯粹深夜 ——
     纯 CSS scroll-driven animation，不支持的浏览器完全无感（保持静态夜空） */
  @supports (animation-timeline: scroll()) {
    @media (prefers-reduced-motion: no-preference) {
      @keyframes night-deep {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes stars-gather {
        from { opacity: 0.4; }
        to { opacity: 1; }
      }
      /* 深夜层盖在暮色底上：越往下读越是纯粹的黑，星星随之亮起来 */
      .starfield .nightfall {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, #020409 0%, #04081a 55%, rgba(4, 8, 26, 0) 100%);
        animation: night-deep linear both;
        animation-timeline: scroll(root block);
      }
      .starfield .genstars {
        animation: stars-gather linear both;
        animation-timeline: scroll(root block);
      }
    }
  }

  /* —— 标题去终端感：# 换成 ✦，文字从大地褐渐变到星金 —— */
  article.prose > header h1::before {
    content: '✦ ';
    color: #ffe9a8;
  }
  article.prose > header h1 {
    background: linear-gradient(100deg, #c9a17c 0%, #e8d9b0 42%, #ffe9a8 72%, #fff6d8 100%);
    background-size: 220% 100%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 26px rgba(255, 225, 150, 0.28);
    /* 标题流光：光泽缓慢扫过字面 */
    animation: title-sheen 10s ease-in-out infinite;
  }
  @keyframes title-sheen {
    0%, 100% { background-position: 0 0; }
    50% { background-position: 100% 0; }
  }

  /* —— 文字悬浮：每一句单独漂浮 + 星光晕 —— */
  /* 小节（段落）之间的间距拉大，与句内行距拉开层次 */
  .poem-float > p {
    margin: 0 0 2.4em;
  }
  .poem-float .pline {
    display: block;
    /* 拉大句间行距，让诗句在夜空里疏朗呼吸 */
    line-height: 3.1;
    animation: poet-float 8s ease-in-out infinite;
    /* 周期统一、延时按句序等差递增 → 相位差恒定，整首诗是一道平滑传递的行波；
       若各行周期不同，相位会随机漂移，看起来就是乱抖 */
    animation-delay: calc(var(--i, 0) * -0.5s);
    text-shadow: 0 0 18px rgba(190, 215, 255, 0.3), 0 0 40px rgba(140, 170, 255, 0.14);
  }
  @keyframes poet-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  /* 无 JS 兜底：至少让逐句以整段形式漂浮（若未拆分则整段浮动） */
  .poem-float > p:not(:has(.pline)) {
    line-height: 3.1;
    animation: poet-float 7s ease-in-out infinite;
    text-shadow: 0 0 18px rgba(190, 215, 255, 0.3), 0 0 40px rgba(140, 170, 255, 0.14);
  }

  /* —— 结尾特写：“即我所求”是灵魂安顿处，放大、拉开字距、最亮光晕，其余稍压暗 —— */
  .poem-float > p {
    opacity: 0.88;
  }
  .poem-float > p:last-child {
    opacity: 1;
    margin-bottom: 0.6em;
  }
  .poem-float > p:last-child .pline {
    /* 保持逐行换行（display:inline 会把三句挤成一行），仅关闭浮动：结尾安顿 */
    display: block;
    /* 末段字号大，行距相应收紧，避免比前文更松 */
    line-height: 2.4;
    animation: none;
    font-size: 1.3rem;
    letter-spacing: 0.35em;
    text-shadow: 0 0 22px rgba(255, 235, 170, 0.55), 0 0 54px rgba(255, 220, 130, 0.25);
  }
  /* “即我所求”终句：更大的镀金渐变字 + 光泽往复，全诗的落点 */
  .poem-float > p:last-child .pline:last-child {
    font-size: 1.55rem;
    letter-spacing: 0.5em;
    background: linear-gradient(100deg, #ffd97a 0%, #fff6d8 45%, #ffe9a8 80%);
    background-size: 200% 100%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: gild-sheen 8s ease-in-out infinite;
  }
  @keyframes gild-sheen {
    0%, 100% { background-position: 0 0; }
    50% { background-position: 100% 0; }
  }
  /* 末段里“那颗星星”四字保留行波浮动（JS 会加 class），像还在轻轻呼吸；其余静止安顿 */
  .poem-float > p:last-child .pline.still-float {
    display: inline-block;
    color: inherit;
    background: none;
    animation: poet-float 8s ease-in-out infinite;
  }

  /* 尾部分隔花饰：诗落处，星又亮一排 */
  .flourish {
    margin: 0.4em 0 2.6em;
    text-align: center;
    letter-spacing: 1.1em;
    text-indent: 1.1em;
    font-size: 0.95rem;
    color: #ffe9a8;
    text-shadow: 0 0 12px rgba(255, 225, 150, 0.55);
    animation: flour-breathe 6s ease-in-out infinite;
  }
  @keyframes flour-breathe {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 0.95; }
  }

  /* —— 交互：点击迸发星尘 + 指针划过留下微光 —— */
  .trail-star {
    position: fixed;
    z-index: 60;
    pointer-events: none;
    color: #ffe9a8;
    text-shadow: 0 0 8px rgba(255, 225, 150, 0.85);
    animation: trail-fade 1.15s ease-out forwards;
  }
  @keyframes trail-fade {
    0% { opacity: 0.95; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(16px) scale(0.35); }
  }
  .click-spark {
    position: fixed;
    z-index: 60;
    pointer-events: none;
  }
  /* 迸射的微尘粒子：方向/距离/尺寸/颜色由 JS 写进自定义属性 */
  .click-spark i {
    position: absolute;
    width: var(--sz);
    height: var(--sz);
    margin: calc(var(--sz) / -2);
    border-radius: 50%;
    background: var(--c);
    box-shadow: 0 0 8px var(--c);
    animation: burst-fly 0.9s cubic-bezier(0.15, 0.6, 0.4, 1) forwards;
  }
  @keyframes burst-fly {
    0% { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.2); }
  }
  /* 点击处的光环 */
  .click-spark s {
    position: absolute;
    width: 44px;
    height: 44px;
    margin: -22px 0 0 -22px;
    border-radius: 50%;
    border: 1px solid rgba(255, 235, 170, 0.7);
    animation: burst-ring 0.7s ease-out forwards;
  }
  @keyframes burst-ring {
    0% { opacity: 0.9; transform: scale(0.2); }
    100% { opacity: 0; transform: scale(1.45); }
  }

  /* —— 背景音乐入口：文章开头的星金胶囊按钮，播放时辉光呼吸 —— */
  .music-entry {
    margin: 0 0 2em;
  }
  .music-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.45em 1.15em;
    border-radius: 999px;
    border: 1px solid rgba(255, 225, 150, 0.35);
    background: rgba(10, 20, 40, 0.5);
    color: #ffe9a8;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    cursor: pointer;
    opacity: 0.72;
    box-shadow: 0 0 12px rgba(255, 225, 150, 0.12);
    transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  .music-btn:hover {
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0 0 18px rgba(255, 225, 150, 0.3);
  }
  .music-btn.playing {
    opacity: 1;
    animation: music-breathe 3.4s ease-in-out infinite;
  }
  @keyframes music-breathe {
    0%, 100% { box-shadow: 0 0 12px rgba(255, 225, 150, 0.12); }
    50% { box-shadow: 0 0 22px rgba(255, 225, 150, 0.45); }
  }

  /* 减弱动效：只留静态星空，关掉漂移/闪烁/浮动/流星 */
  @media (prefers-reduced-motion: reduce) {
    .starfield i,
    .starfield .nebula,
    .starfield .shoot,
    .starfield .genstars s,
    .starfield .moon,
    .starfield .moon::before,
    .poem-float .pline,
    .poem-float .still-float,
    .poem-float > p,
    .poem-float > p:last-child .pline:last-child,
    .flourish,
    .music-btn.playing,
    article.prose > header h1 {
      animation: none !important;
    }
  }
</style>

<div class="starfield" aria-hidden="true">
  <span class="nebula"></span>
  <span class="nightfall"></span>
  <span class="moon"></span>
  <i class="layer1"></i><i class="layer2"></i><i class="layer3"></i>
  <i class="big big1"></i><i class="big big2"></i><i class="big big3"></i><i class="big big4"></i>
  <span class="shoot shoot1"></span><span class="shoot shoot2"></span><span class="shoot shoot3"></span><span class="shoot shoot4"></span>
  <span class="genstars"></span>
</div>

<div class="music-entry">
  <button class="music-btn" type="button" aria-pressed="false">♪ 播放背景音乐</button>
</div>

<div class="poem-float">

从地球上最温暖柔软的草地出发  
无数条隐匿的溪流横穿在路上  
石头下的泥土沉积着可爱的玩偶  
一万次月光洒过脚下的道路  
一千次发现树干上星星的印记  
深蓝的天幕令人无限憧憬  
而太阳总会如期而至

生命应当如太阳发出光和热  
灵魂则只需追寻星星的印记  
我愿卸下我的生命  
沿着宇宙的沙滩泊入星星的轨道  
我毫不留恋从前的家乡  
我只愿一同划过无数个世界的夜空  
而后为每个天空编织星星的故事

可容纳星星的恰恰是一片天空  
感受星星的恰恰是一颗心脏  
滋养生命的是遮蔽星星的太阳

流动的血液支撑着仅有的灵魂  
在每一处港口前瞭望着地平线  
在最黑暗最平静的夜晚  
才打开通往天际的风帆

在一切的开头我们本为一体  
如今高挂夜空的那颗星星  
即我所求

</div>

<div class="flourish" aria-hidden="true">✧ ⋆ ✦ ⋆ ✧</div>

<script>
  // 本页专属：生成随机独立闪烁的星星 + 将每句诗拆成可单独悬浮的元素。
  // 兼容 View Transitions：初始化调用一次，并在 astro:page-load 重新执行（软导航后 DOM 会替换）。
  // 幂等：用子元素计数与 data 标记避免重复处理。
  function starfieldEnhance() {
    var field = document.querySelector('.starfield');
    if (field) {
      var gen = field.querySelector('.genstars');
      if (gen && gen.childElementCount === 0) {
        var tints = ['#ffffff', '#cfe0ff', '#ffe9b3', '#bcd0ff', '#ffd9a8'];
        var frag = document.createDocumentFragment();
        for (var i = 0; i < 54; i++) {
          var s = document.createElement('s');
          var size = (Math.random() * 2 + 1).toFixed(2);
          s.style.top = (Math.random() * 100).toFixed(2) + '%';
          s.style.left = (Math.random() * 100).toFixed(2) + '%';
          s.style.width = size + 'px';
          s.style.height = size + 'px';
          s.style.background = tints[i % tints.length];
          s.style.setProperty('--o0', (Math.random() * 0.2 + 0.05).toFixed(2));
          s.style.setProperty('--o1', (Math.random() * 0.35 + 0.6).toFixed(2));
          s.style.animationDuration = (Math.random() * 3.4 + 1.8).toFixed(2) + 's';
          s.style.animationDelay = (-Math.random() * 7).toFixed(2) + 's';
          frag.appendChild(s);
        }
        gen.appendChild(frag);
      }
    }

    var poem = document.querySelector('.poem-float');
    if (poem && poem.dataset.floated !== '1') {
      var idx = 0;
      poem.querySelectorAll('p').forEach(function (p) {
        var lines = p.innerHTML
          .split(/<br\s*\/?>/i)
          .map(function (x) { return x.trim(); })
          .filter(function (x) { return x.length > 0; });
        if (!lines.length) return;
        p.innerHTML = lines
          .map(function (ln) {
            return '<span class="pline" style="--i:' + idx++ + '">' + ln + '</span>';
          })
          .join('');
      });
      /* 末段特写：“如今高挂夜空的那颗星星”里的四个字单独浮动，其余随段落静止安顿 */
      var lastP = poem.querySelector('p:last-of-type');
      if (lastP) {
        lastP.innerHTML = lastP.innerHTML.replace(
          /那颗星星/,
          '<span class="pline still-float">那颗星星</span>'
        );
      }
      poem.dataset.floated = '1';
    }
  }

  /* 交互特效：点击星尘迸发 + 指针视差 + 划过微光。
     监听挂在 document 上（跨软导航存活），用 window 标记防重复绑定；
     处理函数内每次检查 .starfield 是否存在，其它页面自动无感。 */
  function starfieldSfx() {
    if (window.__starSfxBound) return;
    window.__starSfxBound = true;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var lastTrail = 0;

    document.addEventListener('click', function (e) {
      if (!document.querySelector('.starfield') || reduced.matches) return;
      var colors = ['#ffe9a8', '#fff6d8', '#cfe0ff', '#ffffff'];
      var spark = document.createElement('span');
      spark.className = 'click-spark';
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      spark.appendChild(document.createElement('s'));
      for (var i = 0; i < 10; i++) {
        var p = document.createElement('i');
        var ang = Math.random() * Math.PI * 2;
        var dist = 26 + Math.random() * 34;
        p.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
        p.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(1) + 'px');
        p.style.setProperty('--sz', (2 + Math.random() * 2.5).toFixed(1) + 'px');
        p.style.setProperty('--c', colors[i % colors.length]);
        spark.appendChild(p);
      }
      document.body.appendChild(spark);
      setTimeout(function () { spark.remove(); }, 1000);
    });

    document.addEventListener('pointermove', function (e) {
      var field = document.querySelector('.starfield');
      if (!field || reduced.matches) return;
      /* 整张星空画布轻微反向跟随指针 → 深度感；长 transition 自带阻尼 */
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      field.style.transform =
        'translate3d(' + (-nx * 22).toFixed(1) + 'px,' + (-ny * 16).toFixed(1) + 'px,0)';
      if (e.pointerType !== 'mouse') return;
      /* 节流：约每 110ms 在指针处留一颗渐灭小星 */
      var now = performance.now();
      if (now - lastTrail < 110) return;
      lastTrail = now;
      var t = document.createElement('span');
      t.className = 'trail-star';
      t.textContent = Math.random() < 0.5 ? '✦' : '⋆';
      t.style.left = (e.clientX + (Math.random() * 10 - 5)).toFixed(0) + 'px';
      t.style.top = (e.clientY + (Math.random() * 10 - 5)).toFixed(0) + 'px';
      t.style.fontSize = (8 + Math.random() * 7).toFixed(0) + 'px';
      document.body.appendChild(t);
      setTimeout(function () { t.remove(); }, 1200);
    }, { passive: true });
  }

  /* 背景音乐：曲子在 public/audio/ 下，文件名含中文/空格需 encodeURI 转义。
     - 浏览器不允许带声自动播放：首次由用户点击开启，sessionStorage 记住意愿，
       回访时尝试续播，被拦则退回等点击；
     - 音量淡入淡出，不咖一声起停；
     - 入口按钮内联在文章开头（静态 HTML），View Transitions 软导航后 DOM 会换新，
       用 dataset 标记幂等重新绑定；离开本页（按钮不在）则暂停；
     - 音频文件缺失（加载出错）时隐藏入口，不留死控件。 */
  var BGM_SRC = encodeURI('/audio/加藤达也 - 忘れえない記憶 (难忘的记忆).ogg');
  var BGM_KEY = 'star-bgm';
  var bgm = null;
  var bgmBad = false;

  function bgmFade(fn) { // 每次只保留一个渐变定时器
    if (bgm && bgm._fade) clearInterval(bgm._fade);
    bgm._fade = fn();
  }
  function bgmPlay() {
    var p = bgm.play();
    if (!p || !p.then) return;
    p.then(function () {
      sessionStorage.setItem(BGM_KEY, 'on');
      bgm.volume = 0;
      bgmFade(function () {
        return setInterval(function () {
          bgm.volume = Math.min(0.45, bgm.volume + 0.02);
          if (bgm.volume >= 0.45) clearInterval(bgm._fade);
        }, 30);
      });
      bgmSyncBtn();
    }).catch(function () {
      // 自动播放被拦 / 资源不可用：清掉意愿标记，等用户点击
      sessionStorage.removeItem(BGM_KEY);
    });
  }
  function bgmPause() {
    sessionStorage.setItem(BGM_KEY, 'off');
    /* 按钮文案不在这里同步：淡出期间 paused 仍为 false，要等淡出结束真正 pause 后
       由 audio 自身的 play/pause 事件驱动 bgmSyncBtn，任何路径暂停都能自动刷新 */
    bgmFade(function () {
      return setInterval(function () {
        var v = bgm.volume - 0.03;
        if (v <= 0) {
          clearInterval(bgm._fade);
          bgm.pause();
          bgm.volume = 0;
        } else {
          bgm.volume = v;
        }
      }, 30);
    });
  }
  function bgmSyncBtn() {
    var b = document.querySelector('.music-btn');
    if (!b || !bgm) return;
    if (bgmBad) {
      // 文件缺失：隐藏整个入口
      var e = document.querySelector('.music-entry');
      if (e) e.style.display = 'none';
      return;
    }
    var on = !bgm.paused;
    b.classList.toggle('playing', on);
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? '♪ 播放中 · 点击暂停' : '♪ 播放背景音乐';
  }
  function starfieldBgm() {
    var btn = document.querySelector('.music-btn');
    if (!btn) {
      // 已离开本页（按钮随内容被换掉）：暂停音乐
      if (bgm) { if (bgm._fade) clearInterval(bgm._fade); bgm.pause(); bgm.volume = 0; }
      return;
    }
    if (!bgm) {
      bgm = new Audio(BGM_SRC);
      bgm.loop = true;
      /* 不预加载：OGG 有 1.2MB，进页就下载会拖慢加载；点播放时 play() 会自动开始取流 */
      bgm.preload = 'none';
      bgm.volume = 0;
      bgm.addEventListener('error', function () {
        bgmBad = true; // 文件缺失：不展示坏按钮
        var e = document.querySelector('.music-entry');
        if (e) e.style.display = 'none';
      });
      /* UI 跟随真实播放状态：淡出结束、浏览器打断、切页暂停等所有路径都能同步文案 */
      bgm.addEventListener('play', bgmSyncBtn);
      bgm.addEventListener('playing', bgmSyncBtn);
      bgm.addEventListener('pause', bgmSyncBtn);
    }
    if (btn.dataset.bgmBound !== '1') {
      btn.dataset.bgmBound = '1';
      btn.addEventListener('click', function () {
        if (bgm.paused) bgmPlay(); else bgmPause();
      });
      // 本会话内开过音乐 → 尝试续播（被拦则无事发生，等用户点击）
      if (sessionStorage.getItem(BGM_KEY) === 'on') bgmPlay();
    }
    bgmSyncBtn();
  }

  starfieldEnhance();
  starfieldSfx();
  starfieldBgm();
  document.addEventListener('astro:page-load', function () {
    starfieldEnhance();
    starfieldBgm();
  });
</script>
