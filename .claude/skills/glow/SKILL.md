---
name: glow
argument-hint: "[explainer (default) | footage | whiteboard | dub <language> | captions-only] [notes]  - attach the video, optionally a logo/photos"
description: /glow - Glow Cosmetics' one-command video studio for EVERY editing / montage job (Reels, TikTok, Shorts). Upload a video and type /glow. EXPLAINER (default) removes the speaker's picture, keeps only his voice and rebuilds the video as the Glow Korean sticker-pop explainer; FOOTAGE keeps the speaker and edits an UNCUT single take into a viral-paced video (auto jump-cuts of dead air, alternating punch-in zooms, speaker in a rounded pastel frame, kawaii cosmetics stickers popping on the spoken words, variety-show captions); also whiteboard drawing style and dub/translate with lip-sync. Always the Glow look - logo coral #CD5A50 + plum outlines + pastel cosmetics stickers, outlined captions, synthesized SFX, -14 LUFS. Use whenever the user types /glow or asks to edit, montage, caption or make a reel/short/TikTok for Glow Cosmetics. Runs fully offline in the cloud sandbox (ffmpeg + headless Chromium + GSAP + sherpa-onnx Whisper).
---

# /glow - Glow video studio (AUTOPILOT)

The user attaches a video (+ optionally a logo, product photos) and types `/glow`. Do the WHOLE job without asking questions; stop only if something truly blocks you (no video, no ffmpeg). Text after `/glow` = notes (mode, style, language, brand colour): apply them. Tell the user once, in one line, it takes ~15-25 min, then work silently.

## Which mode? (route by what the user says, never ask)
| The user says / the input is | Mode | Template |
|---|---|---|
| nothing special, "make this video", "only his voice", "remove the picture of the doctor", "explain it with stickers" | **EXPLAINER** (default): no speaker picture, his voice narrates sticker-pop scenes | `template/` |
| "keep the video / the doctor", "edit this video", "single shot", "one take / no cuts", "add captions/graphics on it", "montage" of footage | **FOOTAGE**: the uncut take is auto-cut + punch-in zoomed, framed in the Glow card, stickers + captions + logo on top | `template/` (footage options) |
| "captions only" | FOOTAGE with an empty `scenes.js` (just `finish({... footage:true})`) - captions + logo + outro, nothing else | `template/` |
| "hand drawn", "whiteboard" | **WHITEBOARD** | `projects/glow-kbeauty-whiteboard` |
| "English / translate / lip-sync / dub" | **DUB** (on top of footage mode) | scripts in `template/scripts` |
| product photos / stills attached | use `photo(sc, src, {...})` polaroid cards in EXPLAINER or FOOTAGE scenes | `template/` |
If the message does not say, build the EXPLAINER and mention in the summary that `/glow footage` keeps the speaker on screen.

## Glow brand kit (always)
Logo coral `#CD5A50` (`assets/logo_brand.png` for pastel backgrounds, `assets/logo_white.png` for the coral outro, `logo_original.png` = source; all already in `template/assets/`), plum `#5B3A5E` outlines, pastel pink-cream-lavender backdrop, accents rose `#FF9EBB` / yellow `#FFE066` / mint `#7ADFC4` / lavender `#C7B8FF`. Fonts: Cairo ExtraBold (captions), Baloo Bhaijaan 2 (Arabic bubbles), Bebas Neue (Latin product names). Cosmetics sticker library (lipstick, lip gloss, nail polish, compact, cushion, palette, brushes, mascara, perfume, sheet mask, cotton pad, sunscreen, cleanser, serum, jar, tubes ...). Output 1080x1920 @30, H.264/AAC, -14 LUFS. Reference projects in the repo: `projects/glow-panoxyl` (explainer, health talk), `projects/glow-footage-demo` (footage on an uncut take), `projects/glow-kbeauty-viral`, `projects/glow-kbeauty-whiteboard`, `projects/glow-kbeauty-reel` (old dark style).

