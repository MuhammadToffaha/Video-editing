/* scene.js - Glow offer reel (Egyptian Arabic): "Buy 2 get the 3rd free", 10-30 Nov. Footage mode. */
const cam = document.getElementById('cam');
const starts = [0.32, 2.36, 5.41, 9.02, 12.53, 16.38, 20.61, 24.44, 28.48, 31.3, 34.5, 37.34];
const sc = [1.05, 1.12, 1.04, 1.12, 1.05, 1.11, 1.05, 1.12, 1.04, 1.1, 1.04, 1.12];
tl.set(cam, { scale: 1.04 }, 0);
starts.forEach((a, i) => {
  const b = i + 1 < starts.length ? starts[i + 1] : 40.1;
  tl.to(cam, { scale: sc[i], duration: .35, ease: 'power3.inOut' }, a);
  tl.to(cam, { scale: sc[i] + .035, duration: Math.max(.1, b - a - .35), ease: 'none' }, a + .35);
  cue(a, 'zoom', .6);
});

/* S1 buy 2 get the 3rd free (0.32-2.3) */
{
  const c = card(.34, 2.3, { y: 250, h: 330, html: `
    <div class="eyebrow" style="justify-content:center"><i></i>BUY 2 · GET 1 FREE</div>
    <div class="row" style="gap:36px;justify-content:center;direction:ltr;margin-top:30px;position:relative">
      <div class="tile a1 hid" style="width:170px;height:170px">${ico('bottle')}</div>
      <div class="tile a2 hid" style="width:170px;height:170px">${ico('tube')}</div>
      <div class="tile lit a3 hid" style="width:170px;height:170px">${ico('box')}
        <span class="pillk fr hid" style="position:absolute;bottom:-22px;left:50%;margin-left:-60px;background:#fff;color:var(--brand)">FREE</span></div>
    </div>` });
  pop($q(c, '.a1'), ts('قطعتين'), { s: .5 }); pop($q(c, '.a2'), ts('قطعتين') + .25, { s: .5, snd: 'tick' });
  pop($q(c, '.a3'), ts('التالتة'), { s: .4, ease: 'back.out(2.6)' });
  pop($q(c, '.fr'), ts('فري'), { s: .4, snd: 'sparkle' });
}
/* S2 brand + store (2.4-5.35) */
{
  const c = card(2.45, 5.35, { y: 250, h: 400, cls: 'brand', html: `
    <div style="text-align:center"><span class="pillk af hid" style="background:#fff;color:var(--brand)">AFRICANA</span></div>
    <img class="hero-logo lg" src="../assets/logo_white.png" style="clip-path:inset(0 100% 0 0);opacity:1;width:560px">` });
  pop($q(c, '.af'), ts('أفريكانا'), { s: .5 });
  const tg = ts('جلوكوزمتكس');
  tl.fromTo($q(c, '.lg'), { clipPath: 'inset(0 100% 0 0)', scale: 1.08 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: .75, ease: 'power3.out', immediateRender: false }, tg - .1);
  cue(tg - .1, 'thud', 1);
}
/* S3 hair care / skin care (5.45-8.95) */
{
  const c = card(5.45, 8.95, { y: 250, h: 380, html: `
    <div class="row" style="gap:40px;justify-content:center;direction:ltr;margin-top:6px">
      <div class="cat hid" style="text-align:center"><div class="tile t1" style="width:200px;height:200px;margin:0 auto;padding:44px">${ico('dropper')}</div><div class="h2" style="margin-top:12px">العناية <span class="acc">بالشعر</span></div></div>
      <div class="cat hid" style="text-align:center"><div class="tile t2" style="width:200px;height:200px;margin:0 auto;padding:44px">${ico('drop')}</div><div class="h2" style="margin-top:12px">العناية <span class="acc">بالبشرة</span></div></div>
    </div>` });
  const cs = $a(c, '.cat'), tt = [ts('بالشعر'), ts('بالبشرة')];
  cs.forEach((el, i) => { pop(el, tt[i] - .25, { s: .6 }); const t = $q(el, '.tile');
    tl.to(t, { backgroundColor: '#FF6F61', borderColor: '#fff', scale: 1.08, duration: .2 }, tt[i]); tl.to(t, { scale: 1, duration: .3 }, tt[i] + .2); });
}
/* S4 november offer (9.05-12.5) */
{
  const c = card(9.05, 12.5, { y: 250, h: 340, html: `
    <div class="row" style="gap:36px;height:100%">
      <div class="tile lit gf" style="width:190px;height:190px;padding:44px;border-radius:48px;position:relative">${ico('star')}
        <div class="sp hid" style="position:absolute;right:-18px;top:-18px;width:54px;height:54px;color:#fff">${ico('sparkle')}</div></div>
      <div style="flex:1;text-align:right"><div class="eyebrow" style="justify-content:flex-end"><i></i>NOVEMBER OFFER</div>
        <div class="h1" style="margin-top:6px"><span class="acc">عرض</span> شهر نوفمبر</div></div></div>` });
  pop($q(c, '.gf'), 9.45, { s: .5 });
  const t = ts('عرض', 0, 9); pop($q(c, '.sp'), t, { s: .2, snd: 'sparkle', v: .8 });
  tl.to($q(c, '.gf'), { rotation: 8, duration: .25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t);
}
/* S5 buy 2 + 1 free diagram (12.55-16.4) */
{
  const c = card(12.55, 16.4, { y: 250, h: 380, html: `
    <div class="row" style="gap:30px;justify-content:center;direction:ltr;margin-top:18px;position:relative">
      ${[1, 2, 3].map(n => `<div class="chip bx" style="width:250px;height:150px;justify-content:center;font-size:56px;flex-direction:column;gap:4px"><span class="n" style="position:absolute;top:12px;left:18px">0${n}</span>${n < 3 ? ico(n == 1 ? 'bottle' : 'tube', 'width:70px;height:70px') : '<span style="font-size:48px">FREE</span>'}<div class="dash" style="position:absolute;inset:-1.5px;border:2px dashed rgba(255,255,255,.28);border-radius:30px;${n < 3 ? 'opacity:0' : ''}"></div></div>`).join('')}
    </div><div class="h2 hid ft" style="text-align:center;margin-top:30px">اشتري <span class="acc">قطعتين</span> وخد <span class="acc">التالتة</span> فري</div>` });
  const bx = $a(c, '.bx'), tt = [ts('قطعتين', 0, 12.5), ts('قطعتين', 0, 12.5) + .3, ts('التالتة', 0, 12.5)];
  bx.forEach((el, i) => { tl.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out', immediateRender: false }, 12.7 + i * .12);
    const t = tt[i]; tl.to($q(el, '.dash'), { opacity: 0, duration: .15 }, t);
    tl.to(el, { backgroundColor: i < 2 ? 'rgba(255,111,97,.22)' : '#FF6F61', borderColor: i < 2 ? '#FF6F61' : '#fff', scale: 1.05, duration: .2 }, t); tl.to(el, { scale: 1, duration: .3 }, t + .2); cue(t, i < 2 ? 'tick' : 'sparkle', .9); });
  fade($q(c, '.ft'), 14.3, .4);
}
/* S6 choose your products (16.4-20.25) */
{
  const t0 = 16.45;
  const cats = [['tube', 'غسول'], ['dropper', 'سيروم'], ['jar', 'كريم'], ['bottle', 'شامبو']];
  const c = card(t0, 20.25, { y: 250, h: 360, html: `
    <div class="eyebrow"><i></i>PICK YOUR OWN</div>
    <div class="row" style="direction:ltr;gap:26px;justify-content:center;margin-top:30px">
      ${[['bottle', 'للشعر'], ['dropper', 'للشعر'], ['tube', 'للبشرة'], ['jar', 'للبشرة']].map(([n]) => `<div class="tile pk hid" style="width:170px;height:170px">${ico(n)}</div>`).join('')}</div>
    <div class="h2 hid lb" style="text-align:center;margin-top:24px">لـ<span class="acc">شعرك</span> أو <span class="acc">بشرتك</span></div>` });
  $a(c, '.pk').forEach((el, i) => pop(el, t0 + .3 + i * .15, { s: .5, y: 26 }));
  const tt = [ts('المنتجات'), ts('لشعرك'), ts('بشرتك', 0, 18)];
  $a(c, '.pk').forEach((el, i) => { const t = tt[Math.min(2, Math.max(0, i - 1 + (i > 1 ? 0 : 1)))] + i * .12; tl.to(el, { borderColor: '#FF6F61', backgroundColor: 'rgba(255,111,97,.25)', duration: .2 }, t); cue(t, 'tick', .6); });
  fade($q(c, '.lb'), ts('لشعرك') - .05, .3);
}
/* S7 extra product, without paying for it (20.65-24.4) */
{
  const c = card(20.65, 24.4, { y: 250, h: 380, html: `
    <div class="row" style="gap:36px;height:100%">
      <div class="tile lit ex hid" style="width:190px;height:190px;padding:44px;border-radius:48px">${ico('plus')}</div>
      <div style="flex:1;text-align:right"><div class="eyebrow" style="justify-content:flex-end"><i></i>EXTRA PRODUCT</div>
        <div class="h1" style="margin-top:6px">منتج <span class="acc">إضافي</span></div>
        <div class="sub nm hid" style="margin-top:6px">بدون ما تدفع <span class="acc">ثمنه</span></div></div></div>` });
  pop($q(c, '.ex'), ts('إضافي') - .1, { s: .4 }); fade($q(c, '.nm'), ts('بدون') - .05, .35);
  tl.to($q(c, '.ex'), { rotation: 90, duration: .5, ease: 'back.out(2)' }, ts('إضافي'));
}
/* S8 exclusive (24.5-27.65) */
{
  const c = card(24.5, 27.65, { y: 250, h: 340, html: `
    <div class="row" style="gap:36px;height:100%">
      <div class="tile lit sh hid" style="width:190px;height:190px;padding:44px;border-radius:48px">${ico('shield')}</div>
      <div style="flex:1;text-align:right"><div class="eyebrow" style="justify-content:flex-end"><i></i>EXCLUSIVE</div>
        <div class="h1" style="margin-top:6px">فرصة <span class="acc">حصرية</span></div>
        <div class="sub" style="margin-top:4px">لعملائنا</div></div></div>` });
  pop($q(c, '.sh'), ts('حصرية') - .1, { s: .4 }); tl.to($q(c, '.sh'), { scale: 1.1, duration: .3, yoyo: true, repeat: 1 }, ts('حصرية') + .2);
}
/* S9 where to find it (27.7-30.7) */
{
  const c = card(27.72, 30.7, { y: 250, h: 380, cls: 'brand', html: `
    <div style="text-align:center"><span class="pillk st hid" style="background:#fff;color:var(--brand)">STORE</span></div>
    <img class="hero-logo lg" src="../assets/logo_white.png" style="width:560px;clip-path:inset(0 100% 0 0);opacity:1">` });
  pop($q(c, '.st'), 27.85, { s: .5 });
  tl.fromTo($q(c, '.lg'), { clipPath: 'inset(0 100% 0 0)', scale: 1.08 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: .7, ease: 'power3.out', immediateRender: false }, 27.9);
  cue(27.9, 'thud', 1);
}
/* S10 dates 10 -> 30 Nov (31.3-34.35) */
{
  const c = card(31.3, 34.35, { y: 250, h: 360, html: `
    <div class="eyebrow" style="justify-content:center"><i></i>NOVEMBER</div>
    <div class="row" style="direction:ltr;justify-content:center;gap:0;margin-top:26px;position:relative">
      <div class="tile d1 hid" style="width:200px;height:170px;font:900 74px Inter;padding:0">10</div>
      <svg width="260" height="40" viewBox="0 0 260 40"><path class="ln" d="M10 20H240" stroke="#FF6F61" stroke-width="7" stroke-linecap="round" fill="none"/><path class="ar" d="M222 6L246 20L222 34" stroke="#FF6F61" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0"/></svg>
      <div class="tile lit d2 hid" style="width:200px;height:170px;font:900 74px Inter;padding:0">30</div></div>` });
  const t1 = ts('10'), t2 = ts('30');
  pop($q(c, '.d1'), 31.55, { s: .5 }); draw($q(c, '.ln'), t1 + .3, .7); tl.to($q(c, '.ar'), { opacity: 1, duration: .15 }, t1 + .95);
  pop($q(c, '.d2'), t2 - .05, { s: .4, snd: 'chime' });
}
/* S11 heart: we pick the best (34.5-39.4) */
{
  const c = card(34.55, 39.4, { y: 250, h: 420, html: `
    <div class="eyebrow" style="justify-content:center"><i></i>GLOW COSMETICS STORE</div>
    <div style="position:relative;height:230px;margin-top:14px">
      ${[0, 1].map(() => `<div class="rg" style="position:absolute;left:50%;top:50%;width:170px;height:170px;margin:-85px 0 0 -85px;border-radius:50%;border:3px solid var(--coral);opacity:0"></div>`).join('')}
      <div class="tile lit hh hid" style="position:absolute;left:50%;top:50%;width:176px;height:176px;margin:-88px 0 0 -88px;border-radius:50%;padding:42px">${ico('heart', 'fill:rgba(255,255,255,.18);stroke-width:3.6')}</div></div>
    <div class="h1 tx hid" style="text-align:center;margin-top:4px">بنختارلك <span class="acc">الأفضل</span></div>` });
  pop($q(c, '.hh'), 34.9, { s: .4, ease: 'back.out(2.6)' });
  $a(c, '.rg').forEach((r, i) => tl.fromTo(r, { opacity: .8, scale: 1 }, { opacity: 0, scale: 2.2, duration: 1.1, ease: 'power2.out', immediateRender: false }, 35.2 + i * .5));
  fade($q(c, '.tx'), ts('الأفضل') - .25, .4);
  tl.to($q(c, '.hh'), { scale: 1.1, duration: .35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, ts('الأفضل'));
}
/* OUTRO */
{
  const o = document.getElementById('outro'), lg = $q(o, 'img');
  tl.to(o, { clipPath: 'inset(0% 0 0 0)', duration: .55, ease: 'power4.inOut' }, 40.25);
  tl.fromTo(lg, { opacity: 0, scale: .9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: .8, ease: 'expo.out', immediateRender: false }, 40.65);
  tl.to(lg, { scale: 1.04, duration: 1.2, ease: 'sine.inOut' }, 40.85);
  cue(40.25, 'swell', 1); cue(40.7, 'chime', 1);
}
buildCaptions();
finish(42.4);
