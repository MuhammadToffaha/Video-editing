/* scene.js - Dermaten November offer (Egyptian Arabic). Real footage + glass cards. All timings from word lookups. */
const cam = document.getElementById('cam');
[[0, 3.0, 1.05, 'none'], [3.07, 3.4, 1.11, 'power3.inOut'], [3.4, 7.3, 1.14, 'none'], [7.44, 7.8, 1.05, 'power3.inOut'], [7.8, 11.3, 1.09, 'none'],
 [11.73, 12.1, 1.15, 'power3.inOut'], [12.1, 16.9, 1.11, 'none'], [17.19, 17.55, 1.04, 'power3.inOut'], [17.55, 20.5, 1.09, 'none'],
 [20.7, 21.0, 1.15, 'power3.inOut'], [21.0, 22.2, 1.17, 'none'], [22.29, 22.65, 1.06, 'power3.inOut'], [22.65, 27.6, 1.1, 'none'],
 [27.7, 29.8, 1.14, 'none']
].forEach(([a, b, s, e]) => { tl.to(cam, { scale: s, duration: b - a, ease: e }, a); if (e !== 'none') cue(a, 'zoom', .7); });

const wm = document.getElementById('wm');
tl.to(wm, { opacity: .92, duration: .6 }, .6).to(wm, { opacity: 0, duration: .25 }, 27.5);

const dim = 'rgba(255,255,255,.16)';

