/* scene.js - THIS video's creative: camera moves, watermark, scenes, outro. Everything is timed from word lookups (ts('word')).
   Worked example: Glow Cosmetics K-beauty announcement (Egyptian Arabic). Replace the scenes, keep the helpers. */

/* ---------- camera: slow drifts + punch-ins on sentence starts ---------- */
const cam = document.getElementById('cam');
[[0, 3.6, 1.05, 'none'], [3.84, 4.2, 1.13, 'power3.inOut'], [4.2, 5.0, 1.15, 'none'], [5.08, 5.6, 1.03, 'power3.inOut'], [5.6, 10.8, 1.07, 'none'],
 [10.88, 11.25, 1.12, 'power3.inOut'], [11.25, 16.5, 1.15, 'none'], [16.64, 17.1, 1.04, 'power3.inOut'], [17.1, 21.1, 1.07, 'none'],
 [21.24, 21.6, 1.13, 'power3.inOut'], [21.6, 24.3, 1.16, 'none'], [24.44, 24.9, 1.03, 'power3.inOut'], [24.9, 30.5, 1.07, 'none'],
 [30.64, 31.0, 1.11, 'power3.inOut'], [31.0, 34.0, 1.13, 'none'], [34.18, 34.6, 1.03, 'power3.inOut'], [34.6, 38.3, 1.06, 'none'],
 [38.49, 38.9, 1.12, 'power3.inOut'], [38.9, 45.4, 1.15, 'none'], [45.89, 46.4, 1.04, 'power3.inOut'], [46.4, 52.6, 1.08, 'none'],
 [52.77, 53.2, 1.14, 'power3.inOut'], [53.2, 55.4, 1.19, 'none']
].forEach(([a, b, s, e], i) => { tl.to(cam, { scale: s, duration: b - a, ease: e }, a); if (e !== 'none') cue(a, 'zoom', .7); });

/* ---------- watermark ---------- */
const wm = document.getElementById('wm');
tl.to(wm, { opacity: .92, duration: .6 }, .7).to(wm, { opacity: 0, duration: .25 }, 6.1).to(wm, { opacity: .92, duration: .5 }, 8.6).to(wm, { opacity: 0, duration: .2 }, 55.25);