## Steps (explainer mode)
1. **Inputs**: newest video in the session uploads (`ls -t /root/.claude/uploads/*/*.{mp4,mov,webm}` or the path in the message). Logo = attached image if any, else `assets/logo_*.png` of the last Glow project (Glow Cosmetics logo is in `projects/*/assets/`). Tell the user once, in one line, it takes ~15-25 min, then work silently.
2. **Project**: this skill's folder holds `template/`. `cp -r template/. <project>/` where `<project>` = `projects/glow-<topic>/` inside the Video-editing repo clone (else the scratchpad). Keep `work/` out of git (`.gitignore` is in the template).
3. **Deps** (once): ffmpeg, Node + Playwright Chromium (`/opt/pw-browsers`; never run `playwright install`; render.mjs finds `/opt/node-tools`), `pip install numpy pillow sherpa-onnx`, `scripts/fetch_asr_model.sh`. Sandbox network: GitHub releases + npm + PyPI work, huggingface does not.
4. **Voice + transcript**: `ffmpeg -t <speech_end> -i src -vn -ac 2 -ar 48000 work/voice_raw.wav` (his ORIGINAL voice is the narration) and `ffmpeg -i src -vn -ac 1 -ar 16000 work/asr16k.wav`. Source may be AV1 - ffmpeg decodes it. Check the first frames: burned-in captions (often orange) are a free cross-check for the transcript.
   - `python3 -I scripts/asr_chunks.py work/asr16k.wav <lang|auto> 3.2 a`, again with 2.4 and 4.5; merge the three hypotheses (Whisper truncates chunk tails) and fix with your own language knowledge.
   - Unclear words/names: `python3 -I scripts/asr_probe.py work/asr16k.wav ar,en 5.0-7.3 6.6-9.4 ...` (the `en` pass spells Latin product names). Trust only what is consistent across overlapping windows; list the rest as LOW-CONFIDENCE in your final message.
   - Whisper hallucinates phrases on trailing silence ("اشتركوا في القناة" etc.): cut the voice at the last real speech (`pauses.py` shows it).
