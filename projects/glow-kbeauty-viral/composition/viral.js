/* viral.js - Korean "sticker-pop" short-form look. No footage: pastel backdrop with floating hearts/sparkles, kawaii cosmetics stickers with white
   outlines that bounce in on the spoken word, bubble text, ranking cards, outlined variety-show captions. Seekable GSAP timeline + deterministic idle motion. */
(async () => {
await Promise.all(['800 40px "Baloo Bhaijaan 2"', '400 40px "Bebas Neue"', '900 40px Cairo'].map(f => document.fonts.load(f, 'Aa أب')));
await document.fonts.ready;
const TR = window.TRANSCRIPT, W = TR.words, NS = 'http://www.w3.org/2000/svg';
const tl = gsap.timeline({ paused: true });
const stage = document.getElementById('stage'), art = document.getElementById('art'), fx = document.getElementById('fx');
const SHIFT = 140; art.setAttribute('transform', `translate(0,${SHIFT})`);
window.CUES = [];
const cue = (t, type, v = 1) => window.CUES.push({ t: +t.toFixed(3), type, v });
const wd = (txt, nth = 0, after = 0) => { const m = W.filter(w => w.start >= after - 1e-6 && w.text.includes(txt)); if (!m[nth]) throw new Error('word not found: ' + txt); return m[nth]; };
const ts = (txt, nth = 0, after = 0) => wd(txt, nth, after).start;
const PLUM = '#5B3A5E', PINK = '#FF5C8A', ROSE = '#FF9EBB', YEL = '#FFE066', MINT = '#7ADFC4', LAV = '#C7B8FF', RED = '#E83A4B';
const svg = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const div = (cls, css = {}, parent = stage) => { const e = document.createElement('div'); e.className = cls; Object.assign(e.style, css); parent.appendChild(e); return e; };
let seed = 7; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const C = (cx, cy, r) => `M${cx} ${cy - r}a${r} ${r} 0 1 0 .1 0z`;

/* ---------------- cosmetics sticker library (100x100 boxes) ---------------- */
const HEART = 'M50 88C10 60 6 30 28 19C40 13 48 21 50 29C52 21 60 13 72 19C94 30 90 60 50 88z';
const STAR = 'M50 6L62 36 95 38 70 59 79 92 50 73 21 92 30 59 5 38 38 36z';
const ICONS = {
  lipstick: { kw: [50, 77], s: [{ d: 'M32 56h36v32a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6z', f: '#FF7AA8' }, { d: 'M30 44h40v14H30z', f: '#FFD166' }, { d: 'M37 44V24L55 8q8 6 8 18v18z', f: '#E63B6F' }] },
  lipgloss: { kw: null, s: [{ d: 'M40 34h20v50a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z', f: '#FFB3C6' }, { d: 'M42 8h16v26H42z', f: '#FF5C8A' }, { d: 'M50 76q-9-8-5-13q4-3 5 2q1-5 5-2q4 5-5 13z', f: '#fff', w: 3 }] },
  nailpolish: { kw: [50, 74], s: [{ d: 'M26 50h48a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V58a8 8 0 0 1 8-8z', f: '#C7B8FF' }, { d: 'M40 12h20v38H40z', f: '#5B3A5E' }, { d: 'M28 62v8', w: 4, c: '#fff' }] },
  compact: { kw: null, s: [{ d: C(50, 56, 40), f: '#FFC9DD' }, { d: C(50, 56, 28), f: '#D8F1FF' }, { d: 'M36 52q6-10 18-12', w: 5, c: '#fff' }, { d: 'M68 68l6 6', w: 5, c: '#fff' }] },
  cushion: { kw: null, s: [{ d: C(50, 56, 40), f: '#FFE0B8' }, { d: C(50, 56, 27), f: '#F2B58F' }, { d: 'M50 70q-9-8-5-12q4-3 5 2q1-5 5-2q4 4-5 12z', f: '#fff', w: 3 }] },
  palette: { kw: null, s: [{ d: 'M8 22h84a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6z', f: '#EBD9C8' }, { d: C(26, 42, 10), f: '#FFB3C6' }, { d: C(50, 42, 10), f: '#C7B8FF' }, { d: C(74, 42, 10), f: '#7ADFC4' }, { d: C(26, 64, 10), f: '#FFD166' }, { d: C(50, 64, 10), f: '#FF9EBB' }, { d: C(74, 64, 10), f: '#9AD3F2' }] },
  brush: { kw: null, s: [{ d: 'M64 40L92 10L98 16L70 46z', f: '#FFD166' }, { d: 'M52 48L64 38L72 46L62 58z', f: '#C9C9DD' }, { d: 'M30 76Q16 56 52 48L62 58Q54 88 30 76z', f: '#FFB3C6' }] },
  blushbrush: { kw: null, s: [{ d: C(34, 38, 24), f: '#FF9EBB' }, { d: 'M42 54l10-8 12 12-10 8z', f: '#C9C9DD' }, { d: 'M60 58L92 90L84 98L52 66z', f: '#FFD166' }] },
  mascara: { kw: [44, 66], s: [{ d: 'M32 38h24v52a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6z', f: '#FF8FB5' }, { d: 'M30 8h28v30H30z', f: '#5B3A5E' }, { d: 'M72 18h10v62H72z', f: '#fff' }, { d: 'M66 30h6M82 30h6M66 42h6M82 42h6M66 54h6M82 54h6', w: 4 }] },
  perfume: { kw: [50, 72], s: [{ d: 'M22 46h56a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8V54a8 8 0 0 1 8-8z', f: '#CDEBFF' }, { d: 'M42 46V34h16v12z', f: '#FFD166' }, { d: 'M38 14h24v20H38z', f: '#FF5C8A' }] },
  sheetmask: { kw: null, s: [{ d: 'M50 6C80 6 92 30 87 56C82 82 66 96 50 96C34 96 18 82 13 56C8 30 20 6 50 6z', f: '#F7F2FF' }, { d: 'M26 40q9-7 18 0q-9 7-18 0z', f: '#fff', w: 4 }, { d: 'M56 40q9-7 18 0q-9 7-18 0z', f: '#fff', w: 4 }, { d: 'M38 72q12 9 24 0q-12-7-24 0z', f: '#fff', w: 4 }, { d: 'M30 24q20-10 40 0', w: 3, c: '#C7B8FF' }] },
  cottonpad: { kw: null, s: [{ d: C(50, 52, 40), f: '#FFF6E5' }, { d: C(50, 52, 28), c: '#E9CFAE', w: 3 }, { d: 'M82 8v16M74 16h16', w: 5, c: '#FFB703' }] },
  sunscreen: { kw: null, s: [{ d: 'M32 12h36l-4 18H36z', f: '#FF8FB5' }, { d: 'M34 30h32v58a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z', f: '#FFE066' }, { d: C(50, 62, 10), f: '#FF9F43' }, { d: 'M50 44v4M50 76v4M32 62h4M64 62h4M37 49l3 3M60 72l3 3M63 49l-3 3M40 72l-3 3', w: 4, c: '#FF9F43' }] },
  foam: { kw: [50, 68], s: [{ d: 'M32 12h36l-4 18H36z', f: '#5B3A5E' }, { d: 'M34 30h32v58a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z', f: '#9AD3F2' }, { d: C(78, 24, 9), f: '#fff', w: 4 }, { d: C(88, 44, 6), f: '#fff', w: 4 }, { d: C(20, 40, 7), f: '#fff', w: 4 }] },
  guasha: { kw: null, s: [{ d: 'M50 90C20 70 8 46 20 30C32 14 46 24 50 34C54 24 68 14 80 30C92 46 80 70 50 90z', f: '#BDEBD6' }, { d: 'M26 36q4-8 12-8', w: 4, c: '#fff' }] },
  dropper: { kw: [50, 70], s: [{ d: 'M40 6h20v22H40z', f: '#FF8FB5' }, { d: 'M43 28h14v9H43z', f: '#E8E8F5' }, { d: 'M29 37h42a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H29a6 6 0 0 1-6-6V43a6 6 0 0 1 6-6z', f: '#FFE9A8' }] },
  jar: { kw: [50, 68], s: [{ d: 'M18 26h64a4 4 0 0 1 4 4v14H14V30a4 4 0 0 1 4-4z', f: '#FF8FB5' }, { d: 'M16 44h68v36a9 9 0 0 1-9 9H25a9 9 0 0 1-9-9z', f: '#FFD9E6' }] },
  bottle: { kw: [50, 72], s: [{ d: 'M26 40h48a7 7 0 0 1 7 7v42a7 7 0 0 1-7 7H26a7 7 0 0 1-7-7V47a7 7 0 0 1 7-7z', f: '#CDEBFF' }, { d: 'M41 40V28h18v12z', f: '#E8E8F5' }, { d: 'M37 28v-8h27l8-4v10l-8 2z', f: '#FF8FB5' }] },
  tube: { kw: [50, 66], s: [{ d: 'M36 8h28l-2 14H38z', f: '#FF8FB5' }, { d: 'M38 22h24v64a6 6 0 0 1-6 6H44a6 6 0 0 1-6-6z', f: '#FFB88C' }] },
  pumpb: { kw: [50, 74], s: [{ d: 'M24 44h52a7 7 0 0 1 7 7v38a7 7 0 0 1-7 7H24a7 7 0 0 1-7-7V51a7 7 0 0 1 7-7z', f: '#C9F1DD' }, { d: 'M50 44V28M36 28h28', w: 7 }, { d: 'M50 4v14M42 12l8 8 8-8', w: 6, c: '#E83A4B' }] },
  gift: { kw: null, s: [{ d: 'M12 40h76v50H12z', f: '#FFC4D9' }, { d: 'M8 28h84v16H8z', f: '#FF8FB5' }, { d: 'M44 28h12v62H44z', f: '#FFE066' }, { d: 'M50 28Q30 4 24 20Q22 30 50 28Q78 30 76 20Q70 4 50 28z', f: '#FFE066' }] },
  heart: { kw: [50, 50], s: [{ d: HEART, f: '#FF6B8E' }, { d: 'M26 34q6-8 14-6', w: 4, c: '#fff' }] },
  star: { kw: [50, 56], s: [{ d: STAR, f: '#FFE066' }] },
  flame: { kw: null, s: [{ d: 'M50 4C54 26 80 34 80 62a30 30 0 0 1-60 0C20 46 32 40 36 26C40 40 46 38 50 4z', f: '#FF9F6B' }, { d: 'M50 50C54 60 62 62 62 74a12 12 0 0 1-24 0C38 66 46 62 50 50z', f: '#FFE066', w: 4 }] },
  shield: { kw: null, s: [{ d: 'M50 4L90 20V50C90 75 72 91 50 98C28 91 10 75 10 50V20z', f: '#BDEBD6' }, { d: 'M30 50l14 14 26-30', w: 9, c: '#0E8F5A' }] },
  chat: { kw: [50, 40], s: [{ d: 'M14 12h72a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H46L26 92V70H14a8 8 0 0 1-8-8V20a8 8 0 0 1 8-8z', f: '#fff' }] },
  flask: { kw: null, s: [{ d: 'M38 6h24M42 6v28L14 82a8 8 0 0 0 7 12h58a8 8 0 0 0 7-12L58 34V6', f: '#F0F8FF' }, { d: 'M24 68h52l8 14a6 6 0 0 1-5 10H21a6 6 0 0 1-5-10z', f: '#BFA8FF', w: 4 }] },
  info: { kw: null, s: [{ d: C(50, 50, 44), f: '#D3E0FF' }, { d: 'M50 44v28M50 28v2', w: 9 }] },
  factory: { kw: null, s: [{ d: 'M6 94V42l26 15V42l26 15V24h38v70z', f: '#D9DEF0' }, { d: 'M62 24V6h12v18', f: '#B7BED6' }, { d: 'M24 78h10M46 78h10M68 78h10', w: 5 }] },
  store: { kw: null, s: [{ d: 'M12 42h76v52H12z', f: '#FFF0D6' }, { d: 'M6 42L16 12H84L94 42z', f: '#FF8FB5' }, { d: 'M42 66h18v28H42z', f: '#fff' }, { d: 'M18 56h18v14H18z', f: '#D3EFFF', w: 4 }, { d: 'M66 56h18v14H66z', f: '#D3EFFF', w: 4 }] },
  face: { kw: [50, 50], s: [{ d: C(50, 50, 44), f: '#FFE3D0' }] },
  play: { kw: null, s: [{ d: 'M8 12h84a6 6 0 0 1 6 6v64a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z', f: '#fff' }, { d: 'M40 30L72 50 40 70z', f: '#FF5C8A' }] },
  eyes: { kw: null, s: [{ d: C(30, 50, 22), f: '#fff' }, { d: C(72, 50, 22), f: '#fff' }, { d: C(36, 54, 9), f: '#5B3A5E' }, { d: C(78, 54, 9), f: '#5B3A5E' }] },
  burst: { kw: null, s: [{ d: 'M50 2L60 20 80 10 80 32 98 40 82 54 94 74 72 72 64 94 50 80 36 94 28 72 6 74 18 54 2 40 20 32 20 10 40 20z', f: '#FFE066' }] },
  qmark: { kw: null, s: [{ d: 'M26 30C26 2 80 2 80 30C80 52 52 54 52 74', w: 14, c: '#FF5C8A' }, { d: 'M52 94v.5', w: 16, c: '#FF5C8A' }] },
  check: { kw: null, s: [{ d: C(50, 50, 44), f: '#7ADFC4' }, { d: 'M28 52l15 15 29-33', w: 11, c: '#fff' }] },
  cross: { kw: null, s: [{ d: C(50, 50, 44), f: '#FF6B7D' }, { d: 'M32 32L68 68M68 32L32 68', w: 11, c: '#fff' }] },
  plus: { kw: null, s: [{ d: 'M50 10v80M10 50h80', w: 16, c: '#FF5C8A' }] },
  arrowR: { kw: null, s: [{ d: 'M8 50H88M64 24L90 50 64 76', w: 12, c: '#FF5C8A' }] },
  arrowL: { kw: null, s: [{ d: 'M92 50H12M36 24L10 50 36 76', w: 12, c: '#FF5C8A' }] },
  arrowUp: { kw: null, s: [{ d: 'M10 90L88 20M58 16H90V48', w: 13, c: '#FF5C8A' }] },
  spark: { kw: null, s: [{ d: 'M50 4L58 42 96 50 58 58 50 96 42 58 4 50 42 42z', f: '#FFE066' }] },
  drop: { kw: [50, 66], s: [{ d: 'M50 6C50 6 18 44 18 64a32 32 0 0 0 64 0C82 44 50 6 50 6z', f: '#BFE6FF' }] },
};
function faceShapes(kx, ky) { return [{ d: C(kx - 11, ky, 3.4), f: PLUM, w: 1 }, { d: C(kx + 11, ky, 3.4), f: PLUM, w: 1 }, { d: `M${kx - 5} ${ky + 5}q5 5 10 0`, w: 3.2 }, { d: `M${kx - 21} ${ky + 7}h7M${kx + 14} ${ky + 7}h7`, w: 4, c: '#FF8FB0' }]; }

/* ---------------- floating hearts / stars / sparkles ---------------- */
const parts = [];
const PCOL = ['#FF9EBB', '#FFD166', '#C7B8FF', '#7ADFC4', '#fff', '#FFB3C6'];
for (let i = 0; i < 30; i++) {
  const k = i % 4, sz = 16 + rnd() * 26, g = svg('g', {}, fx), col = PCOL[Math.floor(rnd() * PCOL.length)];
  const d = k === 0 ? HEART : k === 1 ? STAR : k === 2 ? 'M50 4L58 42 96 50 58 58 50 96 42 58 4 50 42 42z' : C(50, 50, 30);
  svg('path', { d, fill: col, stroke: '#fff', 'stroke-width': 7, 'stroke-linejoin': 'round', transform: `translate(${-sz / 2},${-sz / 2}) scale(${sz / 100})`, opacity: .85 }, g);
  parts.push({ g, x0: rnd() * 1080, y0: rnd() * 2000, v: 22 + rnd() * 40, amp: 14 + rnd() * 28, ph: rnd() * 6.28, rs: (rnd() - .5) * 60 });
}

/* ---------------- scene scaffolding ---------------- */
const idle = [];
function scene(t0, t1) {
  const g = svg('g', { opacity: 0 }, art), wrap = div('sc', { opacity: 0, transform: `translateY(${SHIFT}px)` });
  tl.set([g, wrap], { opacity: 1 }, t0); tl.to([g, wrap], { opacity: 0, duration: .22, ease: 'power1.in' }, t1);
  cue(t0 - .03, 'whoosh', .5); return { g, wrap, t0, t1 };
}
function burst(sc, cx, cy, t, n = 7, R = 130) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.283 + rnd(), r = R * (.7 + rnd() * .6), sz = 16 + rnd() * 16;
    const p = svg('path', { d: i % 2 ? 'M50 4L58 42 96 50 58 58 50 96 42 58 4 50 42 42z' : HEART, fill: i % 2 ? '#FFE066' : '#FF9EBB', stroke: '#fff', 'stroke-width': 8, 'stroke-linejoin': 'round', opacity: 0, transform: `translate(${-sz / 2},${-sz / 2}) scale(${sz / 100})` }, svg('g', { transform: `translate(${cx},${cy})` }, sc.g));
    const gp = p.parentNode;
    tl.fromTo(gp, { x: 0, y: 0, scale: .3 }, { x: Math.cos(a) * r, y: Math.sin(a) * r, scale: 1, duration: .7, ease: 'power2.out', immediateRender: false }, t);
    tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: .12, immediateRender: false }, t); tl.to(p, { opacity: 0, duration: .3 }, t + .45);
  }
}
/* kawaii cosmetics sticker: white die-cut outline + soft shadow, bounces in on its word, then idles with a tiny wiggle */
function sticker(sc, name, { x, y, s = 2, t, rot = 0, wig = 3.2, sparks = true, snd = 'pop', v = .55 }) {
  { const s0 = s; s = s * 1.18; x -= 50 * (s - s0); y -= 50 * (s - s0); }
  const I = ICONS[name], shapes = I.s.concat(I.kw ? faceShapes(I.kw[0], I.kw[1]) : []);
  const outer = svg('g', { transform: `translate(${x},${y})` }, sc.g), pop = svg('g', {}, outer), wg = svg('g', {}, pop);
  const body = svg('g', { transform: `scale(${s})`, style: 'filter:drop-shadow(0 7px 7px rgba(91,58,94,.28))' }, wg);
  const bd = svg('g', {}, body);
  I.s.forEach(sh => svg('path', { d: sh.d, fill: '#fff', stroke: '#fff', 'stroke-width': 20 / s, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, bd));
  shapes.forEach(sh => svg('path', { d: sh.d, fill: sh.f || 'none', stroke: sh.c || PLUM, 'stroke-width': (sh.w || 5) / s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body));
  const o = `${50 * s} ${50 * s}`; gsap.set(pop, { opacity: 0, scale: 0, svgOrigin: o });
  tl.to(pop, { opacity: 1, scale: 1, rotation: rot, duration: .55, ease: 'back.out(2.6)', svgOrigin: o }, t);
  idle.push({ el: wg, t0: t + .6, cx: 50 * s, cy: 50 * s, amp: wig, ph: rnd() * 6.28 });
  if (snd) cue(t, snd, v); if (sparks) burst(sc, x + 50 * s, y + 50 * s, t + .05, 5, 50 * s + 40);
  return { t0: t, pop, cx: x + 50 * s, cy: y + 50 * s };
}
const shake = (st, t, n = 3, a = 9) => tl.to(st.pop, { rotation: `+=${a}`, duration: .08, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t);
/* bubble text (pill) */
function bubble(sc, txt, { x, y, w = 900, size = 64, t, cls = '', rot = -2, html = false }) {
  const wr = div('bubw', { left: x + 'px', top: y + 'px', width: w + 'px', transformOrigin: '50% 50%' }, sc.wrap);
  const b = div('bub ' + cls, { fontSize: size + 'px' }, wr); if (html) b.innerHTML = txt; else b.textContent = txt;
  tl.fromTo(wr, { opacity: 0, scale: .35, y: 40, rotation: rot - 8 }, { opacity: 1, scale: 1, y: 0, rotation: rot, duration: .5, ease: 'back.out(2.2)', immediateRender: false }, t); cue(t, 'tick', .8);
  return wr;
}
function pill(sc, txt, { x, y, t, w, size }) {
  const p = div('pill', { left: x + 'px', top: y + 'px', ...(w ? { width: w + 'px', textAlign: 'center', paddingLeft: '8px', paddingRight: '8px' } : {}), ...(size ? { fontSize: size + 'px' } : {}) }, sc.wrap); p.textContent = txt;
  tl.fromTo(p, { opacity: 0, scale: .4, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: .45, ease: 'back.out(2.4)', immediateRender: false }, t); return p;
}

/* ---------------- logo watermark ---------------- */
const wm = document.getElementById('wm');
tl.to(wm, { opacity: .95, duration: .5 }, .6).to(wm, { opacity: 0, duration: .2 }, 55.25);

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

/* ---------------- outro ---------------- */
{ const o = document.getElementById('outro'), lg = o.querySelector('img');
  tl.to(o, { clipPath: 'inset(0% 0 0 0)', duration: .55, ease: 'power4.inOut' }, 55.38);
  tl.fromTo(lg, { opacity: 0, scale: .9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: .8, ease: 'expo.out', immediateRender: false }, 55.8);
  tl.to(lg, { scale: 1.04, duration: 1.2, ease: 'sine.inOut' }, 56.0); cue(55.38, 'swell', 1); cue(55.85, 'chime', 1); }

/* ---------------- captions: variety-show style ---------------- */
{ const caps = document.getElementById('caps');
  TR.chunks.forEach((ids, ci) => {
    const el = document.createElement('div'); el.className = 'chunk';
    el.innerHTML = ids.map(i => `<span class="w${W[i].key ? ' k' : ''}" data-i="${i}"><span class="t">${W[i].text}</span></span>`).join(''); caps.appendChild(el);
    const t0 = W[ids[0]].start - .03, last = W[ids[ids.length - 1]], nx = ci + 1 < TR.chunks.length ? W[TR.chunks[ci + 1][0]].start - .03 : 1e9, t1 = Math.min(last.end + .28, nx);
    tl.fromTo(el, { opacity: 0, y: 26, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .2, ease: 'back.out(2.4)', immediateRender: false }, t0); tl.set(el, { opacity: 0 }, t1);
    ids.forEach(i => { const w = el.querySelector(`[data-i="${i}"]`), t = w.querySelector('.t');
      if (!W[i].key) { tl.set(t, { color: PINK }, W[i].start); tl.set(t, { color: '#FFFFFF' }, W[i].end); } else { tl.set(t, { color: '#FFFFFF' }, W[i].start); tl.set(t, { color: YEL }, W[i].end); }
      tl.to(w, { scale: 1.16, rotation: -3, duration: .1, ease: 'power2.out' }, W[i].start); tl.to(w, { scale: 1, rotation: 0, duration: .2, ease: 'back.out(3)' }, W[i].start + .1); }); }); }

window.seek = t => {
  tl.time(t, false);
  parts.forEach(p => { const H = 2000, y = (((p.y0 - p.v * t) % H) + H) % H - 40, x = p.x0 + p.amp * Math.sin(t * .8 + p.ph); p.g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(p.rs * t).toFixed(1)})`); });
  idle.forEach(o => { if (t > o.t0) { const a = o.amp * Math.sin((t - o.t0) * 3.1 + o.ph), dy = 5 * Math.sin((t - o.t0) * 2.3 + o.ph); o.el.setAttribute('transform', `translate(0,${dy.toFixed(2)}) rotate(${a.toFixed(2)} ${o.cx} ${o.cy})`); } });
};
window.DURATION = 57.0; window.ready = true;
})();
