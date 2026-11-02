/* scenes.js - PanOxyl acne-wash explainer (voice only, /glow sticker-pop style). Every sticker pops on the word he says: ts('word'). */
const vanish = (st, t) => tl.to(st.pop, { scale: 0, opacity: 0, duration: .3, ease: 'back.in(2)' }, t);

/* 1  acne + tried several washes + problem continues */
{ const sc = scene(.05, 3.45);
  const face = sticker(sc, 'faceacne', { x: 340, y: 400, s: 3.4, t: .25, rot: -3, v: .7 });
  [['pumpb', 60, 720, 1.4], ['foam', 790, 700, 1.7], ['tube', 430, 930, 2.0]].forEach(([n, x, y, t], i) => sticker(sc, n, { x, y, s: 1.9, t, rot: [-6, 6, -3][i] }));
  sticker(sc, 'refresh', { x: 760, y: 330, s: 1.7, t: ts('ولسه'), rot: 8, sparks: false });
  sticker(sc, 'qmark', { x: 130, y: 330, s: 1.9, t: ts('مستمرة'), rot: -8, v: .8 }); shake(face, ts('المشكلة'), 3, 6); }
/* 2  let me tell you the difference */
{ const sc = scene(3.55, 6.55);
  sticker(sc, 'bottle', { x: 80, y: 500, s: 3.0, t: 3.75, rot: -5 }); sticker(sc, 'washbottle', { x: 650, y: 480, s: 3.0, t: 4.2, rot: 5 });
  bubble(sc, '≠', { x: 340, y: 560, w: 400, size: 150, t: ts('الفرق') - .1, cls: 'lat pink', rot: -6 });
  sticker(sc, 'eyes', { x: 400, y: 250, s: 2.4, t: ts('واخد'), rot: 6 }); }
/* 3  PanOxyl Acne Wash */
{ const sc = scene(6.95, 8.85);
  sticker(sc, 'washbottle', { x: 300, y: 380, s: 4.4, t: ts('معانا'), rot: -3, v: .8 });
  sticker(sc, 'bubbles', { x: 70, y: 450, s: 2.0, t: 8.0, rot: -8 }); sticker(sc, 'bubbles', { x: 790, y: 520, s: 1.7, t: 8.2, rot: 8 });
  bubble(sc, 'PanOxyl Acne Wash', { x: 40, y: 1040, w: 1000, size: 90, t: ts('PanOxyl'), cls: 'lat yel', rot: -2 }); }
/* 4  contains Benzoyl Peroxide */
{ const sc = scene(8.75, 11.3);
  sticker(sc, 'washbottle', { x: 60, y: 480, s: 2.7, t: 8.9, rot: -4 });
  sticker(sc, 'arrowR', { x: 390, y: 560, s: 1.9, t: ts('بيحتوي'), sparks: false });
  sticker(sc, 'molecule', { x: 620, y: 420, s: 3.2, t: ts('Benzoyl') - .15, rot: 6, v: .8 });
  bubble(sc, 'Benzoyl Peroxide', { x: 40, y: 940, w: 1000, size: 90, t: ts('Benzoyl'), cls: 'lat pink', rot: -2 }); }
/* 5  an active ingredient with an important role in treating acne */
{ const sc = scene(11.2, 14.85);
  sticker(sc, 'molecule', { x: 50, y: 420, s: 3.2, t: 11.3, rot: -5 }); sticker(sc, 'spark', { x: 440, y: 400, s: 1.0, t: 11.8, rot: 8, sparks: false });
  bubble(sc, 'مادة <span class="hl">فعالة</span>', { x: 40, y: 880, w: 560, size: 66, t: ts('فعالة'), html: true });
  sticker(sc, 'faceacne', { x: 610, y: 400, s: 3.2, t: ts('علاج') - .1, rot: 5 });
  sticker(sc, 'check', { x: 470, y: 760, s: 1.6, t: ts('الشباب', 0, 13) + .1, rot: -6, snd: 'chime', v: .7 });
  bubble(sc, 'علاج <span class="hl">حب الشباب</span>', { x: 40, y: 1080, w: 1000, size: 82, t: ts('حب', 0, 13) - .1, html: true }); }