5. **Timing**: `python3 -I scripts/pauses.py work/asr16k.wav`; write `data/transcript.source.json` = `{"max_chars":21,"max_words":4,"phrases":[[start,end,"text with *key words"],...]}` (phrase edges = pauses; NBSP inside multi-word Latin names such as `PanOxyl Acne Wash`; `*word` = yellow key word). `python3 -I scripts/build_transcript.py work/asr16k.wav && echo "window.TRANSCRIPT=$(cat data/transcript.json);" > composition/transcript.js`. (If the project's `scripts/` was copied from an older project, re-copy build_transcript.py from this template - older copies ignore `max_chars`.)
6. **Scenes**: write `composition/scenes.js` (see API below, example in the template; `projects/glow-panoxyl/composition/scenes.js` is the best model). One scene per spoken idea, stickers pop ON their word via `ts('word')`; finish with `finish({ duration: <voice end + ~1.8>, outroAt: <voice end + .5> })`. Put the logo in `assets/logo_brand.png` (brand-colour, for the pastel backdrop) and `assets/logo_white.png` (outro): `python3 -I scripts/extract_logo.py logo.png assets/logo_white.png`, then recolour the alpha to the brand colour for `logo_brand.png`.
7. **QA by eye, then render**: `node scripts/render.mjs <f> <f+1> work/test` for ~12 key frames, contact-sheet them with Pillow and LOOK (empty scenes, overflowing captions, wrong icons). Then `scripts/02_render_all.sh` (4 workers, no source frames needed in explainer mode, ~3-4 min), `node scripts/render.mjs cues work/cues.json && python3 -I scripts/sfx.py work/cues.json work/sfx.wav`, `OUT=out/<name>.mp4 scripts/03_mix_and_encode.sh` (reads `work/voice_raw.wav`).
   - Do not use `pkill -f render.mjs` in a Bash call whose own text contains that string (it kills the shell): use `pkill -f "[r]ender.mjs"`.
8. **Deliver**: `SendUserFile` the mp4 (display render); short summary: what was drawn per section, LOW-CONFIDENCE transcript spots, "audio not auditioned by ear (only loudness-checked)". Commit the project (without `work/`) + final mp4 and push to the session's designated branch (or `main` for the Video-editing repo if none given); never open a PR unless asked.

## Content rules (esp. health / skincare / medical talk)
- The visuals only ILLUSTRATE what he says. Never add numbers, percentages, concentrations, results, before/after, "100%", prices or claims he did not say. Keep his caveats prominent (irritation/dryness, patch/sensitive skin, "see a dermatologist").
- Product and ingredient names exactly as spoken (typed names are fine; do not copy third-party packaging/logos).
- Text on stickers/bubbles = key words he says, not new copy. Generic labels only where unavoidable.
- If the talk is dermatology advice, keep a calm tone: no alarming red flashing, no "cure" imagery.

## Look (Glow sticker-pop)
Pastel pink-cream-lavender backdrop + floating hearts/stars/sparkles; die-cut white-outlined kawaii stickers with soft shadows that bounce in and idle-wiggle; bubble text with highlighter strokes; ranking cards; fat plum-outlined captions (key words yellow, active word pops pink); brand-colour logo top-centre; coral logo end card; SFX = pop/tick/whoosh/chime/sparkle/thud/swell (quiet, ~-10 dB under the voice). Output 1080x1920 @30, H.264/AAC, -14 LUFS.
Layout (scene coordinates, the lib adds +140 px): content y 150-1250, x 40-1040; captions sit at y 1520; keep top 130 px (logo) and bottom 200 px free. Rows of 4 stickers: s~2.0-2.2 at x = 40/290/540/790.

## Scene API (composition/glow-lib.js)
- `scene(t0,t1)` -> `sc` (fades in at t0, out at t1; whoosh).
- `sticker(sc, name, { x, y, s=2, t, rot=0, wig=3.2, sparks=true, snd='pop', v=.55 })` -> `{pop, cx, cy}`. Position = top-left of the 100x100 box scaled by s (a 1.18x size boost is built in around the centre). `shake(st,t,n,amp)`; `vanish(st,t)` (define in scenes.js: scale to 0).
- `bubble(sc, textOrHtml, { x, y, w, size, t, cls:'' | 'pink' | 'yel' | 'lat' | combos, rot, html:true })` - pill text; `<span class="hl">` = yellow highlighter; `lat` = Bebas Latin (product names).
- `pill(sc, txt, { x, y, t, w, size })` small label; `.card` ranking card via `div('card', {top, background}, sc.wrap)` (+ `.no`, `.nm` children) - see glow-panoxyl/glow-kbeauty-viral S5.
- `burst(sc, cx, cy, t, n, R)` heart/sparkle burst; `cue(t,type,vol)` SFX (pop, tick, whoosh, chime, sparkle, thud, swell, rise); `ts('word', nth, after)` start time of a spoken word (single words only: multi-word tokens are separate; throws if missing).
- `photo(sc, src, { x, y, w, h, t, rot, tape })` polaroid photo card (product photo / clip still).
- `finish({duration, outroAt, footage=false, framed=true})` builds watermark, outro, captions, camera, seek. Call last.
- Row/checklist pattern: sticker (x 790) + `pill` (x 170,w 580) + `check` sticker (x 40) popping +0.55 s after the word.
- Stickers (ICONS): lipstick, lipgloss, nailpolish, compact, cushion, palette, brush, blushbrush, mascara, perfume, sheetmask, cottonpad, sunscreen, foam, guasha, dropper, jar, bottle, washbottle, tube, pumpb, gift, bubbles, drop, heart, star, spark, flame, shield, chat, flask, info, molecule, microscope, stethoscope, clipboard, bandage, pimple, faceacne, redface, dryface, cactus, germ, face, factory, store, play, eyes, burst, qmark, check, cross, plus, arrowR, arrowL, arrowUp, warning, percent, clock, calendar, dice, refresh, magnifier, lock.
  Add one = an entry `{ kw:[x,y]|null, s:[{d, f, c, w}, ...] }` in a 100x100 box (`C(cx,cy,r)` makes circles; `kw` adds a kawaii face). Use pastel fills + the plum outline default. Draw something that really reads at 200 px (the first "pimple" looked like a target - check on a contact sheet).

## OTHER MODES
### FOOTAGE mode - edit an UNCUT single take (the speaker stays on screen)
Same steps as the explainer (inputs, deps, transcript, phrases) with these differences; worked example `projects/glow-footage-demo` (`composition/scenes.footage.example.js` in the template).
1. `END=<speech end + .3> scripts/01_prepare.sh input.mp4` -> `work/frames` (1080x1920 upscaled, denoised), `work/voice_raw.wav`, `work/asr16k.wav`. (Low-res phone/WhatsApp sources are fine: tell the user the footage is soft, the graphics are crisp. If the source ends with a CapCut/WhatsApp end card keep `END` before it.)
2. Transcribe + write phrases on the ORIGINAL timeline exactly as in the explainer steps (data/transcript.source.json).
3. **Auto-cut**: `python3 -I scripts/autocut.py --phrases data/transcript.source.json` (options `--min-gap .4 --keep .12 --punch-every 3.2 --zooms 1.0,1.13 --face .5,.55 --no-zoom`). It trims dead air (cuts frame-aligned, 6 ms audio fades), writes the edited `work/voice_raw.wav` + `work/asr16k.wav`, `work/framemap.json` (the renderer picks source frames through it), `composition/camera.js` (zoom flips at every hard cut and at sentence starts >= `--punch-every` apart, soft 0.22 s punch-in) and remaps the phrases to the NEW timeline. Safe to re-run (it always cuts from `*_orig.wav` backups). Prints the exact `finish({...})` line. Set `--face` to the speaker's face centre (fraction of the card) so zooms push toward the face.
4. `python3 -I scripts/build_transcript.py work/asr16k.wav` (the EDITED audio) + `composition/transcript.js`. Everything after this is in EDITED time.
5. **Scenes** (`composition/scenes.js`): same API as the explainer, but the speaker is on screen, so keep stickers/bubbles in the clear area ABOVE him (scene y ~60-560, which lands at card y 220-700 after the built-in +140 shift; check where the face is on a test frame and keep stickers off it), sizes s~1.1-1.9, at most ~4 objects at once, text bubbles <= ~6 words. Reuse the same ideas (brand list, row of cosmetics, check/cross, shield, stars, logo card on the brand mention). End with `finish({ duration, outroAt, footage: true })`; `framed: false` makes the video full-bleed instead of the rounded card.
6. Render with `scripts/02_render_all.sh` (needs `work/frames` + `work/framemap.json`), cues, `sfx.py`, mix with `scripts/03_mix_and_encode.sh` (uses the edited `work/voice_raw.wav`). The speaker's own audio is kept (cleaned, -14 LUFS); SFX stay ~10 dB under.
- Captions sit at y 1520 inside the card; the card is 900x1600 at (90,190) with plum outline + pastel scrims top/bottom.
- If the source already has burned-in captions or logos (e.g. the PanOxyl clip), warn the user: they will clash with the Glow captions - prefer EXPLAINER for such sources, or `--face`/`framed:false` crops cannot hide them.
- `template-footage-classic/` = the old dark glass-card footage look; only on request.

### whiteboard mode
Reference `projects/glow-kbeauty-whiteboard` (`wb.js`): white paper, SVG doodles drawn by a marker-holding hand that follows the pen tip, handwritten labels; no source frames needed. Keep the drawing zone y~420-1500, nothing wider than ~960 px, check bars/labels for clipping and captions for collisions.

### dub mode - translate + new voice + lip-sync
1. Script: `data/phrases.<lang>.json` = `[[win_start, win_end, "text with *key words and DISPLAY|spoken overrides"], ...]`, keep the ORIGINAL phrase windows, ~2.5-3 words/s, no new claims. 2. `scripts/fetch_dub_models.sh`. 3. Voice: `work/ref.wav` = ~15 s of the speaker's clean speech; `python3 -I scripts/tts_clone.py data/phrases.en.json work/ref.wav 8 <total_s>` (YourTTS zero-shot clone, best-of-N by Whisper read-back, 0.72-1.25x time-fit; timbre/pitch transfer, NOT a native accent - say so). Fallback `tts_phrases.py` (stock Kokoro). 4. Lips on ORIGINAL-resolution frames: `ffmpeg -t <end> -i src -vf fps=30 work/raw/%05d.png`; `MODELS=work/models python3 -I scripts/lipsync2.py work/raw work/en16k.wav work/ls --model wav2lip_gan_96.onnx --enhance 0.7` (landmark-aligned Wav2Lip + GFPGAN, ~25-30 min per minute of video; never the old `lipsync.py`); `scripts/01b_upscale_lipsynced.sh`. 5. Prove sync with mouth-crop strips against the audio envelope (closed in silence, varied in speech). 6. Rebuild transcript from the new audio, rewrite scene copy (LTR for English), render, mix with `VOICE=work/voice_en.wav`. 7. Be honest: soft mouth at ~100 px faces, original head/hand motion, synthetic voice, speaker must approve a dubbed likeness, label as AI-dubbed.

## Pitfalls already solved
- `str.split()` splits NBSP: build_transcript uses `split(' ')`. Look up single words with `ts()`.
- SVG `<rect>` + CSS scaleY breaks in headless Chromium: tween `attr:{y,height}`. Hidden-at-start elements need CSS/attr opacity 0 and `immediateRender:false` tweens (workers seek straight to their frame range).
- Arabic needs Chromium + Cairo/Baloo woff2 (unicode-range split); Pillow/ffmpeg drawtext cannot shape it. Thick `-webkit-text-stroke` merges neighbouring Arabic letters above ~10 px; caption chunks above ~21 characters overflow at 74 px.
- Whisper (sherpa-onnx) has no word timestamps and drops chunk tails -> short windows + pause anchoring; words get distributed by syllable weight inside pause-bounded phrases.
- opencv 5.x lost `CascadeClassifier` (pin 4.10.0.84, numpy<2.3). TTS reads `COSRX` as letters: use `DISPLAY|spoken`.
- Empty scenes look broken: start a scene on its first spoken word or add an intro sticker.
- GitHub MCP `create_repository` can 403: ask the user to create the repo, then `add_repo` and clone to a fresh dir.
- Re-running autocut on already-cut audio used to corrupt the edit: it now backs up and always reads `asr16k_orig.wav` / `voice_orig.wav`.
- Footage mode needs `work/frames`; explainer mode must not set `footage` (render.mjs only loads frames when the page is in footage mode).
- The command checker can fail transiently: retry once, use read-only tools meanwhile.

Install: this skill lives in `.claude/skills/glow/` of https://github.com/MuhammadToffaha/Video-editing (a Claude Code session opened on that repo gets `/glow`); `dist/glow.zip` is the same folder for uploading as a skill elsewhere.
