/* lib.js - reusable engine. Deterministic GSAP timeline; every element is keyed to word timings (window.TRANSCRIPT).
   Provides: tl, stage, cue(), wd()/ts() word lookup, icon set I/ico(), card(), pop(), fade(), draw(), hide(), buildCaptions(), finish(). */
const TR = window.TRANSCRIPT, W = TR.words;
const tl = gsap.timeline({ paused: true });
const stage = document.getElementById('stage');
window.CUES = [];
const cue = (t, type, v = 1) => window.CUES.push({ t: +t.toFixed(3), type, v });
const wd = (txt, nth = 0, after = 0) => {
  const m = W.filter(w => w.start >= after - 1e-6 && w.text.includes(txt));
  if (!m[nth]) throw new Error('word not found: ' + txt);
  return m[nth];
};
const ts = (txt, nth = 0, after = 0) => wd(txt, nth, after).start;

/* ---------- icon set (64px grid, 3.2 stroke) ---------- */
const I = {
  drop: '<path d="M32 7C32 7 15 27 15 40a17 17 0 0 0 34 0C49 27 32 7 32 7z"/><path d="M24 42a8 8 0 0 0 8 8"/>',
  sparkle: '<path d="M32 6c2 14 8 20 22 26-14 6-20 12-22 26-2-14-8-20-22-26 14-6 20-12 22-26z"/>',
  bottle: '<rect x="19" y="27" width="26" height="31" rx="7"/><path d="M27 27v-8h10v8"/><path d="M25 19h18l3-5H33"/><path d="M19 40h26"/>',
  tube: '<path d="M21 8h22l-2 12H23z"/><path d="M23 20h18v33c0 3-2 5-5 5H28c-3 0-5-2-5-5z"/><path d="M29 32h6M29 40h6"/>',
  jar: '<rect x="12" y="27" width="40" height="28" rx="8"/><rect x="10" y="14" width="44" height="13" rx="5"/><path d="M22 41h20"/>',
  dropper: '<path d="M26 6h12v12H26z"/><path d="M32 18v8"/><rect x="21" y="26" width="22" height="32" rx="7"/><path d="M21 42h22"/>',
  sun: '<circle cx="32" cy="32" r="10"/><path d="M32 8v6M32 50v6M8 32h6M50 32h6M15 15l4 4M45 45l4 4M49 15l-4 4M19 45l-4 4"/>',
  shield: '<path d="M32 6l21 8v17c0 14-10 23-21 27C21 54 11 45 11 31V14z"/><path d="M22 32l8 8 14-17"/>',
  check: '<path d="M14 34l12 12 24-26"/>',
  x: '<path d="M18 18l28 28M46 18L18 46"/>',
  flask: '<path d="M27 7h10M29 7v18L13 51c-2 4 0 8 5 8h28c5 0 7-4 5-8L35 25V7"/><path d="M20 42h24"/>',
  info: '<circle cx="32" cy="32" r="23"/><path d="M32 29v14M32 21v.5"/>',
  pump: '<rect x="19" y="30" width="26" height="28" rx="7"/><path d="M32 30V17M24 17h16"/><path d="M32 4v7M28 8l4 4 4-4"/>',
  chat: '<path d="M10 14h44a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H30L18 58V48h-8a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z"/><path d="M20 28h24M20 38h14"/>',
  face: '<circle cx="32" cy="32" r="23"/><path d="M23 27v2M41 27v2M23 39c5 6 13 6 18 0"/>',
  heart: '<path d="M32 56C9 40 6 22 19 15c6-3 11 0 13 5 2-5 7-8 13-5 13 7 10 25-13 41z"/>',
  flame: '<path d="M32 6c2 12 15 17 15 33a15 15 0 0 1-30 0c0-8 4-12 8-17 1 5 3 7 5 8 0-8-1-14 2-24z"/>',
  star: '<path d="M32 6l7.5 16.5 18 2-13.5 12 4 17.8L32 45l-16 9.3 4-17.8L6.5 24.5l18-2z"/>',
  box: '<path d="M32 6l23 12v28L32 58 9 46V18z"/><path d="M9 18l23 12 23-12M32 30v28"/>',
  factory: '<path d="M8 56V26l16 9V26l16 9V14h16v42z"/><path d="M20 46h6M34 46h6M46 46h4"/>',
  plus: '<path d="M32 12v40M12 32h40"/>',
  play: '<path d="M22 14l30 18-30 18z"/>',
  arrow: '<path d="M12 32h40M38 18l14 14-14 14"/>',
};
const ico = (n, st = '') => `<svg class="ic" viewBox="0 0 64 64" style="${st}">${I[n]}</svg>`;

