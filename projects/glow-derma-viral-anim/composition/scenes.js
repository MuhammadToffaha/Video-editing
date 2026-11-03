/* Dermaten November offer - VIRAL animated explainer: real product boxes (cut from the footage) animated as die-cut stickers. */
/* ---- real-product sticker: drops/spins in, floats, bounces on demand ---- */
function prod(sc, name, { x, y, w, t, rot = 0, spin = false, from = -700, snd = 'pop', v = .6, fl = 14 }) {
  const o = div('', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', opacity: 0, transformOrigin: '50% 60%' }, sc.wrap);
  const im = document.createElement('img'); im.src = `../assets/prod/${name}.png`; Object.assign(im.style, { width: '100%', display: 'block', filter: 'drop-shadow(0 16px 14px rgba(91,58,94,.38))', transformOrigin: '50% 60%' }); o.appendChild(im);
  tl.fromTo(o, { opacity: 0, y: from, scale: .55, rotation: rot - 28, ...(spin ? { rotationY: -540, transformPerspective: 1100 } : {}) },
    { opacity: 1, y: 0, scale: 1, rotation: rot, rotationY: 0, duration: .75, ease: 'back.out(1.6)', immediateRender: false }, t);
  tl.to(o, { y: -fl, rotation: rot + 2.2, duration: 1.05, yoyo: true, repeat: Math.max(1, Math.ceil((sc.t1 - t - .8) / 1.05)), ease: 'sine.inOut' }, t + .8);
  cue(t, snd, v); burst(sc, x + w / 2, y + w * 1.3, t + .25, 5, w * .6);
  return { o, im, bounce: tt => { tl.to(im, { scale: 1.14, y: -26, duration: .14, yoyo: true, repeat: 1, ease: 'power2.out' }, tt); } };
}
const flash = (t, a = .55) => { tl.fromTo(FL, { opacity: a }, { opacity: 0, duration: .26, ease: 'power2.out', immediateRender: false }, t); };
const FL = document.createElement('div'); Object.assign(FL.style, { position: 'absolute', inset: 0, background: '#fff', opacity: 0, zIndex: 40, pointerEvents: 'none' }); document.body.appendChild(FL);
const PB = document.createElement('div'); Object.assign(PB.style, { position: 'absolute', left: 0, top: 0, height: '12px', width: '1080px', background: 'linear-gradient(90deg,#FF5C8A,#FFE066)', transformOrigin: '0 50%', zIndex: 50 }); document.body.appendChild(PB);
tl.fromTo(PB, { scaleX: 0 }, { scaleX: 1, duration: 27.6, ease: 'none', immediateRender: false }, 0);
[3.05, 7.46, 11.68, 17.18, 20.65, 22.28].forEach(t => flash(t));

/* 1 HOOK */
{ const sc = scene(.45, 2.8), tw = ts('استنى'), tsr = ts('سيروم');
  const b = bubble(sc, 'استنى!', { x: 90, y: 190, w: 900, size: 150, t: tw, cls: 'yel', rot: -3 }); shake({ pop: b }, tw + .2, 3, 6);
  sticker(sc, 'eyes', { x: 70, y: 520, s: 2.2, t: .65, rot: -8 });
  const p = prod(sc, 'soothing', { x: 380, y: 420, w: 300, t: tsr - .15, rot: -4, spin: true, v: .8 });
  bubble(sc, 'Dermaten', { x: 90, y: 1130, w: 900, size: 100, t: ts('Dermaten') - .05, cls: 'lat', rot: 2 }); flash(tsr - .15, .4); }
/* 2 full range + azelaic */
{ const sc = scene(3.05, 7.42), nm = ['hydrabright', 'firming', 'pore', 'reviving'], xs = [25, 280, 535, 790], ta = ts('أنواع');
  bubble(sc, 'Dermaten', { x: 90, y: 170, w: 900, size: 92, t: 3.2, cls: 'lat', rot: -2 });
  nm.forEach((n, i) => prod(sc, n, { x: xs[i], y: 330, w: 235, t: ta - .25 + i * .2, rot: [-5, 3, -3, 5][i], spin: i % 2 == 0, from: i % 2 ? 600 : -700 }));
  bubble(sc, 'Azelaic Acid', { x: 90, y: 1040, w: 900, size: 88, t: ts('Azelaic'), cls: 'lat yel', rot: 2 }); sticker(sc, 'flask', { x: 800, y: 1160, s: 1.5, t: ts('Azelaic') + .3, rot: 6 }); }
/* 3 peptides + availability */
{ const sc = scene(7.46, 10.0), tp = ts('Peptides'), tg = ts('Glow', 0, 8);
  prod(sc, 'antiwr', { x: 70, y: 250, w: 270, t: tp - .2, rot: -5, spin: true, v: .8 });
  sticker(sc, 'molecule', { x: 330, y: 330, s: 1.7, t: tp + .15, rot: 8 });
  bubble(sc, 'Peptides', { x: 40, y: 1100, w: 560, size: 84, t: tp + .1, cls: 'lat pink', rot: -2 });
  sticker(sc, 'store', { x: 640, y: 260, s: 2.6, t: ts('متوفرين') - .05, rot: 4 });
  const card = div('', { position: 'absolute', left: '470px', top: '660px', width: '560px', padding: '28px 20px', background: '#fff', border: '6px solid ' + PLUM, borderRadius: '44px', boxShadow: '0 10px 0 ' + PLUM, opacity: 0 }, sc.wrap);
  card.innerHTML = '<img src="../assets/logo_brand.png" style="width:100%;display:block">';
  tl.fromTo(card, { opacity: 0, scale: .3, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: .6, ease: 'back.out(2)', immediateRender: false }, tg); cue(tg, 'thud', .7); burst(sc, 750, 760, tg + .1, 8, 300); }
/* 4 whatever your skin needs */
{ const sc = scene(9.98, 11.5);
  sticker(sc, 'face', { x: 300, y: 330, s: 4.2, t: 10.05, rot: -3 });
  bubble(sc, 'احتياج <span class="hl">بشرتك</span>', { x: 90, y: 940, w: 900, size: 92, t: ts('احتياج') + .05, html: true }); }
/* 5 concerns */
{ const sc = scene(11.68, 17.05), items = [['drop', 'الترطيب', 'الترطيب'], ['pimple', 'الحبوب', 'بالحبوب'], ['magnifier', 'المسام', 'والمسام'], ['eyes', 'العين', 'العين'], ['clock', 'الخطوط', 'والخطوط'], ['calendar', 'التجاعد', 'والتجاعد'], ['spark', 'التفتيح', 'والتفتيح']];
  items.forEach(([n, l, w], i) => { const r = i < 4 ? 0 : 1, col = i < 4 ? i : i - 4, x = r ? [165, 415, 665][col] : [40, 290, 540, 790][col], y = 330 + r * 400, t = ts(w);
    sticker(sc, n, { x, y, s: 2.0, t: t - .05, rot: [-5, 4, -4, 5][i % 4] }); pill(sc, l, { x: x - 15, y: y + 250, t: t + .12, w: 230 }); }); }
/* 6 options + suits */
{ const sc = scene(17.18, 20.5), nm = ['hydra', 'acne', 'glow', 'eye', 'firming'], tm = ts('يناسب');
  const ps = nm.map((n, i) => prod(sc, n, { x: 20 + i * 205, y: 290, w: 200, t: 17.22 + i * .22, rot: [-5, 3, -3, 4, -4][i], spin: i % 2 == 1, from: i % 2 ? 600 : -700 }));
  bubble(sc, 'اختيارات <span class="hl">كثيرة</span>', { x: 90, y: 900, w: 900, size: 76, t: ts('كثيرة') - .1, html: true, rot: -1 });
  sticker(sc, 'check', { x: 130, y: 1010, s: 2.4, t: tm + .05, rot: -6, snd: 'chime', v: .8 });
  bubble(sc, 'يناسب بشرتك', { x: 420, y: 1040, w: 600, size: 66, t: tm + .15, cls: 'pink', rot: 1 });
  ps.forEach((p, i) => p.bounce(tm + .05 + i * .1)); }
/* 7 surprise */
{ const sc = scene(20.65, 22.18), t = ts('المفاجأة');
  prod(sc, 'hydra', { x: 40, y: 480, w: 200, t: t - .1, rot: -8, spin: true });
  prod(sc, 'glow', { x: 840, y: 480, w: 200, t: t + .05, rot: 8, spin: true });
  sticker(sc, 'burst', { x: 300, y: 330, s: 4.0, t: t - .05, rot: 8, v: .8 });
  bubble(sc, '<span class="hl">المفاجأة</span> لسه جاية', { x: 60, y: 1100, w: 960, size: 74, t: t + .1, html: true, rot: -2 }); }
/* 8 price slam */
{ const sc = scene(22.28, 27.55), t2 = ts('200'), t3 = ts('300');
  ['acne', 'glow', 'hydra', 'eye'].forEach((n, i) => prod(sc, n, { x: 70 + i * 240, y: 170, w: 150, t: 22.35 + i * .15, rot: [-6, 4, -4, 6][i], spin: true, v: .4 }));
  const pts = []; for (let i = 0; i < 28; i++) { const r = i % 2 ? 215 : 275, a = i / 28 * 6.283; pts.push((540 + r * Math.cos(a)).toFixed(1) + ',' + (790 + r * Math.sin(a)).toFixed(1)); }
  const star = svg('polygon', { points: pts.join(' '), fill: '#FF5C8A', stroke: '#fff', 'stroke-width': 12, 'stroke-linejoin': 'round', opacity: 0, style: 'filter:drop-shadow(0 14px 16px rgba(91,58,94,.4))' }, sc.g);
  tl.fromTo(star, { opacity: 0, scale: .2, svgOrigin: '540 790' }, { opacity: 1, scale: 1, svgOrigin: '540 790', duration: .45, ease: 'back.out(2.2)', immediateRender: false }, t2 - .1); cue(t2 - .1, 'thud', 1);
  tl.to(star, { rotation: 6, svgOrigin: '540 790', duration: 1.1, yoyo: true, repeat: 4, ease: 'sine.inOut' }, t2 + .4);
  bubble(sc, '200', { x: 190, y: 690, w: 700, size: 190, t: t2 - .05, cls: 'lat yel', rot: -3 });
  bubble(sc, '300', { x: 640, y: 530, w: 380, size: 100, t: ts('بدلا') + .02, cls: 'lat', rot: 7 });
  sticker(sc, 'cross', { x: 700, y: 470, s: 2.2, t: t3 + .05, rot: 8, snd: 'thud', v: .7, sparks: false });
  pill(sc, 'LIMITED TIME', { x: 280, y: 1100, t: ts('لفترة'), w: 520 });
  sticker(sc, 'calendar', { x: 80, y: 1160, s: 1.4, t: ts('نوفمبر') - .1, rot: -5 }); bubble(sc, 'NOVEMBER', { x: 280, y: 1170, w: 700, size: 92, t: ts('نوفمبر') + .05, cls: 'lat pink', rot: 2 });
  const cols = ['#FF5C8A', '#FFE066', '#7ADFC4', '#C7B8FF', '#fff']; let seed = 11; const rr = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 44; i++) { const c = div('', { position: 'absolute', left: '540px', top: '790px', width: (14 + rr() * 16) + 'px', height: '10px', background: cols[i % 5], borderRadius: '3px', opacity: 0, border: '2px solid #fff' }, sc.wrap), a = rr() * 6.283, d = 300 + rr() * 420;
    tl.fromTo(c, { opacity: 1, x: 0, y: 0, rotation: 0 }, { x: Math.cos(a) * d, y: Math.sin(a) * d + 180, rotation: rr() * 720 - 360, duration: 1.2 + rr() * .5, ease: 'power2.out', immediateRender: false }, t2); tl.to(c, { opacity: 0, duration: .3 }, t2 + 1.1 + rr() * .3); } }

finish({ duration: 30.0, outroAt: 27.7 });