/* 6  helps reduce the bacteria linked to acne */
{ const sc = scene(15.0, 18.95);
  sticker(sc, 'molecule', { x: 40, y: 440, s: 3.0, t: ts('بتساعد'), rot: -5 });
  const g = [[560, 380, 1.9], [780, 520, 1.5], [600, 640, 1.6]].map(([x, y, s], i) => sticker(sc, 'germ', { x, y, s, t: ts('البكتيريا') + i * .18, rot: [-6, 6, -4][i] }));
  bubble(sc, '<span class="hl">تقليل</span> البكتيريا', { x: 40, y: 1000, w: 1000, size: 76, t: ts('تقليل'), html: true });
  vanish(g[1], ts('المرتبطة') + .35); vanish(g[2], ts('المرتبطة') + .65);
  sticker(sc, 'pimple', { x: 800, y: 330, s: 1.5, t: ts('بظهور'), rot: 8 }); }
/* 7  especially inflamed pimples */
{ const sc = scene(18.85, 21.35);
  [[40, 440, 2.6], [380, 380, 2.8], [730, 450, 2.4]].forEach(([x, y, s], i) => sticker(sc, 'pimple', { x, y, s, t: ts('الحبوب', 0, 19) + i * .3, rot: [-6, 5, -4][i], wig: 5 }));
  bubble(sc, 'الحبوب <span class="hl">الملتهبة</span>', { x: 40, y: 960, w: 1000, size: 84, t: ts('الملتهبة') - .1, html: true }); }
/* 8  active ingredient does not mean random use */
{ const sc = scene(21.4, 24.65);
  sticker(sc, 'molecule', { x: 50, y: 430, s: 3.0, t: 21.6, rot: -5 });
  sticker(sc, 'dice', { x: 620, y: 430, s: 3.0, t: ts('بشكل'), rot: 8, wig: 6 });
  sticker(sc, 'cross', { x: 640, y: 450, s: 2.6, t: ts('عشوائي') - .05, rot: -10, snd: 'thud', v: .7, sparks: false });
  bubble(sc, 'بشكل <span class="hl">عشوائي</span>', { x: 40, y: 940, w: 1000, size: 80, t: ts('عشوائي'), html: true }); }
/* 9  may cause irritation or dryness, especially sensitive skin */
{ const sc = scene(24.7, 29.05);
  sticker(sc, 'redface', { x: 40, y: 430, s: 2.7, t: ts('تهيج') - .1, rot: -5 }); pill(sc, 'تهيج', { x: 70, y: 790, t: ts('تهيج') + .2, w: 230 });
  sticker(sc, 'cactus', { x: 410, y: 420, s: 2.5, t: ts('جفاف') - .1, rot: 4 }); pill(sc, 'جفاف', { x: 430, y: 790, t: ts('جفاف') + .2, w: 230 });
  sticker(sc, 'dryface', { x: 740, y: 440, s: 2.4, t: ts('للبشرة') - .05, rot: 6 });
  sticker(sc, 'warning', { x: 400, y: 900, s: 1.9, t: ts('بشرتك') - .1, rot: -4, v: .7 }); bubble(sc, '<span class="hl">حساسة</span>', { x: 40, y: 1180, w: 1000, size: 82, t: ts('حساسة') - .05, html: true }); }
/* 10  right concentration, right usage, right moisturizer */
{ const sc = scene(29.0, 34.55);
  sticker(sc, 'magnifier', { x: 720, y: 150, s: 1.9, t: 29.1, rot: 8 }); bubble(sc, 'لازم <span class="hl">نختار</span>', { x: 40, y: 190, w: 620, size: 74, t: ts('لازم') - .05, html: true });
  const rows = [['percent', 'التركيز المناسب', ts('التركيز')], ['clock', 'طريقة الاستخدام', ts('الاستخدام')], ['jar', 'مرطب مناسب', ts('مرطب')]];
  rows.forEach(([n, l, t], i) => { const y = 400 + i * 260;
    sticker(sc, n, { x: 790, y, s: 1.8, t: t - .2, rot: [-4, 4, -3][i] }); pill(sc, l, { x: 170, y: y + 52, t: t + .05, w: 580 });
    sticker(sc, 'check', { x: 40, y: y + 30, s: 1.2, t: t + .55, rot: 6, snd: 'chime', v: .55 }); }); }