/* ---------- helpers ---------- */
const $q = (c, s) => c.querySelector(s), $a = (c, s) => [...c.querySelectorAll(s)];
function card(t0, t1, { y = 235, h = 420, w = 900, cls = '', html }) {
  const el = document.createElement('div');
  el.className = 'card ' + cls;
  Object.assign(el.style, { top: y + 'px', height: h + 'px', width: w + 'px', left: (1080 - w) / 2 + 'px' });
  el.innerHTML = html + '<div class="sheen"></div>';
  stage.appendChild(el);
  tl.fromTo(el, { opacity: 0, y: 46, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .55, ease: 'expo.out', immediateRender: false }, t0);
  tl.fromTo($q(el, '.sheen'), { opacity: 1, left: '-40%' }, { left: '125%', duration: .9, ease: 'power2.inOut', immediateRender: false }, t0 + .08);
  tl.to(el, { opacity: 0, y: -26, scale: .985, duration: .22, ease: 'power2.in' }, t1);
  cue(t0, 'whoosh', .8);
  return el;
}
const pop = (el, t, { s = .6, y = 14, d = .42, ease = 'back.out(2.2)', snd = 'pop', v = 1 } = {}) => {
  tl.fromTo(el, { opacity: 0, scale: s, y }, { opacity: 1, scale: 1, y: 0, duration: d, ease, immediateRender: false }, t);
  if (snd) cue(t, snd, v);
};
const fade = (el, t, d = .35) => tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: d, immediateRender: false }, t);
const draw = (path, t, d = .6, ease = 'power2.inOut') => {
  const L = path.getTotalLength();
  gsap.set(path, { strokeDasharray: L, strokeDashoffset: L });
  tl.to(path, { strokeDashoffset: 0, duration: d, ease }, t);
};
const hide = (el, t, d = .2) => tl.to(el, { opacity: 0, duration: d }, t);

/* ---------- captions (balanced chunks, active-word highlight, key-word pills) ---------- */
function buildCaptions() {
{
  const caps = document.getElementById('caps');
  TR.chunks.forEach((ids, ci) => {
    const el = document.createElement('div'); el.className = 'chunk';
    el.innerHTML = ids.map(i => `<span class="w${W[i].key ? ' k' : ''}" data-i="${i}"><span class="t">${W[i].text}</span></span>`).join('');
    caps.appendChild(el);
    const t0 = W[ids[0]].start - .03, last = W[ids[ids.length - 1]];
    const nx = ci + 1 < TR.chunks.length ? W[TR.chunks[ci + 1][0]].start - .03 : 1e9;
    const t1 = Math.min(last.end + .28, nx);
    tl.fromTo(el, { opacity: 0, y: 20, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .14, ease: 'power2.out', immediateRender: false }, t0);
    tl.set(el, { opacity: 0 }, t1);
    ids.forEach(i => {
      const w = $q(el, `[data-i="${i}"]`), t = $q(w, '.t');
      if (!W[i].key) { tl.set(t, { color: '#FF8A7C' }, W[i].start); tl.set(t, { color: '#FFFFFF' }, W[i].end); }
      else { tl.to(w, { backgroundColor: '#FF6F61', duration: .08 }, W[i].start); tl.to(w, { backgroundColor: '#D9594C', duration: .2 }, W[i].end); }
      tl.to(w, { scale: 1.1, duration: .09, ease: 'power2.out' }, W[i].start);
      tl.to(w, { scale: 1, duration: .16, ease: 'power2.inOut' }, W[i].start + .09);
    });
  });
}
}

function finish(duration) {
  window.seek = t => { tl.time(t, false); };
  window.DURATION = duration;
  window.ready = true;
}
