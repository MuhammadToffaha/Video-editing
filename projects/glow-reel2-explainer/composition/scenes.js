/* Glow offer explainer (Egyptian Arabic): buy 2 get the 3rd free, 10-30 Nov. Voice only, sticker-pop look. */
const logoCard = (sc, t, top, w = 600) => {
  const card = div('', { position: 'absolute', left: (1080 - w) / 2 + 'px', top: top + 'px', width: w + 'px', padding: '30px 20px', background: '#fff', border: '6px solid ' + PLUM, borderRadius: '44px', boxShadow: '0 10px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  card.innerHTML = '<img src="../assets/logo_brand.png" style="width:100%;display:block">';
  tl.fromTo(card, { opacity: 0, scale: .3, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: .6, ease: 'back.out(2)', immediateRender: false }, t); cue(t, 'thud', .7); burst(sc, 540, top + 110, t + .1, 8, 300);
};
/* 1  buy 2, get the 3rd free */
{ const sc = scene(.3, 2.34);
  const g = sticker(sc, 'gift', { x: 300, y: 380, s: 4.6, t: .45, rot: -4, v: .8 });
  sticker(sc, 'bottle', { x: 60, y: 560, s: 2.4, t: ts('قطعتين'), rot: -8 }); sticker(sc, 'tube', { x: 780, y: 560, s: 2.4, t: ts('قطعتين') + .2, rot: 8 });
  bubble(sc, 'FREE', { x: 290, y: 1000, w: 500, size: 140, t: ts('فري') - .05, cls: 'lat yel', rot: -4 }); burst(sc, 540, 560, ts('فري'), 8, 300); }
/* 2  Africana at Glow Cosmetics Store */
{ const sc = scene(2.42, 5.36);
  sticker(sc, 'store', { x: 140, y: 300, s: 3.4, t: 2.55, rot: -3 });
  bubble(sc, 'Africana', { x: 90, y: 760, w: 900, size: 110, t: ts('أفريكانا') - .05, cls: 'lat pink', rot: -2 });
  logoCard(sc, ts('جلوكوزمتكس') - .05, 980, 560); }
/* 3  hair care + skin care */
{ const sc = scene(5.46, 8.95), th = ts('بالشعر'), tb = ts('بالبشرة');
  sticker(sc, 'brush', { x: 60, y: 420, s: 3.6, t: th - .1, rot: -6 }); sticker(sc, 'face', { x: 600, y: 420, s: 3.6, t: tb - .1, rot: 6 });
  bubble(sc, 'بالشعر', { x: 60, y: 900, w: 440, size: 84, t: th, rot: -3 }); bubble(sc, 'بالبشرة', { x: 580, y: 900, w: 440, size: 84, t: tb, cls: 'pink', rot: 3 }); }
/* 4  the November offer */
{ const sc = scene(9.06, 12.5), t = ts('عرض', 0, 9);
  sticker(sc, 'calendar', { x: 160, y: 330, s: 4, t: 9.25, rot: -4 }); sticker(sc, 'burst', { x: 620, y: 300, s: 3.2, t: t, rot: 8, v: .8 });
  bubble(sc, '<span class="hl">عرض</span> نوفمبر', { x: 90, y: 940, w: 900, size: 110, t: t + .05, html: true, rot: -2 }); }
/* 5  buy 2 + the third free */
{ const sc = scene(12.56, 16.42), t2 = ts('قطعتين', 0, 12.5), t3 = ts('التالتة', 0, 12.5);
  sticker(sc, 'bottle', { x: 40, y: 480, s: 2.3, t: t2, rot: -6 }); sticker(sc, 'plus', { x: 290, y: 560, s: 1.4, t: t2 + .2, sparks: false });
  sticker(sc, 'tube', { x: 450, y: 480, s: 2.3, t: t2 + .3, rot: 5 }); sticker(sc, 'arrowR', { x: 690, y: 560, s: 1.4, t: t3 - .2, sparks: false });
  sticker(sc, 'gift', { x: 790, y: 470, s: 2.3, t: t3, rot: 6 });
  bubble(sc, '<span class="hl">قطعتين</span>', { x: 40, y: 900, w: 480, size: 84, t: t2 + .1, html: true, rot: -3 });
  bubble(sc, 'التالتة فري', { x: 540, y: 900, w: 500, size: 84, t: t3, cls: 'pink', rot: 3 }); }
/* 6  pick what your hair or skin needs */
{ const sc = scene(16.46, 20.26), xs = [40, 290, 540, 790], nm = ['bottle', 'dropper', 'tube', 'jar'];
  const tt = [ts('المنتجات'), ts('لشعرك'), ts('لشعرك') + .25, ts('بشرتك')];
  nm.forEach((n, i) => { sticker(sc, n, { x: xs[i], y: 520, s: 2.2, t: 16.6 + i * .2, rot: [-6, 5, -4, 6][i] }); sticker(sc, 'check', { x: xs[i] + 40, y: 800, s: 1.2, t: tt[i] + .1, rot: 0, sparks: false }); });
  bubble(sc, 'لشعرك أو بشرتك', { x: 60, y: 1000, w: 960, size: 84, t: ts('لشعرك'), cls: 'pink', rot: -2 }); }
/* 7  an extra product, without paying its price */
{ const sc = scene(20.66, 24.4), t = ts('إضافي');
  sticker(sc, 'gift', { x: 120, y: 360, s: 3.6, t: 20.8, rot: -4 }); sticker(sc, 'plus', { x: 640, y: 420, s: 2.6, t: t - .1, rot: 6 });
  bubble(sc, 'منتج <span class="hl">إضافي</span>', { x: 60, y: 880, w: 960, size: 100, t: t, html: true, rot: -2 });
  bubble(sc, 'بدون ما تدفع تمنه', { x: 120, y: 1060, w: 840, size: 70, t: ts('بدون'), cls: 'pink', rot: 2 }); }
/* 8  an exclusive opportunity */
{ const sc = scene(24.52, 27.66), t = ts('حصرية');
  sticker(sc, 'shield', { x: 300, y: 340, s: 4.4, t: 24.65, rot: -3, v: .8 }); [[100, 420], [800, 450], [130, 780]].forEach(([x, y], i) => sticker(sc, i % 2 ? 'spark' : 'star', { x, y, s: 1.2, t: t + .2 + i * .15, rot: 8, wig: 6, snd: 'sparkle', v: .4 }));
  bubble(sc, 'فرصة <span class="hl">حصرية</span>', { x: 60, y: 980, w: 960, size: 110, t: t, html: true, rot: -2 }); }
/* 9  where to find it */
{ const sc = scene(27.72, 30.7);
  sticker(sc, 'store', { x: 130, y: 300, s: 3.4, t: 27.85, rot: -3 }); sticker(sc, 'magnifier', { x: 640, y: 380, s: 3, t: ts('هتلاقيه') - .3, rot: 8 });
  bubble(sc, 'Glow Cosmetics Store', { x: 60, y: 880, w: 960, size: 84, t: 27.95, cls: 'lat', rot: -2 }); }
/* 10  10 -> 30 November */
{ const sc = scene(31.32, 34.36), t1 = ts('10'), t2 = ts('30');
  sticker(sc, 'calendar', { x: 340, y: 280, s: 3.4, t: 31.45, rot: -3 });
  bubble(sc, '10 نوفمبر', { x: 60, y: 800, w: 470, size: 74, t: t1, rot: -3 }); sticker(sc, 'arrowR', { x: 460, y: 1000, s: 1.2, t: t1 + .5, sparks: false });
  bubble(sc, '30 نوفمبر', { x: 550, y: 800, w: 470, size: 74, t: t2, cls: 'pink', rot: 3 }); }
/* 11  we choose the best for you */
{ const sc = scene(34.52, 39.5), tt = ts('الأفضل');
  const h = sticker(sc, 'heart', { x: 290, y: 330, s: 5, t: 34.7, rot: -3, v: .8, wig: 2 });
  tl.to(h.pop, { scale: 1.08, duration: .35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 35.4);
  [[100, 380], [800, 420], [130, 760], [780, 800]].forEach(([x, y], i) => sticker(sc, i % 2 ? 'spark' : 'star', { x, y, s: 1.2, t: 35.6 + i * .18, rot: 8, wig: 6, snd: 'sparkle', v: .4 }));
  bubble(sc, '<span class="hl">الأفضل</span>', { x: 90, y: 980, w: 900, size: 130, t: tt - .1, html: true, rot: -2 }); cue(tt + .3, 'chime', .8); }
finish({ duration: 42.2, outroAt: 40.2 });
