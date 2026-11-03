/* Dermaten November offer - Glow sticker-pop explainer (voice only). */
/* 1 hook */
{ const sc = scene(.45, 2.8), ts_ = ts('سيروم');
  sticker(sc, 'eyes', { x: 90, y: 420, s: 2.4, t: .6, rot: -6 });
  sticker(sc, 'dropper', { x: 500, y: 380, s: 3.6, t: ts('تشتري') - .1, rot: 5 });
  bubble(sc, 'Dermaten', { x: 90, y: 940, w: 900, size: 110, t: ts('Dermaten') - .05, cls: 'lat', rot: -2 }); burst(sc, 640, 520, ts_ + .1, 8, 260); }
/* 2 full range + azelaic */
{ const sc = scene(3.05, 7.42), nm = ['bottle', 'tube', 'jar', 'dropper'], xs = [40, 290, 540, 790];
  bubble(sc, 'Dermaten', { x: 90, y: 280, w: 900, size: 96, t: 3.2, cls: 'lat', rot: -2 });
  nm.forEach((n, i) => sticker(sc, n, { x: xs[i], y: 560, s: 2.1, t: ts('أنواع') - .2 + i * .22, rot: [-5, 4, -4, 5][i] }));
  bubble(sc, 'Azelaic Acid', { x: 90, y: 900, w: 900, size: 92, t: ts('Azelaic') , cls: 'lat yel', rot: 2 }); sticker(sc, 'flask', { x: 790, y: 1020, s: 1.6, t: ts('Azelaic') + .3, rot: 6 }); }
/* 3 peptides + availability */
{ const sc = scene(7.46, 10.0), tp = ts('Peptides'), tg = ts('Glow', 0, 8);
  sticker(sc, 'molecule', { x: 80, y: 330, s: 2.8, t: tp - .1, rot: -4 });
  bubble(sc, 'Peptides', { x: 40, y: 700, w: 540, size: 84, t: tp + .1, cls: 'lat pink', rot: -2 });
  sticker(sc, 'store', { x: 620, y: 330, s: 2.8, t: ts('متوفرين') - .05, rot: 4 });
  const card = div('', { position: 'absolute', left: '250px', top: '960px', width: '580px', padding: '30px 20px', background: '#fff', border: '6px solid ' + PLUM, borderRadius: '44px', boxShadow: '0 10px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  card.innerHTML = '<img src="../assets/logo_brand.png" style="width:100%;display:block">';
  tl.fromTo(card, { opacity: 0, scale: .3, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: .6, ease: 'back.out(2)', immediateRender: false }, tg); cue(tg, 'thud', .7); burst(sc, 540, 1060, tg + .1, 8, 300); }
/* 4 whatever your skin needs */
{ const sc = scene(9.98, 11.5);
  sticker(sc, 'face', { x: 300, y: 330, s: 4.2, t: 10.05, rot: -3 });
  bubble(sc, 'احتياج <span class="hl">بشرتك</span>', { x: 90, y: 940, w: 900, size: 92, t: ts('احتياج') + .05, html: true }); }
/* 5 concerns */
{ const sc = scene(11.68, 17.05), items = [['drop', 'الترطيب', 'الترطيب'], ['pimple', 'الحبوب', 'بالحبوب'], ['magnifier', 'المسام', 'والمسام'], ['eyes', 'العين', 'العين'], ['clock', 'الخطوط', 'والخطوط'], ['calendar', 'التجاعد', 'والتجاعد'], ['spark', 'التفتيح', 'والتفتيح']];
  items.forEach(([n, l, w], i) => { const r = i < 4 ? 0 : 1, col = i < 4 ? i : i - 4, x = r ? [165, 415, 665][col] : [40, 290, 540, 790][col], y = 330 + r * 400, t = ts(w);
    sticker(sc, n, { x, y, s: 2.0, t: t - .05, rot: [-5, 4, -4, 5][i % 4] }); pill(sc, l, { x: x - 15, y: y + 250, t: t + .12, w: 230 }); }); }
/* 6 options + suits */
{ const sc = scene(17.18, 20.5), nm = ['bottle', 'tube', 'jar', 'dropper'], xs = [40, 290, 540, 790], tm = ts('يناسب');
  nm.forEach((n, i) => sticker(sc, n, { x: xs[i], y: 380, s: 2.1, t: 17.25 + i * .22, rot: [-5, 4, -4, 5][i] }));
  bubble(sc, 'اختيارات <span class="hl">كثيرة</span>', { x: 90, y: 700, w: 900, size: 76, t: ts('كثيرة') - .1, html: true, rot: -1 });
  sticker(sc, 'check', { x: 150, y: 930, s: 2.6, t: tm + .05, rot: -6, snd: 'chime', v: .8 });
  bubble(sc, 'يناسب بشرتك', { x: 440, y: 960, w: 580, size: 66, t: tm + .15, cls: 'pink', rot: 1 }); }
/* 7 surprise */
{ const sc = scene(20.65, 22.18), t = ts('المفاجأة');
  sticker(sc, 'burst', { x: 300, y: 330, s: 4.0, t: t - .05, rot: 8, v: .8 });
  bubble(sc, '<span class="hl">المفاجأة</span> لسه جاية', { x: 60, y: 940, w: 960, size: 78, t: t + .1, html: true, rot: -2 }); }
/* 8 price */
{ const sc = scene(22.28, 27.55), t2 = ts('200'), t3 = ts('300');
  sticker(sc, 'gift', { x: 340, y: 230, s: 3.2, t: 22.35, rot: -4 });
  bubble(sc, '200', { x: 50, y: 700, w: 470, size: 170, t: t2 - .05, cls: 'lat yel', rot: -4 });
  bubble(sc, '300', { x: 560, y: 720, w: 470, size: 130, t: ts('بدلا') + .02, cls: 'lat', rot: 3 });
  const x = sticker(sc, 'cross', { x: 650, y: 700, s: 3.0, t: t3 + .05, rot: 8, snd: 'thud', v: .7, sparks: false });
  pill(sc, 'LIMITED TIME', { x: 280, y: 1000, t: ts('لفترة'), w: 520 });
  sticker(sc, 'calendar', { x: 120, y: 1100, s: 1.5, t: ts('نوفمبر') - .1, rot: -5 }); bubble(sc, 'NOVEMBER', { x: 340, y: 1120, w: 650, size: 92, t: ts('نوفمبر') + .05, cls: 'lat pink', rot: 2 }); }

finish({ duration: 30.0, outroAt: 27.7 });
