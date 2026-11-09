/* scenes.js - FOOTAGE mode demo (uncut single take -> auto jump-cuts + punch-ins + Glow stickers). Stickers live in the clear area above the speaker (scene y 80-560 -> card y ~220-700). */
const vanish = (st, t) => tl.to(st.pop, { scale: 0, opacity: 0, duration: .3, ease: 'back.in(2)' }, t);
const row = (sc, names, xs, y, s, t0, dt, rots = [-6, 5, -4, 6, -5]) => names.map((n, i) => sticker(sc, n, { x: xs[i], y, s, t: t0 + i * dt, rot: rots[i % rots.length], wig: 2.5 }));

/* hook: Korean skincare ... can't choose */
{ const sc = scene(.3, 3.7);
  row(sc, ['lipgloss', 'compact', 'dropper', 'sheetmask'], [60, 300, 540, 780], 110, 1.45, .5, .35);
  bubble(sc, 'Korean Skincare', { x: 90, y: 390, w: 900, size: 62, t: ts('الكورية'), cls: 'lat', rot: -2 });
  const q = sticker(sc, 'qmark', { x: 430, y: 60, s: 1.5, t: ts('تختار') - .1, rot: 8, v: .8 }); }
/* watch this video */
{ const sc = scene(3.75, 5.6); sticker(sc, 'play', { x: 380, y: 110, s: 1.9, t: 3.8, rot: -3 }); sticker(sc, 'eyes', { x: 640, y: 90, s: 1.4, t: 4.1, rot: 8 }); }
/* new addition at Glow Cosmetics Store */
{ const sc = scene(5.9, 8.1);
  sticker(sc, 'store', { x: 60, y: 90, s: 1.9, t: ts('إضافة') - .1, rot: -3 });
  const card = div('', { position: 'absolute', left: '470px', top: '170px', width: '520px', padding: '24px 18px', background: '#fff', border: '6px solid ' + PLUM, borderRadius: '40px', boxShadow: '0 9px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  card.innerHTML = '<img src="../assets/logo_brand.png" style="width:100%;display:block">';
  const tg = ts('Glow', 0, 6); tl.fromTo(card, { opacity: 0, scale: .3, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: .6, ease: 'back.out(2)', immediateRender: false }, tg); cue(tg, 'thud', .7); burst(sc, 730, 230, tg + .1, 8, 230); }
/* special collection of Korean skincare */
{ const sc = scene(8.1, 10.95);
  row(sc, ['lipstick', 'compact', 'perfume', 'brush', 'nailpolish'], [40, 240, 440, 640, 850], 110, 1.15, 8.3, .3);
  bubble(sc, '<span class="hl">مجموعة مميزة</span>', { x: 90, y: 340, w: 900, size: 62, t: ts('مميزة') - .1, html: true }); }
/* brands */
{ const sc = scene(12.7, 16.4), nm = ['COSRX', 'Dr. Althea', 'Axis-Y'], tt = [ts('COSRX'), ts('Dr.Althea'), ts('Axis-Y')], ic = ['tube', 'dropper', 'jar'];
  nm.forEach((n, i) => { bubble(sc, n, { x: 40, y: 80 + i * 150, w: 560, size: 66, t: tt[i], cls: 'lat ' + ['pink', 'yel', ''][i], rot: -3 + i * 2 }); sticker(sc, ic[i], { x: 680, y: 70 + i * 150, s: 1.15, t: tt[i] + .3, rot: 6 }); }); }
/* many more, each product has its benefits */
{ const sc = scene(16.3, 20.5);
  row(sc, ['foam', 'dropper', 'jar', 'sunscreen'], [60, 300, 540, 780], 110, 1.4, ts('بالبشرة') - .2, .32);
  bubble(sc, 'وكل منتج <span class="hl">مميزاته</span>', { x: 60, y: 390, w: 960, size: 58, t: ts('مميزاته') - .3, html: true }); }
/* the key: choose the right product for our skin */
{ const sc = scene(20.6, 23.6);
  bubble(sc, '<span class="hl">الأهم</span>', { x: 40, y: 60, w: 400, size: 70, t: ts('الأهم'), html: true });
  sticker(sc, 'bottle', { x: 90, y: 180, s: 1.6, t: ts('المنتج', 0, 21.5) - .1, rot: -4 }); sticker(sc, 'arrowR', { x: 330, y: 230, s: 1.2, t: ts('المناسب'), sparks: false });
  sticker(sc, 'face', { x: 560, y: 160, s: 1.7, t: ts('لبشرتنا') - .1, rot: 4 }); sticker(sc, 'check', { x: 830, y: 190, s: 1.1, t: ts('لبشرتنا') + .5, rot: -6, snd: 'chime', v: .7 }); }
/* not just because it's trending or popular */
{ const sc = scene(23.75, 26.0), t1 = ts('ترند'), t2 = ts('مشهور');
  sticker(sc, 'flame', { x: 130, y: 120, s: 1.7, t: t1 - .5, rot: -5 }); sticker(sc, 'cross', { x: 160, y: 140, s: 1.3, t: t1 + .2, rot: -10, snd: 'thud', v: .6, sparks: false });
  sticker(sc, 'star', { x: 640, y: 120, s: 1.7, t: t2 - .5, rot: 5 }); sticker(sc, 'cross', { x: 670, y: 140, s: 1.3, t: t2 + .2, rot: 10, snd: 'thud', v: .6, sparks: false }); }
/* more than supplying products */
{ const sc = scene(26.1, 29.9);
  sticker(sc, 'gift', { x: 120, y: 100, s: 1.7, t: ts('توفير', 0, 28) - .2, rot: -5 });
  bubble(sc, 'مش بس توفير المنتجات', { x: 380, y: 150, w: 640, size: 50, t: ts('بس', 0, 28), rot: 2 }); }
/* authentic from trusted sources */
{ const sc = scene(30.0, 33.5), ta = ts('أصلية');
  sticker(sc, 'shield', { x: 640, y: 80, s: 1.8, t: ta - .3, rot: 5, snd: 'chime', v: .8 }); bubble(sc, 'منتجات <span class="hl">أصلية</span>', { x: 40, y: 130, w: 580, size: 64, t: ta, html: true });
  sticker(sc, 'factory', { x: 330, y: 330, s: 1.2, t: ts('مصادر') - .1, rot: 3 }); sticker(sc, 'arrowR', { x: 520, y: 360, s: .9, t: ts('موثوقة') - .1, sparks: false }); sticker(sc, 'store', { x: 640, y: 330, s: 1.2, t: ts('موثوقة'), rot: -3 }); }
/* quality */
{ const sc = scene(33.55, 37.7), tj = ts('جودة');
  bubble(sc, 'جودة <span class="hl">الاختيارات</span>', { x: 60, y: 70, w: 960, size: 64, t: tj, html: true });
  [0, 1, 2, 3, 4].forEach(i => sticker(sc, 'star', { x: 70 + i * 190, y: 230, s: 1.1, t: tj + .7 + i * .26, rot: [-6, 4, -3, 5, -5][i], snd: 'sparkle', v: .4 })); }
/* someone helps: product, ingredients, usage */
{ const sc = scene(37.8, 42.7), items = [['info', ts('فهم', 0, 39)], ['flask', ts('ومكوناته')], ['pumpb', ts('واستخدامه')]];
  sticker(sc, 'chat', { x: 780, y: 70, s: 1.4, t: 38.2, rot: 6 }); bubble(sc, 'حد <span class="hl">يساعدك</span>', { x: 40, y: 80, w: 700, size: 66, t: ts('يساعدك') - .1, html: true });
  items.forEach(([n, t], i) => { sticker(sc, n, { x: 80 + i * 300, y: 300, s: 1.25, t: t - .1, rot: [-4, 4, -3][i] }); sticker(sc, 'check', { x: 230 + i * 300, y: 330, s: .8, t: t + .5, rot: 6, snd: 'chime', v: .5 }); }); }
/* suits your skin? */
{ const sc = scene(42.75, 44.9);
  sticker(sc, 'bottle', { x: 120, y: 120, s: 1.5, t: 42.9, rot: -4 }); sticker(sc, 'qmark', { x: 420, y: 100, s: 1.4, t: ts('مناسب') - .05, rot: 6 }); sticker(sc, 'face', { x: 650, y: 120, s: 1.5, t: ts('لبشرتك') - .1, rot: 4 });
  sticker(sc, 'check', { x: 330, y: 360, s: 1.0, t: ts('ولا'), rot: -6, snd: 'chime', v: .6 }); sticker(sc, 'cross', { x: 560, y: 360, s: 1.0, t: ts('لأ') - .05, rot: 6 }); }
/* not the last addition, just a step */
{ const sc = scene(45.0, 49.5);
  bubble(sc, 'مجرد <span class="hl">خطوة</span>', { x: 40, y: 70, w: 560, size: 66, t: ts('خطوة') - .1, html: true });
  sticker(sc, 'lipstick', { x: 680, y: 80, s: 1.5, t: 45.2, rot: -6 }); sticker(sc, 'arrowUp', { x: 820, y: 130, s: 1.3, t: ts('خطوة'), sparks: false });
  sticker(sc, 'heart', { x: 200, y: 300, s: 1.0, t: ts('أفضل') - .1, rot: 8, wig: 6 }); }
/* trust */
{ const sc = scene(49.6, 54.3), tt = ts('ثقتكم');
  const h = sticker(sc, 'heart', { x: 380, y: 60, s: 2.1, t: ts('هدفها') - .2, rot: -3, v: .8, wig: 2 });
  tl.to(h.pop, { scale: 1.07, duration: .35, yoyo: true, repeat: 4, ease: 'sine.inOut' }, tt);
  [[110, 140], [830, 160]].forEach(([x, y], i) => sticker(sc, i ? 'spark' : 'star', { x, y, s: 1.1, t: tt + i * .2, rot: 8, wig: 6, snd: 'sparkle', v: .4 }));
  bubble(sc, '<span class="hl">ثقتكم</span>', { x: 90, y: 360, w: 900, size: 84, t: tt - .1, html: true }); }

finish({ duration: 56.1, outroAt: 54.8, footage: true });
