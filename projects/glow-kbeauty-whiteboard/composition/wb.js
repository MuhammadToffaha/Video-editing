/* wb.js - WHITEBOARD explainer cut. No camera footage: white paper, doodles that draw themselves under a marker-holding hand,
   handwritten labels, same captions/brand theme as the reel. Every drawing is triggered by the spoken word (ts('word')).
   Engine: GSAP timeline (seekable) + pen schedule (hand follows the tip of whatever path is being drawn). */
(async () => {
await Promise.all(['800 40px "Baloo Bhaijaan 2"', '700 40px "Baloo Bhaijaan 2"', '400 40px "Bebas Neue"', '400 40px "Permanent Marker"', '900 40px Cairo'].map(f => document.fonts.load(f, 'Aa أب')));
await document.fonts.ready;
const TR = window.TRANSCRIPT, W = TR.words;
const NS = 'http://www.w3.org/2000/svg';
const tl = gsap.timeline({ paused: true });
const stage = document.getElementById('stage'), art = document.getElementById('art'), pens = document.getElementById('pens');
art.setAttribute('transform', 'translate(540,470) scale(1.06) translate(-540,-300)');   // whole drawing area: shifted down + slightly larger
window.CUES = [];
const cue = (t, type, v = 1, d) => window.CUES.push({ t: +t.toFixed(3), type, v, ...(d ? { d: +d.toFixed(3) } : {}) });
const wd = (txt, nth = 0, after = 0) => { const m = W.filter(w => w.start >= after - 1e-6 && w.text.includes(txt)); if (!m[nth]) throw new Error('word not found: ' + txt); return m[nth]; };
const ts = (txt, nth = 0, after = 0) => wd(txt, nth, after).start;
const INK = '#161616', BLUE = '#1F3FD1', RED = '#E1302B', GREEN = '#1E9E63', CORAL = '#D9594C';
const svg = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const div = (cls, css = {}, parent = stage) => { const e = document.createElement('div'); e.className = cls; Object.assign(e.style, css); parent.appendChild(e); return e; };

/* ---------------- doodle library (100x100 boxes; fill = flat marker colour) ---------------- */
const L = {
  bottle: [{ d: 'M26 40h48a7 7 0 0 1 7 7v42a7 7 0 0 1-7 7H26a7 7 0 0 1-7-7V47a7 7 0 0 1 7-7z', f: '#9AD3F2' }, { d: 'M30 62h40v16H30z', f: '#fff' }, { d: 'M41 40V28h18v12z', f: '#DADADA' }, { d: 'M37 28v-8h27l8-4v10l-8 2z', f: '#333' }],
  tube: [{ d: 'M36 8h28l-2 14H38z', f: '#333' }, { d: 'M38 22h24v64a6 6 0 0 1-6 6H44a6 6 0 0 1-6-6z', f: '#F4A261' }, { d: 'M38 52h24', w: 4 }],
  jar: [{ d: 'M18 26h64a4 4 0 0 1 4 4v14H14V30a4 4 0 0 1 4-4z', f: '#444' }, { d: 'M16 44h68v36a9 9 0 0 1-9 9H25a9 9 0 0 1-9-9z', f: '#F6B8C8' }, { d: 'M28 62h44', w: 4 }],
  dropper: [{ d: 'M40 6h20v22H40z', f: '#333' }, { d: 'M43 28h14v9H43z', f: '#BBB' }, { d: 'M29 37h42a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H29a6 6 0 0 1-6-6V43a6 6 0 0 1 6-6z', f: '#F6C85F' }, { d: 'M32 62h36', w: 4 }],
  sun: [{ d: 'M50 30a20 20 0 1 0 .1 0z', f: '#FFD43B' }, { d: 'M50 4v12M50 84v12M4 50h12M84 50h12M17 17l8 8M75 75l8 8M83 17l-8 8M25 75l-8 8', w: 6 }],
  face: [{ d: 'M50 6a40 40 0 1 0 .1 0z', f: '#FFD7B5' }, { d: 'M36 40v8M64 40v8', w: 7 }, { d: 'M32 62q18 18 36 0', w: 6 }, { d: 'M20 56h8M72 56h8', w: 4, c: '#F08A7A' }],
  flame: [{ d: 'M50 4C54 26 80 34 80 62a30 30 0 0 1-60 0C20 46 32 40 36 26C40 40 46 38 50 4z', f: '#FF7A29' }, { d: 'M50 50C54 60 62 62 62 74a12 12 0 0 1-24 0C38 66 46 62 50 50z', f: '#FFD43B', w: 4 }],
  star: [{ d: 'M50 4L62 36 96 38 70 59 79 92 50 73 21 92 30 59 4 38 38 36z', f: '#FFD43B' }],
  shield: [{ d: 'M50 4L90 20V50C90 75 72 91 50 98C28 91 10 75 10 50V20z', f: '#8FD9B6' }, { d: 'M30 50l14 14 26-30', w: 9, c: '#0E7A4B' }],
  heart: [{ d: 'M50 92C8 62 4 30 28 18C40 12 48 20 50 28C52 20 60 12 72 18C96 30 92 62 50 92z', f: '#F0525B' }, { d: 'M26 34q6-8 14-6', w: 4, c: '#fff' }],
  box: [{ d: 'M50 4L92 26V72L50 96L8 72V26z', f: '#D9A066' }, { d: 'M8 26L50 48 92 26M50 48V96', w: 5 }, { d: 'M30 15L72 37V52', w: 4, c: '#F4D9B0' }],
  chat: [{ d: 'M14 12h72a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H46L26 92V70H14a8 8 0 0 1-8-8V20a8 8 0 0 1 8-8z', f: '#fff' }, { d: 'M24 32h52M24 50h32', w: 5 }],
  flask: [{ d: 'M38 6h24M42 6v28L14 82a8 8 0 0 0 7 12h58a8 8 0 0 0 7-12L58 34V6', f: '#E8F6FD' }, { d: 'M24 68h52l8 14a6 6 0 0 1-5 10H21a6 6 0 0 1-5-10z', f: '#6CC3E8', w: 4 }],
  info: [{ d: 'M50 6a44 44 0 1 0 .1 0z', f: '#BFD0FF' }, { d: 'M50 44v28M50 28v2', w: 9 }],
  pumpb: [{ d: 'M24 44h52a7 7 0 0 1 7 7v38a7 7 0 0 1-7 7H24a7 7 0 0 1-7-7V51a7 7 0 0 1 7-7z', f: '#B9E4C9' }, { d: 'M50 44V28M36 28h28', w: 7 }, { d: 'M50 4v14M42 12l8 8 8-8', w: 6, c: RED }],
  factory: [{ d: 'M6 94V42l26 15V42l26 15V24h38v70z', f: '#C7CCD6' }, { d: 'M62 24V6h12v18', f: '#9AA1AE' }, { d: 'M24 78h10M46 78h10M68 78h10', w: 5 }],
  store: [{ d: 'M12 42h76v52H12z', f: '#FDE7C8' }, { d: 'M6 42L16 12H84L94 42z', f: '#E4572E' }, { d: 'M42 66h18v28H42z', f: '#fff' }, { d: 'M18 56h18v14H18z', f: '#CFEAFB', w: 4 }, { d: 'M66 56h18v14H66z', f: '#CFEAFB', w: 4 }],
  check: [{ d: 'M10 54l26 26L90 18', w: 14, c: GREEN }],
  cross: [{ d: 'M14 14L86 86M86 14L14 86', w: 14, c: RED }],
  qmark: [{ d: 'M26 30C26 2 80 2 80 30C80 52 52 54 52 74', w: 13, c: RED }, { d: 'M52 94v.5', w: 15, c: RED }],
  plus: [{ d: 'M50 10v80M10 50h80', w: 13, c: RED }],
  arrowL: [{ d: 'M92 50H10M34 22L8 50l26 28', w: 9 }],
  arrowR: [{ d: 'M8 50H90M66 22L92 50 66 78', w: 9 }],
  arrowUp: [{ d: 'M10 90L88 20M60 18H90V48', w: 10, c: RED }],
  play: [{ d: 'M6 12h88a6 6 0 0 1 6 6v64a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z', f: '#fff' }, { d: 'M40 30L72 50 40 70z', f: RED }],
  burst: [{ d: 'M50 2L60 20 80 10 80 32 98 40 82 54 94 74 72 72 64 94 50 80 36 94 28 72 6 74 18 54 2 40 20 32 20 10 40 20z', f: '#FFC93C' }],
  spark: [{ d: 'M50 6v22M50 72v22M6 50h22M72 50h22M20 20l14 14M66 66l14 14M80 20L66 34M34 66L20 80', w: 6, c: '#F4A100' }],
  loop: [{ d: 'M50 6C78 4 98 22 96 50C94 78 70 96 46 94C20 92 4 74 6 48C8 24 28 8 56 10', w: 6, c: RED }],
  rect: [{ d: 'M2 2H98V98H2z', f: '#fff' }],
};

/* ---------------- pen schedule (the hand follows the tip of whatever is being drawn) ---------------- */
const penSegs = [];
function ctmPt(p, len) { const pt = p.getPointAtLength(len), m = p.getCTM(); return { x: m.a * pt.x + m.c * pt.y + m.e, y: m.b * pt.x + m.d * pt.y + m.f }; }
function penSeg(p, t0, t1) { const Lh = p.getTotalLength(); penSegs.push({ p, t0, t1, L: Lh, a: ctmPt(p, 0), b: ctmPt(p, Lh) }); }
const REST = { x: 1380, y: 1560 };

/* ---------------- scene scaffolding ---------------- */
function scene(t0, t1, label) {
  const g = svg('g', { opacity: 0 }, art), wrap = div('sc', { opacity: 0, transformOrigin: '540px 300px', transform: 'translateY(170px) scale(1.06)' });
  tl.set([g, wrap], { opacity: 1 }, t0); tl.to([g, wrap], { opacity: 0, duration: .25, ease: 'power1.in' }, t1);
  cue(t0 - .02, 'page', .7);
  if (label) {
    const b = div('lbl', {}, stage); b.textContent = label;
    tl.fromTo(b, { opacity: 0, y: -20, rotation: -3 }, { opacity: 1, y: 0, rotation: -1.2, duration: .35, ease: 'back.out(2)', immediateRender: false }, t0 + .05);
    tl.to(b, { opacity: 0, duration: .2 }, t1);
  }
  return { g, wrap, t0, t1 };
}
/* draw a doodle: outlines sequentially with the marker, then colour it in */
function doodle(sc, name, { x, y, s = 2, t = 0, speed = 1700, only = null }) {
  const gg = svg('g', { transform: `translate(${x},${y}) scale(${s})` }, sc.g); let tt = t; const fills = [];
  L[name].forEach(sh => {
    const p = svg('path', { d: sh.d, fill: sh.f || 'none', 'fill-opacity': 0, stroke: sh.c || INK, 'stroke-width': (sh.w || 6) / s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, gg);
    const len = p.getTotalLength(); p.style.strokeDasharray = `${len} ${len + 4}`; p.style.strokeDashoffset = len;
    const dur = Math.max(.12, len * s / speed);
    tl.set(p, { opacity: 1 }, tt); tl.to(p, { strokeDashoffset: 0, duration: dur, ease: 'none' }, tt); penSeg(p, tt, tt + dur);
    if (sh.f) fills.push(p); tt += dur;
  });
  if (fills.length) tl.to(fills, { attr: { 'fill-opacity': 1 }, duration: .28, ease: 'power1.out' }, tt);
  cue(t, 'scribble', .5, Math.max(.2, tt - t));
  return { t0: t, t1: tt + .28, g: gg };
}
/* handwritten text: revealed along the baseline while the pen scribbles across it */
function write(sc, txt, { x, y, w = 800, size = 58, t, dur, cls = 'ar', color = BLUE, ltr = false, align = 'right' }) {
  const el = div('tx ' + cls + (ltr ? ' ltr' : ''), { left: x + 'px', top: y + 'px', width: w + 'px', fontSize: size + 'px', color, textAlign: align }, sc.wrap);
  const sp = document.createElement('span'); sp.textContent = txt; el.appendChild(sp);
  const r = sp.getBoundingClientRect(); const x1 = r.left, x2 = r.right, ym = r.top + r.height * .58;
  const n = Math.max(3, Math.round((x2 - x1) / 34)); let d = '';
  const a0 = ltr ? x1 : x2, a1 = ltr ? x2 : x1;
  for (let i = 0; i <= n; i++) { const px = a0 + (a1 - a0) * i / n, py = ym + (i % 2 ? -size * .18 : size * .18); d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); }
  const p = svg('path', { d, fill: 'none', stroke: 'none' }, pens);
  const dd = dur || Math.min(1.6, Math.max(.45, (x2 - x1) / 700));
  tl.fromTo(el, { clipPath: ltr ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: dd, ease: 'none', immediateRender: false }, t);
  penSeg(p, t, t + dd); cue(t, 'scribble', .4, dd);
  return { t0: t, t1: t + dd, el, x1, x2 };
}
/* ---------------- header: banner + watermark ---------------- */
const banner = document.getElementById('banner'), wm = document.getElementById('wm');
tl.fromTo(banner, { opacity: 0, y: -40, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(1.8)', immediateRender: false }, .15); cue(.2, 'pop', .8);
tl.to(banner, { opacity: 0, duration: .2 }, 55.25);
tl.to(wm, { opacity: .95, duration: .5 }, .9).to(wm, { opacity: 0, duration: .2 }, 55.25);

/* ===================================================================== SCENES ===================================================================== */
/* 1  hook: Korean skincare + "which one?" */
{ const sc = scene(.3, 3.78, '1. العناية الكورية');
  doodle(sc, 'bottle', { x: 90, y: 560, s: 2.7, t: .55 }); doodle(sc, 'tube', { x: 410, y: 560, s: 2.7, t: 1.15 }); doodle(sc, 'jar', { x: 730, y: 585, s: 2.5, t: 1.75 });
  write(sc, 'Korean Skincare', { x: 90, y: 930, w: 900, size: 92, t: ts('الكورية') + .15, dur: .9, cls: 'marker', ltr: true, align: 'center' });
  doodle(sc, 'qmark', { x: 420, y: 250, s: 3, t: ts('تختار') - .1, speed: 1300 }); }
/* 2  watch this video */
{ const sc = scene(3.88, 4.66, '2. ابدأ');
  doodle(sc, 'play', { x: 270, y: 560, s: 5.4, t: 3.92, speed: 2600 }); }
/* 3  new addition at Glow: store + NEW burst + logo */
{ const sc = scene(5.1, 8.4, '3. الجديد');
  doodle(sc, 'store', { x: 130, y: 400, s: 4, t: 5.3, speed: 2200 });
  const tn = ts('إضافة');
  const b = doodle(sc, 'burst', { x: 600, y: 330, s: 3.2, t: tn - .05, speed: 2000 });
  write(sc, 'NEW', { x: 616, y: 418, w: 280, size: 130, t: tn + .3, dur: .35, cls: 'bebas', color: RED, ltr: true, align: 'center' });
  const lg = div('', { position: 'absolute', left: '260px', top: '900px', width: '560px', clipPath: 'inset(0 100% 0 0)' }, sc.wrap); lg.innerHTML = '<img src="../assets/logo_brand.png" style="width:560px;display:block">';
  const tg = ts('Glow', 0, 6); tl.fromTo(lg, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .8, ease: 'power2.out', immediateRender: false }, tg); cue(tg, 'thud', .9); }
/* 4  special collection */
{ const sc = scene(8.5, 10.65, '4. المجموعة');
  const xs = [60, 310, 560, 810], nm = ['bottle', 'tube', 'jar', 'dropper'];
  const sh = svg('path', { d: 'M40 800H1040', stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, sc.g);
  { const len = sh.getTotalLength(); sh.style.strokeDasharray = `${len} ${len + 4}`; sh.style.strokeDashoffset = len; tl.set(sh, { opacity: 1 }, 8.55); tl.to(sh, { strokeDashoffset: 0, duration: .45, ease: 'none' }, 8.55); penSeg(sh, 8.55, 9); }
  nm.forEach((n, i) => doodle(sc, n, { x: xs[i], y: 590, s: 2.1, t: 9.0 + i * .33, speed: 1900 }));
  const tm = ts('مميزة'); doodle(sc, 'spark', { x: 790, y: 360, s: 2, t: tm + .1, speed: 1500 });
  write(sc, 'مجموعة مميزة', { x: 90, y: 880, w: 900, size: 84, t: tm + .2, dur: .9, align: 'center' }); }
/* 5  brands table (writes each name when it is said) */
{ const sc = scene(10.98, 18.6, '5. البراندات');
  const X0 = 90, X1 = 990, Y0 = 400, HH = 120, RH = 150, rows = 4;
  const hdr = svg('rect', { x: X0, y: Y0, width: X1 - X0, height: HH, fill: '#5B6AD8', 'fill-opacity': 0, stroke: INK, 'stroke-width': 6, opacity: 0 }, sc.g);
  const lines = [];
  const rl = (d) => { const p = svg('path', { d, stroke: INK, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, sc.g); lines.push(p); return p; };
  const outer = svg('path', { d: `M${X0} ${Y0}H${X1}V${Y0 + HH + RH * rows}H${X0}Z`, stroke: INK, 'stroke-width': 6, fill: 'none', 'stroke-linejoin': 'round', opacity: 0 }, sc.g); lines.unshift(outer);
  const hl = rl(`M${X0} ${Y0 + HH}H${X1}`), vl = rl(`M${X0 + 150} ${Y0}V${Y0 + HH + RH * rows}`);
  for (let r = 1; r < rows; r++) rl(`M${X0} ${Y0 + HH + RH * r}H${X1}`);
  let tt = 11.05; [outer, hl, vl, ...lines.filter(p => ![outer, hl, vl].includes(p))].forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = `${len} ${len + 4}`; p.style.strokeDashoffset = len; const dur = Math.max(.14, len / 2300); tl.set(p, { opacity: 1 }, tt); tl.to(p, { strokeDashoffset: 0, duration: dur, ease: 'none' }, tt); penSeg(p, tt, tt + dur); tt += dur; });
  tl.set(hdr, { opacity: 1 }, 11.05); tl.to(hdr, { attr: { 'fill-opacity': 1 }, duration: .3 }, tt);
  write(sc, 'KOREAN BRANDS', { x: X0 + 160, y: Y0 + 10, w: 700, size: 92, t: tt + .1, dur: .7, cls: 'bebas', color: INK, ltr: true, align: 'center' });
  write(sc, '#', { x: X0, y: Y0 + 8, w: 150, size: 92, t: tt + .1, dur: .25, cls: 'bebas', color: INK, ltr: true, align: 'center' });
  const names = ['COSRX', 'Dr. Althea', 'Axis-Y'], times = [ts('COSRX'), ts('Dr.Althea'), ts('Axis-Y')], icons = ['bottle', 'tube', 'jar'];
  names.forEach((n, i) => {
    const ry = Y0 + HH + RH * i;
    write(sc, String(i + 1), { x: X0, y: ry + 16, w: 150, size: 96, t: times[i] - .2, dur: .25, cls: 'bebas', color: RED, ltr: true, align: 'center' });
    write(sc, n, { x: X0 + 180, y: ry + 12, w: 500, size: 104, t: times[i], dur: .6, cls: 'bebas', color: RED, ltr: true, align: 'left' });
    doodle(sc, icons[i], { x: 800, y: ry + 12, s: 1.2, t: times[i] + .65, speed: 1600 });
  });
  const tmo = ts('وغيرهم'); const ry = Y0 + HH + RH * 3;
  write(sc, '+ المزيد', { x: X0 + 180, y: ry + 12, w: 700, size: 92, t: tmo, dur: .7, color: BLUE, align: 'left' }); }
/* 6  skincare types, each with its own benefits */
{ const sc = scene(18.7, 20.95, '6. المنتجات');
  const cats = [['tube', 'غسول'], ['dropper', 'سيروم'], ['jar', 'مرطب'], ['sun', 'واقي شمس']], xs = [60, 310, 560, 810];
  cats.forEach(([n, l], i) => {
    const d = doodle(sc, n, { x: xs[i], y: 560, s: 2.0, t: 18.75 + i * .3, speed: 2000 });
    write(sc, l, { x: xs[i] - 20, y: 790, w: 240, size: 56, t: d.t1 - .1, dur: .45, align: 'center' });
  });
  const tb = ts('مميزاته') - .9;
  cats.forEach((_, i) => doodle(sc, 'loop', { x: xs[i] - 10, y: 545, s: 2.2, t: tb + i * .3, speed: 1900 })); }
/* 7  match product -> skin */
{ const sc = scene(21.3, 24.34, '7. الاختيار');
  const tp = ts('المنتج', 0, 21.3), tm = ts('المناسب'), ts_ = ts('لبشرتنا');
  doodle(sc, 'bottle', { x: 90, y: 520, s: 3, t: tp - .15, speed: 2000 });
  write(sc, 'المنتج', { x: 60, y: 840, w: 330, size: 66, t: tp + .5, dur: .5, align: 'center' });
  doodle(sc, 'arrowR', { x: 400, y: 600, s: 2.4, t: tm, speed: 1700 });
  doodle(sc, 'face', { x: 700, y: 510, s: 3.2, t: ts_ - .1, speed: 2000 });
  write(sc, 'بشرتك', { x: 690, y: 840, w: 330, size: 66, t: ts_ + .55, dur: .5, align: 'center' });
  doodle(sc, 'check', { x: 360, y: 920, s: 3.4, t: ts_ + 1.0, speed: 1300 }); cue(ts_ + 1.1, 'chime', .8); }
/* 8  not just trending / popular */
{ const sc = scene(24.5, 26.7, '8. مش بالترند');
  const t1 = ts('ترند'), t2 = ts('مشهور');
  doodle(sc, 'flame', { x: 110, y: 520, s: 3, t: t1 - .6, speed: 2200 }); write(sc, 'TRENDING', { x: 60, y: 840, w: 380, size: 104, t: t1 - .1, dur: .5, cls: 'bebas', color: INK, ltr: true, align: 'center' });
  doodle(sc, 'star', { x: 640, y: 520, s: 3, t: t2 - .6, speed: 2200 }); write(sc, 'POPULAR', { x: 580, y: 840, w: 380, size: 104, t: t2 - .1, dur: .5, cls: 'bebas', color: INK, ltr: true, align: 'center' });
  doodle(sc, 'cross', { x: 90, y: 500, s: 3.4, t: t1 + .25, speed: 1500 }); cue(t1 + .25, 'swipe', .8);
  doodle(sc, 'cross', { x: 620, y: 500, s: 3.4, t: t2 + .25, speed: 1500 }); cue(t2 + .25, 'swipe', .8); }
/* 9  focus: more than supplying products */
{ const sc = scene(26.9, 31.95, '9. اهتمامنا');
  write(sc, 'اهتمامنا', { x: 90, y: 330, w: 900, size: 100, t: ts('اهتمامنا') - .1, dur: .8, align: 'center' });
  const tp = ts('توفير', 0, 28);
  doodle(sc, 'box', { x: 70, y: 600, s: 3, t: tp - .1, speed: 2000 });
  doodle(sc, 'plus', { x: 390, y: 680, s: 1.1, t: ts('بس', 0, 28), speed: 900 });
  ['shield', 'star', 'chat'].forEach((n, i) => doodle(sc, n, { x: 500 + i * 190, y: 640, s: 1.6, t: 29.6 + i * .45, speed: 1900 }));
  write(sc, 'مش بس توفير المنتجات', { x: 90, y: 940, w: 900, size: 64, t: tp + .5, dur: 1.0, align: 'center', color: INK }); }
/* 10  authentic products from trusted sources */
{ const sc = scene(32.1, 34.1, '10. الأصالة');
  const ta = ts('أصلية'), tm = ts('مصادر'), tv = ts('موثوقة');
  doodle(sc, 'shield', { x: 650, y: 430, s: 3.4, t: ta - .35, speed: 2000 }); cue(ta + .4, 'chime', .8);
  write(sc, 'منتجات أصلية', { x: 60, y: 520, w: 560, size: 84, t: ta, dur: .8, align: 'center' });
  doodle(sc, 'factory', { x: 700, y: 900, s: 2.4, t: tm - .15, speed: 2000 });
  doodle(sc, 'arrowL', { x: 470, y: 960, s: 2, t: tm + .35, speed: 1500 });
  doodle(sc, 'store', { x: 130, y: 900, s: 2.4, t: tv - .05, speed: 2000 });
  write(sc, 'مصادر موثوقة', { x: 620, y: 1160, w: 400, size: 52, t: tm + .1, dur: .6, align: 'center' });
  write(sc, 'Glow', { x: 130, y: 1160, w: 240, size: 60, t: tv + .3, dur: .4, cls: 'bebas', color: RED, ltr: true, align: 'center' }); }
/* 11  quality: stars */
{ const sc = scene(34.28, 38.32, '11. الجودة');
  const tj = ts('جودة');
  write(sc, 'جودة الاختيارات', { x: 90, y: 360, w: 900, size: 92, t: tj, dur: .9, align: 'center' });
  [0, 1, 2, 3, 4].map(i => doodle(sc, 'star', { x: 80 + i * 190, y: 620, s: 1.7, t: tj + .9 + i * .3, speed: 2200 }));
  const tq = ts('وتقديم');
  doodle(sc, 'box', { x: 430, y: 900, s: 1.9, t: tq - .1, speed: 2000 });
  doodle(sc, 'check', { x: 650, y: 940, s: 1.5, t: tq + .7, speed: 1100 }); cue(tq + .8, 'chime', .7);
  write(sc, 'تقديم المنتجات', { x: 90, y: 1130, w: 900, size: 62, t: tq + .4, dur: .8, align: 'center', color: INK }); }
/* 12  help: understand product, ingredients, usage */
{ const sc = scene(38.62, 43.48, '12. المساعدة');
  doodle(sc, 'chat', { x: 760, y: 320, s: 2.2, t: 38.75, speed: 2000 });
  write(sc, 'حد يساعدك', { x: 120, y: 360, w: 600, size: 86, t: 38.9, dur: .8, align: 'right' });
  const items = [['info', 'فهم المنتج', ts('فهم', 0, 39)], ['flask', 'مكوناته', ts('ومكوناته')], ['pumpb', 'استخدامه', ts('واستخدامه')]];
  items.forEach(([n, l, t], i) => {
    const y = 640 + i * 240;
    doodle(sc, n, { x: 820, y, s: 1.7, t: t - .25, speed: 2000 });
    write(sc, l, { x: 150, y: y + 20, w: 640, size: 82, t: t + .1, dur: .55, align: 'right', color: INK });
    doodle(sc, 'check', { x: 70, y: y + 20, s: 1.2, t: t + .7, speed: 900 }); cue(t + .75, 'tick', .8);
  }); }
/* 13  suits your skin? */
{ const sc = scene(43.6, 45.5, '13. مناسب؟');
  doodle(sc, 'bottle', { x: 80, y: 480, s: 2.6, t: ts('المنتج', 0, 43.4) - .1, speed: 2100 });
  doodle(sc, 'face', { x: 730, y: 480, s: 2.6, t: ts('لبشرتك') - .1, speed: 2100 });
  doodle(sc, 'qmark', { x: 430, y: 470, s: 2.2, t: ts('مناسب') + .05, speed: 1300 });
  const tn = ts('ولا');
  doodle(sc, 'check', { x: 300, y: 860, s: 2.3, t: tn - .05, speed: 1300 }); doodle(sc, 'cross', { x: 600, y: 860, s: 2.3, t: ts('لأ') - .05, speed: 1300 }); cue(tn, 'tick', .8); }
/* 14  roadmap: not the last addition, just a step */
{ const sc = scene(46.0, 48.45, '14. الخطوة');
  const xs = [850, 600, 350, 100], y = 760;
  const rd = svg('path', { d: `M880 ${y}H70`, stroke: '#999', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, sc.g);
  { const len = rd.getTotalLength(); rd.style.strokeDasharray = `${len} ${len + 4}`; rd.style.strokeDashoffset = len; const tl0 = ts('آخر'); tl.set(rd, { opacity: 1 }, tl0 - .2); tl.to(rd, { strokeDashoffset: 0, duration: .8, ease: 'none' }, tl0 - .2); penSeg(rd, tl0 - .2, tl0 + .6); }
  xs.forEach((x, i) => { const c = svg('path', { d: `M${x} ${y - 38}a38 38 0 1 0 .1 0z`, fill: i ? '#fff' : RED, 'fill-opacity': 0, stroke: i ? '#777' : INK, 'stroke-width': 7, opacity: 0, 'stroke-linecap': 'round' }, sc.g);
    const len = c.getTotalLength(); c.style.strokeDasharray = `${len} ${len + 4}`; c.style.strokeDashoffset = len; const tt = i ? ts('آخر') + .35 + i * .22 : 46.2; const dur = .28;
    tl.set(c, { opacity: 1 }, tt); tl.to(c, { strokeDashoffset: 0, duration: dur, ease: 'none' }, tt); tl.to(c, { attr: { 'fill-opacity': i ? 0 : 1 }, duration: .2 }, tt + dur); penSeg(c, tt, tt + dur); });
  write(sc, 'الآن', { x: 700, y: 560, w: 300, size: 80, t: 46.5, dur: .45, align: 'center', color: RED });
  [1, 2, 3].forEach(i => write(sc, 'التالي', { x: xs[i] - 120, y: 860, w: 240, size: 52, t: ts('آخر') + .6 + i * .2, dur: .35, align: 'center', color: '#777' }));
  doodle(sc, 'arrowUp', { x: 780, y: 330, s: 1.7, t: ts('خطوة'), speed: 1200 }); }
/* 15  better experience, day after day */
{ const sc = scene(48.52, 52.95, '15. التطور');
  const hs = [90, 170, 260, 360, 470], bx = [115, 305, 495, 685, 875], base = 1230;
  const ax = svg('path', { d: `M60 ${base}H1020`, stroke: INK, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, sc.g);
  { const len = ax.getTotalLength(); ax.style.strokeDasharray = `${len} ${len + 4}`; ax.style.strokeDashoffset = len; tl.set(ax, { opacity: 1 }, 48.6); tl.to(ax, { strokeDashoffset: 0, duration: .45, ease: 'none' }, 48.6); penSeg(ax, 48.6, 49.05); }
  const tb = [ts('تجربة', 0, 48) + .1, ts('أفضل') - .1, ts('يوم', 0, 49.9), ts('بعد', 0, 49.9), ts('يوم', 1, 50)];
  hs.forEach((h, i) => {
    const r = svg('rect', { x: bx[i] - 60, y: base - h, width: 120, height: h, fill: '#F08A7A', 'fill-opacity': 0, stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round', opacity: 0 }, sc.g);
    const len = r.getTotalLength(); r.style.strokeDasharray = `${len} ${len + 4}`; r.style.strokeDashoffset = len; const dur = Math.max(.3, len / 1500);
    tl.set(r, { opacity: 1 }, tb[i]); tl.to(r, { strokeDashoffset: 0, duration: dur, ease: 'none' }, tb[i]); tl.to(r, { attr: { 'fill-opacity': 1 }, duration: .25 }, tb[i] + dur); penSeg(r, tb[i], tb[i] + dur); cue(tb[i], 'rise', .6);
    write(sc, 'DAY ' + (i + 1), { x: bx[i] - 90, y: base + 20, w: 180, size: 54, t: tb[i] + dur, dur: .25, cls: 'bebas', color: INK, ltr: true, align: 'center' });
  });
  doodle(sc, 'arrowUp', { x: 560, y: 330, s: 4.6, t: tb[4] + .5, speed: 1600 });
  write(sc, 'خطوة بخطوة', { x: 40, y: 350, w: 500, size: 72, t: ts('خطوة', 0, 50.9), dur: .8, align: 'center' }); }
/* 16  trust */
{ const sc = scene(53.0, 55.32, '16. الثقة');
  const tt = ts('ثقتكم');
  doodle(sc, 'heart', { x: 300, y: 430, s: 4.8, t: 53.15, speed: 2200 });
  doodle(sc, 'spark', { x: 120, y: 420, s: 1.6, t: 54.0, speed: 1600 }); doodle(sc, 'spark', { x: 790, y: 440, s: 1.6, t: 54.2, speed: 1600 });
  write(sc, 'ثقتكم', { x: 90, y: 1000, w: 900, size: 150, t: tt - .1, dur: .9, align: 'center' }); cue(tt + .5, 'chime', .8); }

/* ---------------- outro ---------------- */
{ const o = document.getElementById('outro'), lg = o.querySelector('img');
  tl.to(o, { clipPath: 'inset(0% 0 0 0)', duration: .55, ease: 'power4.inOut' }, 55.38);
  tl.fromTo(lg, { opacity: 0, scale: .9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: .8, ease: 'expo.out', immediateRender: false }, 55.8);
  tl.to(lg, { scale: 1.04, duration: 1.2, ease: 'sine.inOut' }, 56.0);
  cue(55.38, 'swell', 1); cue(55.85, 'chime', 1); }

/* ---------------- captions (same style as the reel, dark ink on white paper) ---------------- */
{ const caps = document.getElementById('caps');
  TR.chunks.forEach((ids, ci) => {
    const el = document.createElement('div'); el.className = 'chunk';
    el.innerHTML = ids.map(i => `<span class="w${W[i].key ? ' k' : ''}" data-i="${i}"><span class="t">${W[i].text}</span></span>`).join(''); caps.appendChild(el);
    const t0 = W[ids[0]].start - .03, last = W[ids[ids.length - 1]], nx = ci + 1 < TR.chunks.length ? W[TR.chunks[ci + 1][0]].start - .03 : 1e9, t1 = Math.min(last.end + .28, nx);
    tl.fromTo(el, { opacity: 0, y: 20, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .14, ease: 'power2.out', immediateRender: false }, t0); tl.set(el, { opacity: 0 }, t1);
    ids.forEach(i => { const w = el.querySelector(`[data-i="${i}"]`), t = w.querySelector('.t');
      if (!W[i].key) { tl.set(t, { color: CORAL }, W[i].start); tl.set(t, { color: INK }, W[i].end); } else { tl.to(w, { backgroundColor: '#E8705F', duration: .08 }, W[i].start); tl.to(w, { backgroundColor: CORAL, duration: .2 }, W[i].end); }
      tl.to(w, { scale: 1.1, duration: .09, ease: 'power2.out' }, W[i].start); tl.to(w, { scale: 1, duration: .16, ease: 'power2.inOut' }, W[i].start + .09); }); }); }

/* ---------------- the hand + marker ---------------- */
const hg = document.getElementById('handg');
const SK = '#F4BE9F', SKD = '#6E4330';
const finger = (d, w) => `<path d="${d}" stroke="${SKD}" stroke-width="${w + 7}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${SK}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
hg.innerHTML = `<g transform="scale(.6) rotate(34)">
  <path d="M390 -50C520 -66 700 -92 960 -108L960 128C700 130 520 110 390 84Z" fill="#EFB391" stroke="${SKD}" stroke-width="4"/>
  <path d="M196 -40C226 -104 340 -120 410 -72C452 -42 446 52 394 88C330 116 248 76 196 42Z" fill="${SK}" stroke="${SKD}" stroke-width="4"/>
  <path d="M338 -78C372 -52 382 -8 370 40" fill="none" stroke="#D99B7A" stroke-width="5" stroke-linecap="round"/>
  <path d="M250 50C290 74 340 80 372 62" fill="none" stroke="#D99B7A" stroke-width="4" stroke-linecap="round"/>
  <path d="M48 -12L0 0 48 12z" fill="#222"/><rect x="48" y="-17" width="300" height="34" rx="16" fill="#151515"/><rect x="96" y="-17" width="14" height="34" fill="#8d8d8d"/><rect x="300" y="-17" width="6" height="34" fill="#3a3a3a"/>
  <path d="M60 -9H280" stroke="#4a4a4a" stroke-width="4" stroke-linecap="round"/>
  ${finger('M330 -74C290 -78 200 -64 140 -22', 42)}
  ${finger('M350 62C290 74 210 62 150 28', 40)}
  <ellipse cx="128" cy="-18" rx="19" ry="11" fill="#FBE3D3" stroke="${SKD}" stroke-width="3" transform="rotate(-30 128 -18)"/>
  <ellipse cx="141" cy="30" rx="17" ry="10" fill="#FBE3D3" stroke="${SKD}" stroke-width="3" transform="rotate(35 141 30)"/>
</g>`;
function penPos(t) {
  if (!penSegs.length) return { ...REST, v: 0 };
  let k = -1; for (let i = 0; i < penSegs.length; i++) if (penSegs[i].t0 <= t) k = i; else break;   // penSegs sorted by t0 below
  const ease = u => u * u * (3 - 2 * u), lerp = (a, b, u) => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u });
  const NEAR = 1.0, APP = .45;
  if (k >= 0) {
    const s = penSegs[k];
    if (t <= s.t1) { const pr = (t - s.t0) / Math.max(1e-3, s.t1 - s.t0); return { ...ctmPt(s.p, s.L * Math.min(1, pr)), v: 1 }; }
    const nx = penSegs[k + 1], gap = nx ? nx.t0 - s.t1 : 99;
    if (gap <= NEAR) { const d = Math.min(.4, Math.max(.1, gap - .05)), u = Math.min(1, Math.max(0, (t - (nx.t0 - d)) / d)); return { ...lerp(s.b, nx.a, ease(u)), v: 1 }; }
    const u = Math.min(1, Math.max(0, (t - s.t1 - .15) / .35)); if (u < 1 && t < s.t1 + .5) return { ...lerp(s.b, REST, ease(u)), v: 1 };
    if (nx && t > nx.t0 - APP) { const u2 = Math.min(1, (t - (nx.t0 - APP)) / APP); return { ...lerp(REST, nx.a, ease(u2)), v: 1 }; }
    return { ...REST, v: 0 };
  }
  const f = penSegs[0]; if (t > f.t0 - APP) { const u = Math.min(1, (t - (f.t0 - APP)) / APP); return { ...lerp(REST, f.a, ease(u)), v: 1 }; }
  return { ...REST, v: 0 };
}
penSegs.sort((a, b) => a.t0 - b.t0);
window.seek = t => {
  tl.time(t, false);
  const p = penPos(t), jx = Math.sin(t * 47) * 1.4, jy = Math.cos(t * 53) * 1.4;
  hg.setAttribute('transform', `translate(${(p.x + jx).toFixed(1)},${(p.y + jy).toFixed(1)})`);
  document.getElementById('hand').style.opacity = t > 55.35 ? 0 : 1;
};
window.DURATION = 57.0; window.ready = true;
})();
