/* scenes.example.js - worked example: Glow K-beauty announcement. Replace with this video's scenes (see SKILL.md). */
/* ===================================================================== SCENES ===================================================================== */
/* 1  hook: Korean skincare + which one? */
{ const sc = scene(.3, 3.78), xs = [40, 290, 540, 790], nm = ['lipgloss', 'compact', 'dropper', 'sheetmask'];
  const st = nm.map((n, i) => sticker(sc, n, { x: xs[i], y: 560 + (i % 2) * 40, s: 2.2, t: .5 + i * .38, rot: [-6, 5, -4, 6][i] }));
  bubble(sc, 'Korean Skincare', { x: 90, y: 940, w: 900, size: 74, t: ts('الكورية') + .1, cls: 'lat', rot: -2 });
  const q = sticker(sc, 'qmark', { x: 410, y: 270, s: 2.8, t: ts('تختار') - .1, rot: 8, snd: 'pop', v: .8 });
  st.forEach(s => shake(s, ts('تختار') + .1, 3, 8)); }
/* 2  watch this */
{ const sc = scene(3.88, 4.66);
  sticker(sc, 'play', { x: 260, y: 600, s: 5.4, t: 3.92, rot: -3, v: .7 }); sticker(sc, 'eyes', { x: 690, y: 380, s: 2.2, t: 4.15, rot: 8 }); }
