/* scene.js - Dermaten November offer (Egyptian Arabic). Real footage + glass cards. All timings from word lookups. */
const cam = document.getElementById('cam');
/* viral pacing: a punch-in snap on every caption beat, alternating scale/offset, slow drift in between */
{ const sc_ = [1.14, 1.07, 1.17, 1.09, 1.15, 1.06], ox = [0, -22, 18, -14, 24, -18], oy = [0, 14, -18, 20, -10, 16];
  const st = TR.chunks.map(ids => W[ids[0]].start - .03).filter(t => t < 27.6);
  tl.set(cam, { scale: 1.04 }, 0);
  st.forEach((t, i) => { const nx = i + 1 < st.length ? st[i + 1] : 27.6, k = i % 6;
    tl.to(cam, { scale: sc_[k], x: ox[k], y: oy[k], duration: .16, ease: 'power3.out' }, t);
    tl.to(cam, { scale: sc_[k] + .035, duration: Math.max(.2, nx - t - .16), ease: 'none' }, t + .16);
    if (i % 2 == 0) cue(t, 'zoom', .45); });
  tl.to(cam, { scale: 1.14, x: 0, y: 0, duration: .5 }, 27.6); }
/* top progress bar + white flash transitions + vignette */
const pb = document.createElement('div'); Object.assign(pb.style, { position: 'absolute', left: 0, top: 0, height: '12px', width: '1080px', background: 'linear-gradient(90deg,#FF6F61,#FFD36B)', transformOrigin: '0 50%', zIndex: 50 }); document.body.appendChild(pb);
tl.fromTo(pb, { scaleX: 0 }, { scaleX: 1, duration: 27.6, ease: 'none', immediateRender: false }, 0);
const fl = document.createElement('div'); Object.assign(fl.style, { position: 'absolute', inset: 0, background: '#fff', opacity: 0, zIndex: 40 }); document.body.appendChild(fl);
[3.05, 7.44, 11.7, 17.19, 20.7, 22.29].forEach(t => { tl.fromTo(fl, { opacity: .5 }, { opacity: 0, duration: .28, ease: 'power2.out', immediateRender: false }, t); cue(t, 'whoosh', .5); });
const vg = document.createElement('div'); Object.assign(vg.style, { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)', zIndex: 5 }); document.body.appendChild(vg);
const shake = (el, t, n = 6, a = 14) => { for (let i = 0; i < n; i++) tl.to(el, { x: (i % 2 ? -1 : 1) * a * (1 - i / n), rotation: (i % 2 ? -1 : 1) * 2 * (1 - i / n), duration: .045 }, t + i * .045); tl.to(el, { x: 0, rotation: 0, duration: .05 }, t + n * .045); };
const slam = (html, css, t, t1, { s = 2.4, snd = 'thud' } = {}) => { const el = document.createElement('div'); el.innerHTML = html; Object.assign(el.style, { position: 'absolute', left: 0, width: '1080px', textAlign: 'center', opacity: 0, fontFamily: 'Cairo,Inter,sans-serif', fontWeight: 900, color: '#fff', textShadow: '0 8px 0 rgba(0,0,0,.35),0 0 40px rgba(0,0,0,.5)', ...css }); stage.appendChild(el);
  tl.fromTo(el, { opacity: 0, scale: s }, { opacity: 1, scale: 1, duration: .22, ease: 'back.out(2.2)', immediateRender: false }, t); cue(t, snd, 1); shake(el, t + .2, 5, 10);
  tl.to(el, { opacity: 0, scale: .9, y: -30, duration: .22, ease: 'power2.in' }, t1); return el; };

const wm = document.getElementById('wm');
tl.to(wm, { opacity: .92, duration: .6 }, .6).to(wm, { opacity: 0, duration: .25 }, 27.5);

const dim = 'rgba(255,255,255,.16)';

/* S1 HOOK: slams on the spoken words */
{ const t = ts('استنى'), td = ts('Dermaten');
  slam('استنى!', { top: '330px', fontSize: '250px', lineHeight: 1.1, textShadow: '0 10px 0 #D9594C,0 0 50px rgba(0,0,0,.5)' }, t, 1.55);
  const el = slam('<span style="font:900 150px Inter;letter-spacing:.02em"><span style="color:#FF6F61">DERMA</span>TEN</span><div style="margin:14px auto 0;width:560px;height:14px;border-radius:7px;background:linear-gradient(90deg,#FF6F61,#FFD36B)"></div>', { top: '360px' }, ts('سيروم'), 2.85, { s: 2.8 });
  const sp = document.createElement('div'); sp.className = 'hid'; Object.assign(sp.style, { position: 'absolute', left: '780px', top: '300px', width: '90px', height: '90px', color: '#FFD36B' }); sp.innerHTML = ico('sparkle'); stage.appendChild(sp);
  pop(sp, td, { s: .2, snd: 'sparkle' }); tl.to(sp, { opacity: 0, duration: .2 }, 2.8); }

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

/* S8 PRICE SLAM */
{ const t2 = ts('200'), t3 = ts('300'), t0 = 22.4;
  const el = document.createElement('div'); Object.assign(el.style, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1000px', opacity: 0 }); stage.appendChild(el);
  const pts = []; for (let i = 0; i < 32; i++) { const r = i % 2 ? 250 : 330, a = i / 32 * Math.PI * 2; pts.push((540 + r * Math.cos(a)).toFixed(1) + ',' + (520 + r * Math.sin(a)).toFixed(1)); }
  el.innerHTML = `<svg viewBox="0 0 1080 1000" style="width:1080px;height:1000px;position:absolute;left:0;top:0;overflow:visible"><polygon points="${pts.join(' ')}" fill="#FF6F61" stroke="#fff" stroke-width="12" stroke-linejoin="round" style="filter:drop-shadow(0 20px 40px rgba(0,0,0,.5))"/></svg>
    <div style="position:absolute;left:0;width:1080px;top:380px;text-align:center;font:900 280px/1 Inter;color:#fff;text-shadow:0 10px 0 #D9594C">200</div>
    <div class="o3" style="position:absolute;left:640px;top:120px;opacity:0;transform:rotate(8deg);font:900 130px/1 Inter;color:rgba(255,255,255,.95);text-shadow:0 6px 0 rgba(0,0,0,.4);background:#0E1222;border:6px solid #fff;border-radius:30px;padding:14px 34px">300<div class="sk" style="position:absolute;left:-14px;right:-14px;top:50%;height:16px;background:#FF3B30;border-radius:8px;transform:scaleX(0);transform-origin:left center"></div></div>`;
  tl.fromTo(el, { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: .28, ease: 'back.out(2)', immediateRender: false }, t2 - .05); cue(t2 - .05, 'thud', 1);
  tl.to(el, { rotation: -3, duration: .5, yoyo: true, repeat: 7, ease: 'sine.inOut', transformOrigin: '540px 520px' }, t2 + .3);
  const o3 = $q(el, '.o3'), sk = $q(el, '.sk');
  tl.fromTo(o3, { opacity: 0, scale: .4, y: -40 }, { opacity: 1, scale: 1, y: 0, duration: .3, ease: 'back.out(2.5)', immediateRender: false }, ts('بدلا')); cue(ts('بدلا'), 'pop', .9);
  tl.to(sk, { scaleX: 1, duration: .22, ease: 'power3.out' }, t3 + .1); cue(t3 + .1, 'swipe', 1);
  tl.to(el, { opacity: 0, scale: .92, duration: .25, ease: 'power2.in' }, 27.5);
  /* confetti */
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const cols = ['#FF6F61', '#FFD36B', '#5EE6B8', '#fff', '#FF9EC0'];
  for (let i = 0; i < 46; i++) { const c = document.createElement('div'), sz = 14 + rnd() * 18; Object.assign(c.style, { position: 'absolute', left: '540px', top: '520px', width: sz + 'px', height: sz * .55 + 'px', background: cols[i % 5], opacity: 0, borderRadius: '3px' }); stage.appendChild(c);
    const ang = rnd() * Math.PI * 2, d = 260 + rnd() * 420, tt = t2 + .02;
    tl.fromTo(c, { opacity: 1, x: 0, y: 0, rotation: 0 }, { x: Math.cos(ang) * d, y: Math.sin(ang) * d + 160, rotation: rnd() * 720 - 360, duration: 1.1 + rnd() * .5, ease: 'power2.out', immediateRender: false }, tt);
    tl.to(c, { opacity: 0, duration: .35 }, tt + 1.0 + rnd() * .3); }
  const lim = slam('<span style="background:#0E1222;border:5px solid #FF6F61;padding:8px 38px;border-radius:999px;display:inline-block">LIMITED TIME</span>', { top: '1080px', fontSize: '64px', fontFamily: 'Inter', letterSpacing: '.12em', background: 'none' }, ts('لفترة'), 27.45, { s: 1.6, snd: 'pop' });
  const nov = slam('<span style="background:#fff;color:#CD5A50;padding:6px 40px;border-radius:24px;display:inline-block">NOVEMBER</span>', { top: '1190px', fontSize: '84px', fontFamily: 'Inter', textShadow: 'none' }, ts('نوفمبر'), 27.5, { s: 1.8, snd: 'chime' }); }

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