/* S1 hook: before you buy any serum */
{
  const c = card(.45, 2.78, { y: 260, h: 270, html: `
    <div class="row" style="gap:36px;height:100%">
      <div class="tile lit k1" style="width:170px;height:170px;padding:40px;border-radius:44px">${ico('dropper')}
        <div class="sp hid" style="position:absolute;right:-16px;top:-16px;width:50px;height:50px;color:#fff">${ico('sparkle')}</div></div>
      <div style="flex:1;text-align:right"><div class="eyebrow" style="justify-content:flex-end"><i></i>BEFORE YOU BUY ANY SERUM</div>
        <div class="h1" style="margin-top:6px;direction:ltr;text-align:right"><span class="acc">Derma</span>ten</div></div></div>` });
  pop($q(c, '.k1'), .6, { s: .5 });
  pop($q(c, '.sp'), ts('سيروم'), { s: .2, snd: 'sparkle', v: .8 });
  tl.to($q(c, '.k1'), { rotation: 8, duration: .25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ts('سيروم'));
}

/* S2 full range + S3 availability */
{
  const c = card(3.0, 10.0, { y: 230, h: 360, html: `
    <div class="eyebrow"><i></i>DERMATEN · FULL RANGE</div>
    <div class="row" style="direction:ltr;gap:26px;margin-top:34px;justify-content:center">
      ${['Azelaic Acid', 'Peptides'].map(n => `<div class="chip bc" style="width:410px;height:130px;justify-content:center"><span class="nm" style="opacity:0;font-size:42px">${n}</span><div class="dash" style="position:absolute;inset:-1.5px;border:2px dashed rgba(255,255,255,.28);border-radius:30px"></div></div>`).join('')}
    </div>
    <div class="sub" style="text-align:center;margin-top:26px;font-size:30px;direction:ltr">+ every Dermaten type</div>` });
  const chips = $a(c, '.bc');
  chips.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out', immediateRender: false }, 3.45 + i * .1));
  [ts('Azelaic'), ts('Peptides')].forEach((t, i) => {
    const el = chips[i];
    tl.to($q(el, '.dash'), { opacity: 0, duration: .15 }, t);
    tl.to(el, { backgroundColor: 'rgba(255,111,97,.22)', borderColor: '#FF6F61', scale: 1.04, duration: .2, ease: 'power2.out' }, t);
    tl.to(el, { scale: 1, duration: .3, ease: 'power2.inOut' }, t + .2);
    tl.fromTo($q(el, '.nm'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: .35, ease: 'power3.out', immediateRender: false }, t);
    cue(t, 'tick', 1);
  });
  const b = card(8.6, 10.0, { y: 640, h: 290, cls: 'brand', html: `
    <div style="text-align:center"><span class="pillk av hid" style="background:#fff;color:var(--brand)">AVAILABLE AT</span></div>
    <img class="hero-logo lg" src="../assets/logo_white.png" style="clip-path:inset(0 100% 0 0);opacity:1;width:480px;margin-top:14px">` });
  pop($q(b, '.av'), ts('متوفرين'), { s: .5 });
  const tg = ts('Glow', 0, 8);
  tl.fromTo($q(b, '.lg'), { clipPath: 'inset(0 100% 0 0)', scale: 1.08 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: .7, ease: 'power3.out', immediateRender: false }, tg - .05);
  cue(tg - .05, 'thud', 1);
}

/* S4 your skin needs */
{
  const c = card(9.95, 11.45, { y: 260, h: 230, html: `
    <div class="row" style="gap:34px;height:100%">
      <div class="tile lit fc" style="width:140px;height:140px;border-radius:50%;padding:34px">${ico('face')}</div>
      <div style="flex:1;text-align:right"><div class="eyebrow" style="justify-content:flex-end"><i></i>WHATEVER YOUR SKIN NEEDS</div>
        <div class="h1" style="margin-top:4px;font-size:58px">احتياج <span class="acc">بشرتك</span></div></div></div>` });
  pop($q(c, '.fc'), 10.1, { s: .5 });
}

/* S5 concerns */
{
  const t0 = 11.65, t1 = 17.0;
  const items = [['الترطيب', 'الترطيب'], ['الحبوب', 'بالحبوب'], ['المسام', 'والمسام'], ['العين', 'العين'], ['الخطوط', 'والخطوط'], ['التجاعد', 'والتجاعد'], ['التفتيح', 'والتفتيح']];
  const c = card(t0, t1, { y: 235, h: 590, html: `
    <div class="eyebrow"><i></i>CHOOSE YOUR CONCERN</div>
    <div style="display:flex;flex-wrap:wrap;gap:18px;direction:ltr;margin-top:30px;justify-content:center">
      ${items.map(([n], i) => `<div class="chip bc" style="width:392px;height:96px;justify-content:space-between"><span class="n">0${i + 1}</span>
        <span class="nm" style="opacity:0;font-size:40px;font-family:Cairo">${n}</span><div class="dash" style="position:absolute;inset:-1.5px;border:2px dashed rgba(255,255,255,.28);border-radius:30px"></div></div>`).join('')}
    </div>` });
  const chips = $a(c, '.bc');
  chips.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .35, ease: 'power3.out', immediateRender: false }, t0 + .25 + i * .08));
  items.forEach(([, w], i) => {
    const t = ts(w), el = chips[i];
    tl.to($q(el, '.dash'), { opacity: 0, duration: .15 }, t);
    tl.to(el, { backgroundColor: 'rgba(255,111,97,.22)', borderColor: '#FF6F61', scale: 1.04, duration: .2, ease: 'power2.out' }, t);
    tl.to(el, { scale: 1, duration: .3, ease: 'power2.inOut' }, t + .2);
    tl.fromTo($q(el, '.nm'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .3, ease: 'power3.out', immediateRender: false }, t);
    cue(t, 'tick', .9);
  });
}