/* =====================================================================
   S1  hook: K-BEAUTY (0.35 - 2.5)  then "which one?" (2.55 - 3.75)
   ===================================================================== */
{
  const c = card(.35, 2.5, { y: 260, h: 290, html: `
    <div class="row" style="gap:40px;height:100%">
      <div class="tile lit k1" style="width:190px;height:190px;padding:44px;border-radius:48px">${ico('drop')}
        <div class="sp s1 hid" style="position:absolute;right:-18px;top:-18px;width:54px;height:54px;color:#fff">${ico('sparkle')}</div>
        <div class="sp s2 hid" style="position:absolute;left:-14px;bottom:-10px;width:36px;height:36px;color:#fff">${ico('sparkle')}</div></div>
      <div style="flex:1;text-align:right">
        <div class="eyebrow" style="justify-content:flex-end"><i></i>K-BEAUTY</div>
        <div class="h1" style="margin-top:6px">العناية <span class="acc">الكورية</span></div>
        <div class="sub" style="direction:ltr;text-align:right">Korean Skincare</div></div></div>` });
  pop($q(c, '.k1'), .55, { s: .5 });
  const t = ts('الكورية');
  pop($q(c, '.s1'), t, { s: .2, snd: 'sparkle', v: .8 }); pop($q(c, '.s2'), t + .15, { s: .2, snd: null });
  tl.to($q(c, '.k1'), { rotation: 8, duration: .25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t);
}
{
  const c = card(2.62, 3.75, { y: 260, h: 330, html: `
    <div class="eyebrow" style="justify-content:center"><i></i>WHICH ONE?</div>
    <div class="row" style="gap:44px;justify-content:center;direction:ltr;margin-top:26px;position:relative">
      ${['bottle', 'tube', 'jar'].map(n => `<div class="tile ch" style="width:160px;height:160px">${ico(n)}</div>`).join('')}
      <div class="q hid" style="position:absolute;left:50%;top:-58px;margin-left:-6px;width:98px;height:98px;border-radius:50%;background:var(--coral-d);font:900 68px/98px Cairo;text-align:center;box-shadow:0 12px 36px rgba(217,89,76,.55)">؟</div>
    </div>` });
  const tiles = $a(c, '.ch');
  tiles.forEach((el, i) => {
    const t = 2.95 + i * .26;
    tl.to(el, { scale: 1.1, borderColor: '#FF6F61', backgroundColor: 'rgba(255,111,97,.25)', duration: .16, ease: 'power2.out' }, t);
    tl.to(el, { scale: 1, borderColor: 'rgba(255,255,255,.16)', backgroundColor: 'rgba(255,255,255,.07)', duration: .2 }, t + .2);
    cue(t, 'tick', .7);
  });
  pop($q(c, '.q'), ts('تختار') + .05, { s: .3, y: 24 });
  tl.to($q(c, '.q'), { rotation: 10, duration: .14, yoyo: true, repeat: 3, ease: 'sine.inOut' }, ts('تختار') + .5);
}

/* S2  "watch this video" */
{
  const c = card(3.9, 4.62, { y: 300, h: 130, w: 520, html: `
    <div class="row" style="gap:26px;height:100%;justify-content:center">
      <div class="badge" style="position:relative;width:70px;height:70px;background:var(--coral-d);padding:20px;color:#fff">${ico('play', 'fill:#fff;stroke-width:2')}</div>
      <div class="h2">شوف الفيديو</div></div>` });
  cue(4.0, 'pop', .6);
}

/* S3  brand hero: NEW ADDITION + logo reveal */
{
  const t0 = 6.2, t1 = 8.32;
  const c = card(t0, t1, { y: 250, h: 440, cls: 'brand', html: `
    <div style="text-align:center"><span class="pillk nw hid" style="background:#fff;color:var(--brand)">+ NEW ADDITION</span></div>
    <img class="hero-logo lg" src="../assets/logo_white.png" style="clip-path:inset(0 100% 0 0);opacity:1">` });
  pop($q(c, '.nw'), ts('إضافة'), { s: .5 });
  const tg = ts('Glow', 0, 6);
  tl.fromTo($q(c, '.lg'), { clipPath: 'inset(0 100% 0 0)', scale: 1.08 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: .75, ease: 'power3.out', immediateRender: false }, tg - .05);
  cue(tg - .05, 'thud', 1);
}

/* S4  collection */
{
  const t0 = 8.55, t1 = 10.6;
  const c = card(t0, t1, { y: 245, h: 390, html: `
    <div class="eyebrow"><i></i>KOREAN SKINCARE COLLECTION</div>
    <div class="row" style="direction:ltr;gap:34px;justify-content:center;margin-top:36px">
      ${['bottle', 'tube', 'jar', 'dropper'].map(n => `<div class="tile pt hid" style="width:164px;height:164px">${ico(n)}</div>`).join('')}</div>
    <div class="h2 hid lb" style="text-align:center;margin-top:28px">مجموعة <span class="acc">مميزة</span></div>` });
  $a(c, '.pt').forEach((el, i) => pop(el, t0 + .3 + i * .2, { s: .5, y: 26 }));
  fade($q(c, '.lb'), ts('مميزة') - .05, .3);
  $a(c, '.pt').forEach((el, i) => { const t = ts('مميزة') + i * .14; tl.to(el, { borderColor: '#FF6F61', duration: .2 }, t); tl.to(el, { borderColor: 'rgba(255,255,255,.16)', duration: .3 }, t + .3); });
}

/* S5  brands */
{
  const t0 = 10.95, t1 = 18.7;
  const names = ['COSRX', 'Dr. Althea', 'Axis-Y', '+ MORE'];
  const times = [ts('COSRX'), ts('Dr.Althea'), ts('Axis-Y'), ts('وغيرهم')];
  const c = card(t0, t1, { y: 235, h: 460, html: `
    <div class="eyebrow"><i></i>KOREAN BRANDS</div>
    <div style="display:flex;flex-wrap:wrap;gap:26px;direction:ltr;margin-top:34px;justify-content:center">
      ${names.map((n, i) => `<div class="chip bc" style="width:386px;height:124px;justify-content:space-between"><span class="n">0${i + 1}</span>
        <span class="nm" style="opacity:0;font-size:46px">${n}</span><div class="dash" style="position:absolute;inset:-1.5px;border:2px dashed rgba(255,255,255,.28);border-radius:30px"></div></div>`).join('')}
    </div>` });
  const chips = $a(c, '.bc');
  chips.forEach((el, i) => { tl.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out', immediateRender: false }, t0 + .3 + i * .1); });
  chips.forEach((el, i) => {
    const t = times[i];
    tl.to($q(el, '.dash'), { opacity: 0, duration: .15 }, t);
    tl.to(el, { backgroundColor: i < 3 ? 'rgba(255,111,97,.22)' : 'rgba(255,255,255,.10)', borderColor: i < 3 ? '#FF6F61' : 'rgba(255,255,255,.35)', scale: 1.04, duration: .2, ease: 'power2.out' }, t);
    tl.to(el, { scale: 1, duration: .3, ease: 'power2.inOut' }, t + .2);
    tl.fromTo($q(el, '.nm'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: .35, ease: 'power3.out', immediateRender: false }, t);
    cue(t, i < 3 ? 'tick' : 'pop', 1);
  });
}

/* S6  skincare categories */
{
  const t0 = 19.1, t1 = 20.98;
  const cats = [['tube', 'غسول'], ['dropper', 'سيروم'], ['jar', 'مرطب'], ['sun', 'واقي شمس']];
  const c = card(t0, t1, { y: 245, h: 350, html: `
    <div class="eyebrow"><i></i>SKINCARE · EACH WITH ITS OWN JOB</div>
    <div class="row" style="direction:ltr;gap:30px;justify-content:center;margin-top:30px">
      ${cats.map(([n, l]) => `<div class="cat hid" style="text-align:center"><div class="tile" style="width:168px;height:150px;padding:34px;margin:0 auto"><div class="gl" style="position:absolute;inset:0;border-radius:36px;background:linear-gradient(145deg,var(--coral),var(--coral-d));opacity:0"></div><div style="position:relative;width:100%;height:100%">${ico(n)}</div></div><div class="h2" style="font-size:32px;margin-top:10px">${l}</div></div>`).join('')}
    </div>` });
  $a(c, '.cat').forEach((el, i) => pop(el, t0 + .25 + i * .12, { s: .6, y: 22, snd: i == 0 ? 'pop' : null }));
  $a(c, '.gl').forEach((el, i) => { const t = 19.55 + i * .33; tl.to(el, { opacity: 1, duration: .15 }, t); tl.to(el, { opacity: 0, duration: .25 }, t + .33); cue(t, 'tick', .7); });
}

/* S7  key point: product -> skin match */
{
  const t0 = 21.3, t1 = 24.32;
  const c = card(t0, t1, { y: 235, h: 470, html: `
    <div class="row" style="justify-content:space-between;direction:ltr">
      <span class="pillk kp hid">★ KEY POINT</span><span class="eyebrow" style="font-size:20px"><i></i>MATCH</span></div>
    <div class="row" style="direction:ltr;justify-content:space-between;margin-top:42px;padding:0 10px;position:relative">
      <div class="nd n2 hid" style="text-align:center"><div class="tile lit" style="width:190px;height:190px;border-radius:50%;padding:46px">${ico('face')}</div><div class="h2" style="margin-top:12px">بشرتك</div></div>
      <svg viewBox="0 0 300 40" style="width:300px;height:40px;position:relative;top:-30px;overflow:visible"><path class="ln0" d="M290 20H10" stroke="rgba(255,255,255,.25)" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round" fill="none"/><path class="ln1" d="M290 20H10" stroke="#5EE6B8" stroke-width="5" stroke-linecap="round" fill="none"/><circle class="dt" cx="290" cy="20" r="9" fill="#fff" opacity="0"/></svg>
      <div class="nd n1 hid" style="text-align:center"><div class="tile" style="width:190px;height:190px;border-radius:50%;padding:46px">${ico('bottle')}</div><div class="h2" style="margin-top:12px">المنتج</div></div>
      <div class="ok hid badge" style="left:50%;top:76px;margin-left:-46px;width:92px;height:92px;background:var(--mint);color:#0E1222;padding:22px">${ico('check', 'stroke-width:5')}</div>
    </div>` });
  const tA = ts('الأهم'), tP = ts('المنتج', 0, 21.3), tM = ts('المناسب'), tS = ts('لبشرتنا');
  pop($q(c, '.kp'), tA, { s: .5 });
  pop($q(c, '.n1'), tP, { s: .5, y: 20 });
  draw($q(c, '.ln1'), tM, .55);
  tl.fromTo($q(c, '.dt'), { opacity: 1, attr: { cx: 290 } }, { attr: { cx: 10 }, duration: .55, ease: 'power2.inOut', immediateRender: false }, tM);
  tl.to($q(c, '.dt'), { opacity: 0, duration: .1 }, tM + .56);
  pop($q(c, '.n2'), tS + .1, { s: .5, y: 20 });
  pop($q(c, '.ok'), tS + .55, { s: .2, ease: 'back.out(3)', snd: 'chime' });
}

/* S8  not just trending / popular */
{
  const t0 = 24.5, t1 = 26.68;
  const c = card(t0, t1, { y: 250, h: 290, html: `
    <div class="eyebrow"><i></i>NOT JUST BECAUSE IT'S…</div>
    <div class="row" style="direction:ltr;gap:28px;margin-top:34px;justify-content:center">
      <div class="chip c1" style="width:384px;height:112px;justify-content:center"><span style="width:50px;height:50px;color:var(--coral)">${ico('flame')}</span><span>TRENDING</span><div class="strike"></div></div>
      <div class="chip c2" style="width:384px;height:112px;justify-content:center"><span style="width:50px;height:50px;color:#FFD36B">${ico('star')}</span><span>POPULAR</span><div class="strike"></div></div></div>` });
  [['c1', 'ترند'], ['c2', 'مشهور']].forEach(([k, w]) => {
    const t = ts(w), el = $q(c, '.' + k);
    tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out', immediateRender: false }, t - .45);
    tl.to($q(el, '.strike'), { scaleX: 1, duration: .3, ease: 'power3.out' }, t + .12);
    tl.to(el, { opacity: .5, duration: .3 }, t + .3);
    cue(t - .45, 'tick', .6); cue(t + .12, 'swipe', .9);
  });
}

/* S9  what we stress: not only supplying products */
{
  const t0 = 26.9, t1 = 31.95;
  const c = card(t0, t1, { y: 235, h: 440, html: `
    <div class="eyebrow"><i></i>WHAT WE ALWAYS STRESS</div>
    <div class="h1 hd hid" style="margin-top:18px;text-align:right">اهتمامنا في <span class="acc">Glow</span></div>
    <div class="row" style="direction:ltr;gap:22px;justify-content:center;margin-top:36px">
      <div class="tile sm p0 hid lit" style="width:134px;height:134px">${ico('box')}</div>
      <div class="pl hid" style="width:42px;height:42px;color:var(--coral)">${ico('plus', 'stroke-width:5')}</div>
      ${['shield', 'star', 'chat'].map(n => `<div class="tile sm pd hid" style="width:134px;height:134px;border-style:dashed">${ico(n)}</div>`).join('')}</div>
    <div class="sub lb hid" style="text-align:center;margin-top:18px;font-size:30px">مش بس توفير المنتجات</div>` });
  fade($q(c, '.hd'), ts('اهتمامنا') - .1, .4);
  const tp = ts('توفير', 0, 28);
  pop($q(c, '.p0'), tp, { s: .5 });
  pop($q(c, '.pl'), ts('بس', 0, 28), { s: .3, snd: 'tick' });
  $a(c, '.pd').forEach((el, i) => pop(el, 29.55 + i * .28, { s: .5, y: 20 }));
  fade($q(c, '.lb'), tp + .1, .4);
}

/* S10  authentic + trusted sources */
{
  const t0 = 32.1, t1 = 34.05;
  const c = card(t0, t1, { y: 235, h: 500, html: `
    <div class="row" style="gap:30px;justify-content:flex-start">
      <div class="tile lit sh hid" style="width:170px;height:170px;border-radius:44px;padding:36px;color:#fff">${ico('shield', 'stroke-width:3.6')}</div>
      <div style="text-align:right"><div class="eyebrow" style="justify-content:flex-end"><i></i>AUTHENTIC PRODUCTS</div><div class="h1" style="margin-top:6px">منتجات <span class="acc">أصلية</span></div></div></div>
    <div class="row" style="direction:ltr;gap:24px;margin-top:40px;justify-content:center;align-items:center">
      <div class="chip nG hid" style="width:250px;height:120px;justify-content:center;gap:12px;background:rgba(94,230,184,.14);border-color:var(--mint)"><span style="width:48px;height:48px;color:var(--mint)">${ico('check', 'stroke-width:4.5')}</span><span>Glow</span></div>
      <div class="ar0 hid" style="width:80px;height:50px;color:var(--coral);transform:scaleX(-1)">${ico('arrow', 'stroke-width:4.5')}</div>
      <div class="chip nS hid" style="width:360px;height:120px;justify-content:center;gap:14px"><span style="width:52px;height:52px">${ico('factory')}</span><span class="ar" style="font:800 34px Cairo;direction:rtl;white-space:nowrap">مصادر موثوقة</span></div>
    </div>` });
  pop($q(c, '.sh'), ts('أصلية') - .05, { s: .4, ease: 'back.out(2.6)', snd: 'chime', v: .9 });
  const tm = ts('مصادر'), tv = ts('موثوقة');
  pop($q(c, '.nS'), tm, { s: .7, y: 18 });
  pop($q(c, '.ar0'), tm + .35, { s: .5, y: 0, snd: 'tick' });
  pop($q(c, '.nG'), tv + .1, { s: .7, y: 18 });
}

/* S11  quality: stars */
{
  const t0 = 34.25, t1 = 38.3;
  const c = card(t0, t1, { y: 240, h: 450, html: `
    <div class="eyebrow"><i></i>QUALITY</div>
    <div class="h1" style="margin-top:12px;text-align:right">جودة <span class="acc">الاختيارات</span></div>
    <div class="row" style="direction:ltr;gap:22px;justify-content:center;margin-top:26px">
      ${[0, 1, 2, 3, 4].map(() => `<div class="st" style="width:104px;height:104px;color:#FFD36B"><svg class="ic" viewBox="0 0 64 64"><path class="sf" d="${I.star.match(/d="([^"]+)"/)[1]}" fill="rgba(255,211,107,0)"/></svg></div>`).join('')}</div>
    <div class="row pk hid" style="gap:20px;justify-content:center;margin-top:26px"><div style="width:56px;height:56px">${ico('box')}</div><div class="h2" style="font-size:38px">تقديم المنتجات</div></div>` });
  const tj = ts('جودة');
  $a(c, '.sf').forEach((el, i) => { const t = tj + .15 + i * .2; tl.to(el, { attr: { fill: 'rgba(255,211,107,1)' }, duration: .18 }, t); tl.fromTo(el.parentNode.parentNode, { scale: 1 }, { scale: 1.2, duration: .12, yoyo: true, repeat: 1 }, t); cue(t, 'tick', .6 + i * .08); });
  pop($q(c, '.pk'), ts('وتقديم'), { s: .8, y: 14 });
}

/* S12  help: understand product, ingredients, usage */
{
  const t0 = 38.58, t1 = 45.3 - 1.85; // ends 43.45 (before the fit-check scene)
  const items = [['info', 'فهم المنتج', 'فهم'], ['flask', 'المكونات', 'ومكوناته'], ['pump', 'طريقة الاستخدام', 'واستخدامه']];
  const c = card(t0, 43.42, { y: 235, h: 500, html: `
    <div class="row" style="gap:24px;justify-content:flex-start">
      <div class="tile lit av hid" style="width:112px;height:112px;border-radius:50%;padding:28px">${ico('chat')}</div>
      <div style="text-align:right"><div class="eyebrow" style="justify-content:flex-end"><i></i>GUIDED CHOICE</div><div class="h1" style="font-size:56px;margin-top:2px">حد <span class="acc">يساعدك</span></div></div></div>
    <div style="margin-top:22px;display:flex;flex-direction:column;gap:14px">
      ${items.map(([n, l], i) => `<div class="row li hid" style="height:92px;border-radius:28px;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.14);padding:0 26px;gap:22px;position:relative">
        <div style="width:48px;height:48px;color:var(--coral)">${ico(n)}</div><div class="h2" style="flex:1;text-align:right;font-size:40px">${l}</div>
        <span class="n" style="font:600 22px Inter;color:rgba(255,255,255,.45);letter-spacing:.1em">0${i + 1}</span>
        <div class="badge ck hid" style="position:relative;width:48px;height:48px;background:var(--mint);color:#0E1222;padding:11px">${ico('check', 'stroke-width:5.5')}</div></div>`).join('')}
    </div>` });
  pop($q(c, '.av'), t0 + .2, { s: .5 });
  const tt = [ts('فهم', 0, 39), ts('ومكوناته'), ts('واستخدامه')];
  $a(c, '.li').forEach((el, i) => {
    tl.fromTo(el, { opacity: 0, x: 40 }, { opacity: .38, x: 0, duration: .4, ease: 'power3.out', immediateRender: false }, t0 + .45 + i * .12);
    tl.to(el, { opacity: 1, duration: .25 }, tt[i] - .1);
    cue(tt[i] - .1, 'pop', .8);
    const k = $q(el, '.ck'), tk = tt[i] + .35;
    pop(k, tk, { s: .2, ease: 'back.out(3)', snd: 'tick', v: .9 });
    tl.to(el, { borderColor: 'rgba(94,230,184,.7)', duration: .25 }, tk);
  });
}

/* S13  fit-check */
{
  const t0 = 43.5, t1 = 45.46;
  const c = card(t0, t1, { y: 245, h: 420, html: `
    <div class="eyebrow" style="justify-content:center"><i></i>RIGHT FOR YOUR SKIN?</div>
    <div class="row" style="direction:ltr;justify-content:center;gap:34px;margin-top:34px;align-items:flex-start">
      <div class="nd hid a2" style="text-align:center"><div class="tile lit" style="width:140px;height:140px;border-radius:50%;padding:36px">${ico('face')}</div><div class="h2" style="font-size:38px;margin-top:8px">بشرتك</div></div>
      <div class="qq hid" style="width:96px;height:96px;border-radius:50%;margin-top:24px;background:var(--coral-d);font:900 66px/94px Cairo;text-align:center;box-shadow:0 10px 36px rgba(217,89,76,.55)">؟</div>
      <div class="nd hid a1" style="text-align:center"><div class="tile" style="width:140px;height:140px;border-radius:50%;padding:36px">${ico('bottle')}</div><div class="h2" style="font-size:38px;margin-top:8px">المنتج</div></div>
    </div>
    <div class="row yn hid" style="direction:ltr;justify-content:center;gap:24px;margin-top:22px">
      <span class="pillk y1" style="background:var(--mint);color:#0E1222;font-size:22px">✓ YES</span><span class="pillk y2" style="font-size:22px">✕ NO</span></div>` });
  pop($q(c, '.a1'), ts('المنتج', 0, 43.4), { s: .6 });
  pop($q(c, '.a2'), ts('لبشرتك'), { s: .6 });
  pop($q(c, '.qq'), ts('مناسب') + .05, { s: .3, ease: 'back.out(3)' });
  tl.to($q(c, '.qq'), { scale: 1.12, duration: .3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, ts('مناسب') + .5);
  pop($q(c, '.yn'), ts('ولا') + .02, { s: .6, y: 10, snd: 'tick' });
}

/* S14  roadmap: not the last addition, just a step */
{
  const t0 = 46.0, t1 = 48.35;
  const xs = [724, 484, 244, 20];
  const c = card(t0, t1, { y: 240, h: 410, html: `
    <div class="eyebrow"><i></i>GLOW ROADMAP</div>
    <svg viewBox="0 0 744 220" style="width:100%;height:230px;margin-top:20px;overflow:visible">
      <path class="rl" d="M724 90H20" stroke="rgba(255,255,255,.3)" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round" fill="none"/>
      <path class="rl2" d="M724 90H504" stroke="#FF6F61" stroke-width="6" stroke-linecap="round" fill="none"/>
      ${xs.map((x, i) => `<g class="nn" opacity="0"><circle cx="${x}" cy="90" r="${i == 0 ? 30 : 22}" fill="${i == 0 ? '#FF6F61' : 'rgba(14,18,34,.9)'}" stroke="${i == 0 ? '#fff' : 'rgba(255,255,255,.4)'}" stroke-width="${i == 0 ? 4 : 3}" ${i ? 'stroke-dasharray="6 6"' : ''}/>
        <text x="${x}" y="${i == 0 ? 160 : 150}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" letter-spacing="3" fill="${i == 0 ? '#fff' : 'rgba(255,255,255,.55)'}">${i == 0 ? 'NOW' : 'NEXT'}</text></g>`).join('')}
      <circle class="pulse" cx="724" cy="90" r="30" fill="none" stroke="#FF6F61" stroke-width="4" opacity="0"/>
    </svg>` });
  const nn = $a(c, '.nn');
  tl.fromTo(nn[0], { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: false }, t0 + .25); cue(t0 + .25, 'pop', .9);
  const tl0 = ts('آخر');
  tl.fromTo($q(c, '.rl'), { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: false }, tl0 - .1);
  nn.slice(1).forEach((g, i) => { tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: false }, tl0 + .25 + i * .22); cue(tl0 + .25 + i * .22, 'tick', .6); });
  draw($q(c, '.rl2'), ts('خطوة') - .2, .5);
  const tp = ts('خطوة');
  tl.fromTo($q(c, '.pulse'), { opacity: .9, attr: { r: 30 } }, { opacity: 0, attr: { r: 62 }, duration: .6, ease: 'power2.out', immediateRender: false }, tp);
}

/* S15  better experience, day after day */
{
  const t0 = 48.5, t1 = 52.62;
  const hs = [50, 92, 138, 184, 232], bx = [60, 200, 340, 480, 620];
  const c = card(t0, t1, { y: 235, h: 500, html: `
    <div class="row" style="justify-content:space-between;direction:ltr"><div class="eyebrow"><i></i>BETTER EXPERIENCE</div><span class="pillk sb hid" style="font-size:20px">STEP BY STEP</span></div>
    <svg viewBox="0 0 812 330" style="width:100%;height:340px;margin-top:6px;overflow:visible">
      <defs><linearGradient id="bg1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#D9594C"/><stop offset="1" stop-color="#FF8A7C"/></linearGradient></defs>
      <path d="M20 280H792" stroke="rgba(255,255,255,.3)" stroke-width="3"/>
      ${hs.map((h, i) => `<g><rect class="bar" x="${bx[i]}" y="${280 - h}" width="120" height="${h}" rx="16" fill="url(#bg1)" />
        <text x="${bx[i] + 60}" y="316" text-anchor="middle" font-family="Inter" font-weight="600" font-size="20" letter-spacing="2" fill="rgba(255,255,255,.6)">DAY ${i + 1}</text></g>`).join('')}
      <path class="tr" d="M${bx[0] + 60} ${280 - hs[0] - 28}L${bx[1] + 60} ${280 - hs[1] - 28}L${bx[2] + 60} ${280 - hs[2] - 28}L${bx[3] + 60} ${280 - hs[3] - 28}L${bx[4] + 60} ${280 - hs[4] - 34}" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path class="ah" d="M${bx[4] + 28} ${280 - hs[4] - 40}L${bx[4] + 62} ${280 - hs[4] - 34}L${bx[4] + 48} ${280 - hs[4] - 2}" transform="translate(0,0)" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0"/>
    </svg>` });
  const bars = $a(c, '.bar');
  const tb = [ts('تجربة', 0, 48), ts('أفضل') - .1, ts('يوم', 0, 49.9), ts('بعد', 0, 49.9), ts('يوم', 1, 50)];
  bars.forEach((b, i) => { tl.fromTo(b, { attr: { y: 280, height: 0 } }, { attr: { y: 280 - hs[i], height: hs[i] }, duration: .5, ease: 'back.out(1.4)', immediateRender: false }, tb[i]); cue(tb[i], 'rise', .7); });
  bars.forEach(b => { b.setAttribute('height', 0); b.setAttribute('y', 280); });
  draw($q(c, '.tr'), tb[4] + .1, .6);
  tl.to($q(c, '.ah'), { opacity: 1, duration: .15 }, tb[4] + .6);
  pop($q(c, '.sb'), ts('خطوة', 0, 50.9), { s: .6, snd: 'tick' });
}

/* S16  trust */
{
  const t0 = 52.88, t1 = 55.3;
  const c = card(t0, t1, { y: 235, h: 470, html: `
    <div class="eyebrow" style="justify-content:center"><i></i>OUR GOAL</div>
    <div style="position:relative;height:250px;margin-top:20px">
      ${[0, 1].map(() => `<div class="rg" style="position:absolute;left:50%;top:50%;width:170px;height:170px;margin:-85px 0 0 -85px;border-radius:50%;border:3px solid var(--coral);opacity:0"></div>`).join('')}
      <div class="tile lit hh hid" style="position:absolute;left:50%;top:50%;width:176px;height:176px;margin:-88px 0 0 -88px;border-radius:50%;padding:42px">${ico('heart', 'fill:rgba(255,255,255,.18);stroke-width:3.6')}</div></div>
    <div class="h1 tx hid" style="text-align:center;margin-top:6px">حسن <span class="acc">ثقتكم</span></div>` });
  pop($q(c, '.hh'), t0 + .3, { s: .4, ease: 'back.out(2.6)', snd: 'pop' });
  $a(c, '.rg').forEach((r, i) => tl.fromTo(r, { opacity: .8, scale: 1 }, { opacity: 0, scale: 2.2, duration: 1.1, ease: 'power2.out', immediateRender: false }, t0 + .6 + i * .45));
  fade($q(c, '.tx'), ts('ثقتكم') - .25, .4);
  tl.to($q(c, '.hh'), { scale: 1.1, duration: .35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, ts('ثقتكم'));
}

/* OUTRO: brand end card */
{
  const o = document.getElementById('outro'), lg = $q(o, 'img');
  tl.to(o, { clipPath: 'inset(0% 0 0 0)', duration: .55, ease: 'power4.inOut' }, 55.38);
  tl.fromTo(lg, { opacity: 0, scale: .9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: .8, ease: 'expo.out', immediateRender: false }, 55.8);
  tl.to(lg, { scale: 1.04, duration: 1.2, ease: 'sine.inOut' }, 56.0);
  cue(55.38, 'swell', 1); cue(55.85, 'chime', 1);
}


buildCaptions();
finish(57.0);