/* 11  not all acne has the same cause, not every case the same product */
{ const sc = scene(34.9, 40.15);
  [['faceacne', 40, 2.3], ['pimple', 380, 2.2], ['redface', 720, 2.3]].forEach(([n, x, s], i) => sticker(sc, n, { x, y: 300, s, t: ts('كل') + .2 + i * .42, rot: [-5, 5, -4][i] }));
  sticker(sc, 'qmark', { x: 900, y: 160, s: 1.4, t: ts('السبب'), rot: 8 });
  bubble(sc, '≠', { x: 330, y: 650, w: 420, size: 140, t: ts('ومش'), cls: 'lat pink', rot: -6 });
  [['bottle', 60], ['pumpb', 380], ['tube', 700]].forEach(([n, x], i) => sticker(sc, n, { x, y: 820, s: 2.0, t: ts('الحالات') + i * .4, rot: [-5, 4, -4][i] })); }
/* 12  severe acne or scars -> see a dermatologist */
{ const sc = scene(40.1, 44.25);
  sticker(sc, 'pimple', { x: 40, y: 330, s: 3.0, t: ts('شديدة') - .1, rot: -4 }); sticker(sc, 'bandage', { x: 560, y: 400, s: 2.5, t: ts('ندبات') - .1, rot: -12 });
  sticker(sc, 'stethoscope', { x: 330, y: 760, s: 2.9, t: ts('تستشير'), rot: 4 });
  sticker(sc, 'check', { x: 700, y: 840, s: 1.5, t: ts('جلدية') + .1, rot: 6, snd: 'chime', v: .7 });
  bubble(sc, '<span class="hl">طبيب جلدية</span>', { x: 40, y: 1130, w: 1000, size: 84, t: ts('طبيب') - .05, html: true }); }
/* 13  at Glow Cosmetics Store: not just a product */
{ const sc = scene(44.3, 48.7);
  sticker(sc, 'store', { x: 110, y: 390, s: 3.6, t: ts('إحنا') + .1, rot: -3 });
  sticker(sc, 'spark', { x: 640, y: 300, s: 1.7, t: ts('Glow') - .05, rot: 8, v: .6, sparks: false }); sticker(sc, 'heart', { x: 790, y: 560, s: 1.2, t: ts('Glow') + .1, rot: 8, wig: 6 });
  const card = div('', { position: 'absolute', left: '250px', top: '890px', width: '580px', padding: '30px 20px', background: '#fff', border: '6px solid ' + PLUM, borderRadius: '44px', boxShadow: '0 10px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  card.innerHTML = '<img src="../assets/logo_brand.png" style="width:100%;display:block">';
  const tg = ts('Glow'); tl.fromTo(card, { opacity: 0, scale: .3, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: .6, ease: 'back.out(2)', immediateRender: false }, tg); cue(tg, 'thud', .7); burst(sc, 540, 990, tg + .1, 8, 300);
  bubble(sc, 'مش مجرد <span class="hl">منتج</span>', { x: 40, y: 1200, w: 1000, size: 76, t: ts('مجرد') - .05, html: true }); }
/* 14  recommendations built on a scientific basis */
{ const sc = scene(48.75, 51.0);
  sticker(sc, 'clipboard', { x: 70, y: 400, s: 3.2, t: ts('ترشيحات'), rot: -5 });
  sticker(sc, 'microscope', { x: 610, y: 400, s: 3.2, t: ts('أساس') - .05, rot: 5 });
  sticker(sc, 'check', { x: 430, y: 760, s: 1.5, t: ts('علمي') - .05, rot: -6, snd: 'chime', v: .8 });
  bubble(sc, '<span class="hl">أساس علمي</span>', { x: 40, y: 1030, w: 1000, size: 90, t: ts('أساس') - .05, html: true }); }

finish({ duration: 52.8, outroAt: 51.05 });