/* S6 many options -> finds what suits */
{
  const t0 = 17.15, t1 = 20.5;
  const c = card(t0, t1, { y: 245, h: 400, html: `
    <div class="eyebrow"><i></i>MANY OPTIONS</div>
    <div class="row" style="direction:ltr;gap:30px;justify-content:center;margin-top:34px;position:relative">
      ${['bottle', 'tube', 'jar', 'dropper'].map(n => `<div class="tile pt hid" style="width:168px;height:168px">${ico(n)}</div>`).join('')}</div>
    <div class="row ok hid" style="gap:18px;justify-content:center;margin-top:26px"><div class="badge" style="position:relative;width:64px;height:64px;background:var(--mint);color:#0E1222;padding:14px">${ico('check', 'stroke-width:5')}</div><div class="h2">يناسب <span class="acc">بشرتك</span></div></div>` });
  $a(c, '.pt').forEach((el, i) => pop(el, t0 + .1 + i * .2, { s: .5, y: 26 }));
  const tm = ts('يناسب');
  pop($q(c, '.ok'), tm, { s: .7, y: 12, snd: 'chime' });
  const pts = $a(c, '.pt');
  pts.forEach((el, i) => { const t = tm + i * .12; tl.to(el, { borderColor: '#5EE6B8', duration: .2 }, t); });
}

/* S7 surprise */
{
  const c = card(20.62, 22.15, { y: 260, h: 250, html: `
    <div class="row" style="gap:34px;height:100%">
      <div class="tile lit sr hid" style="width:140px;height:140px;border-radius:44px;padding:34px">${ico('star')}</div>
      <div style="flex:1;text-align:right"><span class="pillk">★ BIG NEWS</span>
        <div class="h1" style="margin-top:8px;font-size:58px"><span class="acc">المفاجأة</span> لسه جاية</div></div></div>` });
  pop($q(c, '.sr'), ts('المفاجأة'), { s: .3, ease: 'back.out(3)', snd: 'sparkle' });
  tl.to($q(c, '.sr'), { rotation: 12, duration: .25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, ts('المفاجأة') + .3);
}

/* S8 price */
{
  const t0 = 23.45, t1 = 27.55;
  const c = card(t0, t1, { y: 235, h: 560, html: `
    <div class="eyebrow"><i></i>DERMATEN · ANY PRODUCT</div>
    <div class="row" style="direction:ltr;gap:36px;justify-content:center;margin-top:36px">
      <div class="chip p2 hid" style="width:400px;height:230px;justify-content:center;background:linear-gradient(145deg,var(--coral),var(--coral-d));border-color:#fff"><span style="font:900 150px Inter">200</span></div>
      <div class="chip p3 hid" style="width:340px;height:230px;justify-content:center"><span style="font:900 120px Inter;color:rgba(255,255,255,.6)">300</span><div class="strike" style="height:10px"></div></div></div>
    <div class="row" style="direction:ltr;gap:18px;justify-content:center;margin-top:36px">
      <span class="pillk lim hid" style="font-size:26px">LIMITED TIME</span><span class="pillk nov hid" style="font-size:26px;background:#fff;color:var(--brand)">NOVEMBER</span></div>` });
  const t2 = ts('200'), t3 = ts('300');
  pop($q(c, '.p2'), t2 - .05, { s: .5, snd: 'thud' });
  pop($q(c, '.p3'), ts('بدلا') + .02, { s: .7, snd: 'tick' });
  tl.to($q(c, '.strike'), { scaleX: 1, duration: .3, ease: 'power3.out' }, t3 + .05); cue(t3 + .05, 'swipe', .9);
  tl.to($q(c, '.p3'), { opacity: .55, duration: .3 }, t3 + .3);
  pop($q(c, '.lim'), ts('لفترة'), { s: .6 });
  pop($q(c, '.nov'), ts('نوفمبر'), { s: .6, snd: 'chime' });
}

/* OUTRO */
{
  const o = document.getElementById('outro'), lg = $q(o, 'img');
  tl.to(o, { clipPath: 'inset(0% 0 0 0)', duration: .55, ease: 'power4.inOut' }, 27.7);
  tl.fromTo(lg, { opacity: 0, scale: .9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: .8, ease: 'expo.out', immediateRender: false }, 28.1);
  tl.to(lg, { scale: 1.04, duration: 1.2, ease: 'sine.inOut' }, 28.3);
  cue(27.7, 'swell', 1); cue(28.15, 'chime', 1);
}

buildCaptions();
finish(30.0);