/* 3  new addition at Glow */
{ const sc = scene(5.1, 8.4), tn = ts('إضافة');
  sticker(sc, 'store', { x: 110, y: 400, s: 3.6, t: 5.25, rot: -3 });
  sticker(sc, 'burst', { x: 600, y: 300, s: 3.2, t: tn - .05, rot: 8, v: .8 });
  bubble(sc, 'NEW', { x: 655, y: 400, w: 220, size: 120, t: tn + .2, cls: 'lat yel', rot: -8 });
  const card = div('', { position: 'absolute', left: '250px', top: '900px', width: '580px', padding: '30px 20px', background: '#fff', border: '6px solid ' + PLUM, borderRadius: '44px', boxShadow: '0 10px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  card.innerHTML = '<img src="../assets/logo_brand.png" style="width:100%;display:block">';
  const tg = ts('Glow', 0, 6); tl.fromTo(card, { opacity: 0, scale: .3, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: .6, ease: 'back.out(2)', immediateRender: false }, tg); cue(tg, 'thud', .7); burst(sc, 540, 1000, tg + .1, 8, 300); }
/* 4  special collection: shelf of cosmetics */
{ const sc = scene(8.5, 10.65), nm = ['lipstick', 'compact', 'perfume', 'brush', 'nailpolish'], xs = [30, 240, 450, 660, 860];
  const sh = div('', { position: 'absolute', left: '30px', top: '810px', width: '1020px', height: '36px', borderRadius: '20px', background: '#FFC4D9', border: '6px solid ' + PLUM, boxShadow: '0 8px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  tl.fromTo(sh, { opacity: 0, scaleX: .2 }, { opacity: 1, scaleX: 1, duration: .4, ease: 'back.out(1.6)', immediateRender: false }, 8.55);
  nm.forEach((n, i) => sticker(sc, n, { x: xs[i], y: 600, s: 2.0, t: 8.9 + i * .3, rot: [-5, 4, -3, 5, -4][i], wig: 2.5 }));
  const tm = ts('مميزة'); bubble(sc, '<span class="hl">مجموعة مميزة</span>', { x: 90, y: 930, w: 900, size: 82, t: tm + .1, html: true }); }
/* 5  brands: ranking cards */
{ const sc = scene(10.98, 18.6), names = ['COSRX', 'Dr. Althea', 'Axis-Y'], times = [ts('COSRX'), ts('Dr.Althea'), ts('Axis-Y')], cols = ['#FFD9E6', '#E3DBFF', '#D2F5E8'], ic = ['tube', 'dropper', 'jar'];
  names.forEach((n, i) => { const y = 400 + i * 190, c = div('card', { top: y + 'px', background: cols[i] }, sc.wrap); c.innerHTML = `<div class="no">${i + 1}</div><div class="nm">${n}</div>`;
    tl.fromTo(c, { opacity: 0, x: -700 }, { opacity: 1, x: 0, duration: .6, ease: 'back.out(1.5)', immediateRender: false }, times[i] - .1); cue(times[i] - .1, 'whoosh', .4);
    sticker(sc, ic[i], { x: 830, y: y - 12, s: 1.45, t: times[i] + .35, rot: 6 }); });
  const tm = ts('وغيرهم'), c = div('card dash', { top: (400 + 3 * 190) + 'px' }, sc.wrap); c.innerHTML = '<div class="no" style="color:#B7A6FF">+</div><div class="nm ar">وغيرهم كتير</div>';
  tl.fromTo(c, { opacity: 0, x: -700 }, { opacity: 1, x: 0, duration: .6, ease: 'back.out(1.5)', immediateRender: false }, tm - .1);
  ['heart', 'star'].forEach((n, i) => sticker(sc, n, { x: 780 + i * 110, y: 1000, s: 1.0, t: tm + .35 + i * .2, rot: 8 })); }
/* 6  skincare types, each with its own benefits */
{ const sc = scene(18.7, 20.95), cats = [['foam', 'غسول'], ['dropper', 'سيروم'], ['jar', 'مرطب'], ['sunscreen', 'واقي شمس']], xs = [50, 300, 550, 800];
  cats.forEach(([n, l], i) => { const t = 18.8 + i * .32; sticker(sc, n, { x: xs[i], y: 560, s: 2.1, t, rot: [-5, 4, -4, 5][i] }); pill(sc, l, { x: xs[i] - 15, y: 820, t: t + .3, w: 230 }); });
  const tb = ts('مميزاته') - .8; cats.forEach((_, i) => sticker(sc, 'heart', { x: xs[i] + 70, y: 400, s: .8, t: tb + i * .28, rot: 8, wig: 6 })); }
/* 7  match product -> skin */
{ const sc = scene(21.3, 24.34), tp = ts('المنتج', 0, 21.3), tm = ts('المناسب'), tS = ts('لبشرتنا');
  sticker(sc, 'bottle', { x: 70, y: 500, s: 3, t: tp - .15, rot: -4 }); pill(sc, 'المنتج', { x: 80, y: 840, t: tp + .4, w: 290 });
  sticker(sc, 'arrowR', { x: 390, y: 600, s: 2.4, t: tm, rot: 0, sparks: false });
  sticker(sc, 'face', { x: 700, y: 500, s: 3, t: tS - .1, rot: 4 }); pill(sc, 'بشرتك', { x: 710, y: 840, t: tS + .4, w: 290 });
  sticker(sc, 'check', { x: 370, y: 900, s: 3.2, t: tS + .75, rot: -6, snd: 'chime', v: .8 }); }
/* 8  not just trending / popular */
{ const sc = scene(24.5, 26.7), t1 = ts('ترند'), t2 = ts('مشهور');
  sticker(sc, 'flame', { x: 100, y: 520, s: 3, t: t1 - .6, rot: -5 }); pill(sc, 'TRENDING', { x: 80, y: 850, t: t1 - .2, w: 330 });
  sticker(sc, 'star', { x: 640, y: 520, s: 3, t: t2 - .6, rot: 5 }); pill(sc, 'POPULAR', { x: 620, y: 850, t: t2 - .2, w: 330 });
  const x1 = sticker(sc, 'cross', { x: 150, y: 560, s: 2.4, t: t1 + .25, rot: -12, snd: 'thud', v: .7, sparks: false }), x2 = sticker(sc, 'cross', { x: 690, y: 560, s: 2.4, t: t2 + .25, rot: 12, snd: 'thud', v: .7, sparks: false }); }
/* 9  more than supplying products */
{ const sc = scene(26.9, 31.95), tp = ts('توفير', 0, 28);
  bubble(sc, 'اهتمامنا', { x: 90, y: 330, w: 900, size: 92, t: ts('اهتمامنا') - .1, cls: 'pink' });
  sticker(sc, 'gift', { x: 50, y: 560, s: 3, t: tp - .1, rot: -5 });
  sticker(sc, 'plus', { x: 380, y: 680, s: 1.1, t: ts('بس', 0, 28), rot: 0, sparks: false });
  ['shield', 'star', 'chat'].forEach((n, i) => sticker(sc, n, { x: 500 + i * 190, y: 640, s: 1.55, t: 29.6 + i * .42, rot: [-5, 5, -4][i] }));
  bubble(sc, 'مش بس توفير المنتجات', { x: 70, y: 940, w: 940, size: 62, t: tp + .4, rot: 1 }); }
/* 10  authentic from trusted sources */
{ const sc = scene(32.1, 34.1), ta = ts('أصلية'), tm = ts('مصادر'), tv = ts('موثوقة');
  sticker(sc, 'shield', { x: 640, y: 400, s: 3.4, t: ta - .35, rot: 5, snd: 'chime', v: .8 });
  bubble(sc, 'منتجات <span class="hl">أصلية</span>', { x: 40, y: 540, w: 600, size: 78, t: ta, html: true });
  sticker(sc, 'factory', { x: 690, y: 900, s: 2.4, t: tm - .15, rot: 3 }); sticker(sc, 'arrowL', { x: 470, y: 960, s: 1.9, t: tm + .3, rot: 0, sparks: false });
  sticker(sc, 'store', { x: 130, y: 900, s: 2.4, t: tv - .05, rot: -3 });
  pill(sc, 'مصادر موثوقة', { x: 600, y: 1170, t: tm + .1, w: 420 }); pill(sc, 'Glow', { x: 130, y: 1170, t: tv + .3, w: 240 }); }
/* 11  quality */
{ const sc = scene(34.28, 38.32), tj = ts('جودة'), tq = ts('وتقديم');
  bubble(sc, 'جودة <span class="hl">الاختيارات</span>', { x: 60, y: 350, w: 960, size: 88, t: tj, html: true });
  [0, 1, 2, 3, 4].forEach(i => sticker(sc, 'star', { x: 70 + i * 190, y: 620, s: 1.55, t: tj + .8 + i * .28, rot: [-6, 4, -3, 5, -5][i], snd: 'sparkle', v: .45 }));
  sticker(sc, 'gift', { x: 340, y: 900, s: 2.0, t: tq - .1, rot: -4 }); sticker(sc, 'check', { x: 600, y: 940, s: 1.5, t: tq + .6, rot: 6, snd: 'chime', v: .7 });
  bubble(sc, 'تقديم المنتجات', { x: 90, y: 1160, w: 900, size: 62, t: tq + .4, rot: 1 }); }
/* 12  help */
{ const sc = scene(38.62, 43.48);
  sticker(sc, 'chat', { x: 770, y: 310, s: 2.2, t: 38.75, rot: 6 }); bubble(sc, 'حد <span class="hl">يساعدك</span>', { x: 50, y: 360, w: 690, size: 84, t: 38.9, html: true });
  const items = [['info', 'فهم المنتج', ts('فهم', 0, 39)], ['flask', 'مكوناته', ts('ومكوناته')], ['pumpb', 'استخدامه', ts('واستخدامه')]];
  items.forEach(([n, l, t], i) => { const y = 640 + i * 230;
    sticker(sc, n, { x: 800, y, s: 1.7, t: t - .2, rot: [-4, 4, -3][i] }); pill(sc, l, { x: 190, y: y + 36, t: t + .1, w: 570 });
    sticker(sc, 'check', { x: 50, y: y + 20, s: 1.2, t: t + .55, rot: 6, snd: 'chime', v: .55 }); }); }
/* 13  suits your skin? */
{ const sc = scene(43.6, 45.5);
  sticker(sc, 'bottle', { x: 70, y: 470, s: 2.7, t: ts('المنتج', 0, 43.4) - .1, rot: -4 }); sticker(sc, 'face', { x: 730, y: 470, s: 2.7, t: ts('لبشرتك') - .1, rot: 4 });
  sticker(sc, 'qmark', { x: 430, y: 470, s: 2.3, t: ts('مناسب') + .05, rot: 6, v: .8 });
  const tn = ts('ولا'); sticker(sc, 'check', { x: 300, y: 860, s: 2.2, t: tn - .05, rot: -6, snd: 'chime', v: .7 }); sticker(sc, 'cross', { x: 600, y: 860, s: 2.2, t: ts('لأ') - .05, rot: 6, snd: 'pop' }); }
/* 14  roadmap */
{ const sc = scene(46.0, 48.45), xs = [840, 600, 360, 120], y = 760, tl0 = ts('آخر');
  const rd = svg('path', { d: `M890 ${y}H70`, stroke: PLUM, 'stroke-width': 9, 'stroke-dasharray': '3 24', 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, sc.g);
  tl.set(rd, { opacity: .8 }, tl0 - .2);
  xs.forEach((x, i) => { const t = i ? tl0 + .3 + i * .22 : 46.2; const c = svg('path', { d: C(x, y, 46), fill: i ? '#fff' : PINK, stroke: PLUM, 'stroke-width': 7 }, svg('g', { transform: `translate(0,0)`, opacity: 0 }, sc.g));
    const gp = c.parentNode; tl.fromTo(gp, { opacity: 0, scale: .2, svgOrigin: `${x} ${y}` }, { opacity: 1, scale: 1, svgOrigin: `${x} ${y}`, duration: .45, ease: 'back.out(2.4)', immediateRender: false }, t); cue(t, 'pop', .5); });
  sticker(sc, 'lipstick', { x: 760, y: 480, s: 1.7, t: 46.3, rot: -6 });
  pill(sc, 'الآن', { x: 770, y: 890, t: 46.5, w: 140 });
  [1, 2, 3].forEach(i => pill(sc, 'التالي', { x: xs[i] - 90, y: 890, t: tl0 + .55 + i * .2, w: 180 }));
  sticker(sc, 'arrowUp', { x: 780, y: 1010, s: 1.6, t: ts('خطوة'), rot: 0, sparks: false }); }
/* 15  better experience: bars topped with cosmetics */
{ const sc = scene(48.52, 52.95), hs = [110, 200, 300, 410, 530], bx = [110, 300, 490, 680, 870], base = 1250, top = ['lipstick', 'compact', 'brush', 'perfume', 'heart'];
  const tb = [ts('تجربة', 0, 48) + .1, ts('أفضل') - .1, ts('يوم', 0, 49.9), ts('بعد', 0, 49.9), ts('يوم', 1, 50)];
  svg('path', { d: `M50 ${base}H1030`, stroke: PLUM, 'stroke-width': 8, 'stroke-linecap': 'round' }, sc.g);
  hs.forEach((h, i) => { const r = svg('rect', { x: bx[i] - 65, y: base, width: 130, height: 0, rx: 26, fill: ['#FFB3C6', '#FFC9A8', '#FFE08A', '#BDEBD6', '#C7B8FF'][i], stroke: PLUM, 'stroke-width': 6 }, sc.g);
    tl.fromTo(r, { attr: { y: base, height: 0 } }, { attr: { y: base - h, height: h }, duration: .55, ease: 'back.out(1.6)', immediateRender: false }, tb[i]); cue(tb[i], 'rise', .6);
    sticker(sc, top[i], { x: bx[i] - 60, y: base - h - 130, s: 1.2, t: tb[i] + .4, rot: [-6, 5, -4, 6, -5][i], wig: 4, sparks: i == 4 });
    pill(sc, 'DAY ' + (i + 1), { x: bx[i] - 75, y: base + 22, t: tb[i] + .3, w: 150, size: 38 }); });
  sticker(sc, 'arrowUp', { x: 140, y: 380, s: 3, t: tb[4] + .4, rot: 0, sparks: false });
  bubble(sc, 'خطوة بخطوة', { x: 40, y: 330, w: 520, size: 64, t: ts('خطوة', 0, 50.9), rot: -3, cls: 'pink' }); }
/* 16  trust */
{ const sc = scene(53.0, 55.32), tt = ts('ثقتكم');
  const h = sticker(sc, 'heart', { x: 290, y: 400, s: 5, t: 53.15, rot: -3, snd: 'pop', v: .8, wig: 2 });
  tl.to(h.pop, { scale: 1.08, duration: .35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 53.8);
  [[100, 420], [800, 450], [130, 760], [780, 800]].forEach(([x, y], i) => sticker(sc, i % 2 ? 'spark' : 'star', { x, y, s: 1.2, t: 53.9 + i * .18, rot: 8, wig: 6, snd: 'sparkle', v: .4 }));
  bubble(sc, '<span class="hl">ثقتكم</span>', { x: 90, y: 1030, w: 900, size: 130, t: tt - .1, html: true, rot: -2 }); cue(tt + .4, 'chime', .8); }

finish({ duration: 57.0, outroAt: 55.38 });
