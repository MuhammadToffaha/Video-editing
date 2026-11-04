/* Blankie x Glow offer - animated sticker-pop over the real product photo; his original voice. */
/* ---- photo camera: slow Ken-Burns pans along the product line, whip to each product on its word ---- */
const IMG = document.querySelector('#photo img'); gsap.set(IMG, { transformOrigin: '0 0' });
const view = (t, c, z, d = .7, ease = 'power3.inOut') => tl.to(IMG, { x: Math.min(0, Math.max(1080 - 2399 * z, 540 - c * z)), y: 960 * (1 - z), scale: z, duration: d, ease }, t);
tl.set(IMG, { x: -20, y: 0, scale: 1 }, 0);
view(.4, 700, 1.04, 3, 'none'); view(4.87, 1000, 1.06, 1.0); view(5.9, 1100, 1.0, 1.4, 'none'); view(7.3, 420, 1.12, .9);
view(9.0, 737, 1.12, .5); view(9.66, 1400, 1.08, .7); view(10.5, 973, 1.15, .5); view(11.66, 1942, 1.15, .6);
view(12.85, 1900, 1.0, .5); view(13.4, 700, 1.0, 2.2, 'none'); view(15.66, 1200, 1.2, .6); view(17.8, 1610, 1.2, .7); view(19.12, 1942, 1.2, .5); view(19.8, 1435, 1.2, .5);
view(20.95, 1700, 1.0, .8); view(22.95, 1200, 1.0, 3.0, 'none'); view(26.1, 1200, 1.08, .6); view(28.6, 2000, 1.0, .9);
/* progress bar + flashes */
const FL = document.createElement('div'); Object.assign(FL.style, { position: 'absolute', inset: 0, background: '#fff', opacity: 0, zIndex: 40, pointerEvents: 'none' }); document.body.appendChild(FL);
const flash = (t, a = .5) => tl.fromTo(FL, { opacity: a }, { opacity: 0, duration: .26, ease: 'power2.out', immediateRender: false }, t);
const PB = document.createElement('div'); Object.assign(PB.style, { position: 'absolute', left: 0, top: 0, height: '12px', width: '1080px', background: 'linear-gradient(90deg,#FF5C8A,#FFE066)', transformOrigin: '0 50%', zIndex: 50 }); document.body.appendChild(PB);
tl.fromTo(PB, { scaleX: 0 }, { scaleX: 1, duration: 29.2, ease: 'none', immediateRender: false }, 0);
[3.45, 4.87, 8.45, 12.89, 15.68, 17.84, 20.98, 22.95, 26.12].forEach(t => flash(t, .4));
const logoCard = (sc, x, y, w, t) => { const card = div('', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', padding: '22px 18px', background: '#fff', border: '6px solid ' + PLUM, borderRadius: '40px', boxShadow: '0 10px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  card.innerHTML = '<img src="../assets/logo_brand.png" style="width:100%;display:block">'; tl.fromTo(card, { opacity: 0, scale: .3, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: .6, ease: 'back.out(2)', immediateRender: false }, t); cue(t, 'thud', .7); burst(sc, x + w / 2, y + 60, t + .1, 8, 260); };
const star = (sc, cx, cy, t, R1 = 260, R2 = 200) => { const pts = []; for (let i = 0; i < 28; i++) { const r = i % 2 ? R2 : R1, a = i / 28 * 6.283; pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
  const s = svg('polygon', { points: pts.join(' '), fill: '#FF5C8A', stroke: '#fff', 'stroke-width': 12, 'stroke-linejoin': 'round', opacity: 0, style: 'filter:drop-shadow(0 14px 16px rgba(91,58,94,.4))' }, sc.g);
  tl.fromTo(s, { opacity: 0, scale: .2, svgOrigin: `${cx} ${cy}` }, { opacity: 1, scale: 1, svgOrigin: `${cx} ${cy}`, duration: .45, ease: 'back.out(2.2)', immediateRender: false }, t); cue(t, 'thud', 1);
  tl.to(s, { rotation: 6, svgOrigin: `${cx} ${cy}`, duration: 1.0, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + .4); };

/* 1 hook: looking for baby care */
{ const sc = scene(.4, 3.18), t = ts('لطفلك');
  sticker(sc, 'heart', { x: 60, y: 20, s: 2.0, t: ts('منتجات'), rot: -6 });
  sticker(sc, 'bottle', { x: 820, y: 20, s: 2.0, t: ts('عناية'), rot: 6 });
  bubble(sc, '<span class="hl">لطفلك</span>', { x: 270, y: 60, w: 540, size: 110, t, html: true, rot: -3, cls: 'pink' });
  sticker(sc, 'qmark', { x: 800, y: 300, s: 1.6, t: ts('بأسعار'), rot: 8, v: .7 }); }
/* 2 see this offer from Glow */
{ const sc = scene(3.45, 4.7), tg = ts('Glow');
  sticker(sc, 'eyes', { x: 60, y: 60, s: 1.8, t: ts('شوفي'), rot: -6 });
  logoCard(sc, 400, 40, 580, tg); }
/* 3 Blankie collection */
{ const sc = scene(4.87, 8.2), tb = ts('Blankie');
  bubble(sc, 'Blankie', { x: 190, y: 30, w: 700, size: 130, t: tb, cls: 'lat yel', rot: -3 });
  sticker(sc, 'star', { x: 70, y: 270, s: 1.4, t: tb + .25, rot: -8 }); sticker(sc, 'heart', { x: 850, y: 270, s: 1.4, t: tb + .4, rot: 8 });
  sticker(sc, 'burst', { x: 440, y: 250, s: 1.5, t: ts('متنوعة'), rot: 6, v: .6 });
  pill(sc, 'شاور جل', { x: 380, y: 420, t: ts('الشاور'), w: 320 }); }
/* 4 the range */
{ const sc = scene(8.45, 11.36), it = [['washbottle', 'الشامبو', 'والشامبو'], ['jar', 'المرطبات', 'والمرطبات'], ['tube', 'كريم الحفاظ', 'وكريم'], ['sunscreen', 'واقي الشمس', 'وواقي']], xs = [50, 300, 550, 800];
  it.forEach(([n, l, w], i) => { const t = ts(w); sticker(sc, n, { x: xs[i], y: 30, s: 1.7, t: t - .05, rot: [-5, 4, -4, 5][i] }); pill(sc, l, { x: xs[i] - 25, y: 235, t: t + .12, w: 240, size: 34 }); }); }
/* 5 body oil */
{ const sc = scene(11.66, 12.55);
  sticker(sc, 'dropper', { x: 120, y: 20, s: 2.2, t: ts('وزيت') - .05, rot: -6 }); bubble(sc, 'زيت الجسم', { x: 340, y: 100, w: 640, size: 86, t: ts('الجسم') - .1, cls: 'pink', rot: 2 }); }
/* 6 all Blankie products */
{ const sc = scene(12.87, 15.45), tk = ts('كل'), tb2 = ts('Blankie', 1);
  bubble(sc, 'كل <span class="hl">المنتجات</span>', { x: 90, y: 30, w: 900, size: 92, t: tk, html: true, rot: -2 });
  sticker(sc, 'check', { x: 70, y: 220, s: 1.7, t: ts('شامل'), rot: -6, snd: 'chime', v: .7 });
  bubble(sc, 'Blankie', { x: 400, y: 260, w: 560, size: 90, t: tb2, cls: 'lat yel', rot: 3 }); }
/* 7 any product 100 */
{ const sc = scene(15.66, 17.62), t1 = ts('بـ100');
  star(sc, 540, 250, t1 - .1, 250, 190);
  bubble(sc, '100', { x: 290, y: 150, w: 500, size: 170, t: t1 - .05, cls: 'lat yel', rot: -3 });
  sticker(sc, 'magnifier', { x: 60, y: 10, s: 1.6, t: ts('تختاريه'), rot: -8 });
  pill(sc, 'جنيه فقط', { x: 330, y: 440, t: ts('جنيه'), w: 420, size: 52 }); }
/* 8 smaller items */
{ const sc = scene(17.84, 20.76), it = [['tube', 'الكريم المرطب الصغير', ts('المرطب')], ['dropper', 'زيت الجسم', ts('وزيت', 1)], ['jar', 'كريم الحفاظ', ts('وكريم', 1)]], xs = [90, 420, 750];
  it.forEach(([n, l, t], i) => { sticker(sc, n, { x: xs[i], y: 20, s: 1.9, t: t - .1, rot: [-5, 4, -4][i] }); pill(sc, l, { x: xs[i] - 40, y: 250, t: t + .15, w: 300, size: 30 }); }); }
/* 9 price 65 */
{ const sc = scene(20.98, 22.66), t1 = ts('65');
  star(sc, 540, 250, t1 - .15, 250, 190);
  bubble(sc, '65', { x: 290, y: 150, w: 500, size: 170, t: t1 - .1, cls: 'lat yel', rot: -3 });
  pill(sc, 'جنيه', { x: 400, y: 440, t: ts('جنيه', 1), w: 280, size: 52 });
  const cols = ['#FF5C8A', '#FFE066', '#7ADFC4', '#C7B8FF', '#fff']; let sd = 11; const rr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 36; i++) { const c = div('', { position: 'absolute', left: '540px', top: '250px', width: (14 + rr() * 16) + 'px', height: '10px', background: cols[i % 5], borderRadius: '3px', opacity: 0, border: '2px solid #fff' }, sc.wrap), a = rr() * 6.283, d = 260 + rr() * 380;
    tl.fromTo(c, { opacity: 1, x: 0, y: 0, rotation: 0 }, { x: Math.cos(a) * d, y: Math.sin(a) * d + 160, rotation: rr() * 720 - 360, duration: 1.1 + rr() * .4, ease: 'power2.out', immediateRender: false }, t1); tl.to(c, { opacity: 0, duration: .3 }, t1 + 1.0 + rr() * .2); } }
/* 10 more options */
{ const sc = scene(22.95, 25.9), t = ts('اختيارات');
  bubble(sc, '<span class="hl">اختيارات</span> أكتر', { x: 90, y: 30, w: 900, size: 92, t, html: true, rot: -2 });
  ['star', 'heart', 'star'].forEach((n, i) => sticker(sc, n, { x: 130 + i * 300, y: 230, s: 1.4, t: ts('أكتر') + .1 + i * .2, rot: [-6, 5, -4][i] }));
  pill(sc, 'أسعار تستاهل', { x: 270, y: 420, t: ts('وأسعار'), w: 540, size: 50 }); }
/* 11 your right choice starts at Glow */
{ const sc = scene(26.12, 29.1), t = ts('اختيارك'), tg = ts('Glow', 1);
  bubble(sc, '<span class="hl">اختيارك</span> الصح', { x: 60, y: 30, w: 960, size: 96, t, html: true, rot: -2 });
  sticker(sc, 'check', { x: 80, y: 230, s: 1.8, t: ts('الصح'), rot: -6, snd: 'chime', v: .8 });
  sticker(sc, 'heart', { x: 820, y: 230, s: 1.6, t: tg, rot: 8 }); burst(sc, 540, 300, tg, 9, 260); cue(tg, 'chime', .9); }

finish({ duration: 31.4, outroAt: 29.5 });
