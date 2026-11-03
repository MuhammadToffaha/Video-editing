// node render.mjs frames | cues <out.json> | <startFrame> <endFrame> <outDir>
// Env: LAST_SRC_FRAME = last clean source frame number (freeze it afterwards, e.g. to hide a trailing end card)
import { createRequire } from 'module';
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
let chromium;
for (const base of [process.env.PW_NODE_MODULES, '/opt/node-tools/node_modules/', process.cwd() + '/node_modules/', '/usr/lib/node_modules/'].filter(Boolean)) {
  try { ({ chromium } = createRequire(base.endsWith('/') ? base : base + '/')('playwright')); break; } catch {}
}
if (!chromium) { console.error('playwright not found: npm i playwright (or set PW_NODE_MODULES)'); process.exit(1); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30; let SRC_FRAMES = 0; try { SRC_FRAMES = fs.readdirSync(path.join(root, 'work/frames')).length; } catch {} const LAST = +(process.env.LAST_SRC_FRAME || SRC_FRAMES);
const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('PAGEERROR', e.message); process.exit(1); });
await page.goto('file://' + path.join(root, 'composition/index.html'));
await page.waitForFunction('window.ready === true');
await page.evaluate(() => document.fonts.ready);
const mode = process.argv[2];
if (mode === 'frames') console.log(Math.round(await page.evaluate(() => window.DURATION) * FPS));
else if (mode === 'cues') fs.writeFileSync(process.argv[3], JSON.stringify(await page.evaluate(() => ({ cues: window.CUES, duration: window.DURATION })), null, 1));
else {
  const [a, b, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
  fs.mkdirSync(out, { recursive: true });
  for (let f = a; f < b; f++) {
    const src = Math.min(f + 1, SRC_FRAMES, LAST);
    const url = 'file://' + path.join(root, 'work/frames', `f_${String(src).padStart(5, '0')}.jpg`);
    await page.evaluate(async ([u, t]) => {
      const im = document.getElementById('bg');
      if (im && im.dataset.u !== u) { im.src = u; im.dataset.u = u; await im.decode(); }
      window.seek(t);
    }, [url, f / FPS]);
    await page.screenshot({ path: path.join(out, `${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
  }
}
await browser.close();
