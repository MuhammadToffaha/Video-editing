---
name: glow
argument-hint: "[optional: footage | whiteboard | dub <language> | style/brand notes]  (attach the video, optionally a logo image)"
description: /glow - Glow Cosmetics' one-command video studio for any video montage / editing job. Upload a video (e.g. the doctor talking to camera) and type /glow - by default it removes the speaker's picture, keeps ONLY his voice as narration, and rebuilds the video as the Glow Korean sticker-pop explainer (kawaii cosmetics/skin stickers popping on the exact spoken words, pastel backdrop with floating sparkles, variety-show outlined captions, brand logo, synthesized SFX, loudness-normalized). Options - keep the footage and add graphics, hand-drawn whiteboard style, or dub into another language with lip-sync. Use whenever the user types /glow or asks to edit/montage/make a reel, short or TikTok from a video. Runs fully offline in the cloud sandbox (ffmpeg + headless Chromium + GSAP + sherpa-onnx Whisper).
---

# /glow - Glow video studio (AUTOPILOT)

The user attaches a video (+ optionally a logo) and types `/glow`. Do the WHOLE job without asking questions; stop only if something truly blocks you (no video, no ffmpeg). Text after `/glow` = notes (mode, style, language, brand colour): apply them.

**Default mode = EXPLAINER**: no picture of the speaker, only his voice; every spoken idea becomes a sticker-pop scene in the Glow look (this is what the user asked for with the PanOxyl video). Other modes: `footage` (keep the speaker on screen, add captions + glass cards + camera punch-ins), `whiteboard` (hand-drawn doodles + marker hand), `dub <lang>` (translate + new voice + lip-sync). Same pipeline, different template.

Reference projects in the repo (copy their patterns): `projects/glow-panoxyl` (explainer, health content), `projects/glow-kbeauty-viral` (explainer), `projects/glow-kbeauty-whiteboard`, `projects/glow-kbeauty-reel` (footage).

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
- `finish({duration, outroAt})` builds watermark, outro, captions, seek. Call last.
- Row/checklist pattern: sticker (x 790) + `pill` (x 170,w 580) + `check` sticker (x 40) popping +0.55 s after the word.
- Stickers (ICONS): lipstick, lipgloss, nailpolish, compact, cushion, palette, brush, blushbrush, mascara, perfume, sheetmask, cottonpad, sunscreen, foam, guasha, dropper, jar, bottle, washbottle, tube, pumpb, gift, bubbles, drop, heart, star, spark, flame, shield, chat, flask, info, molecule, microscope, stethoscope, clipboard, bandage, pimple, faceacne, redface, dryface, cactus, germ, face, factory, store, play, eyes, burst, qmark, check, cross, plus, arrowR, arrowL, arrowUp, warning, percent, clock, calendar, dice, refresh, magnifier, lock.
  Add one = an entry `{ kw:[x,y]|null, s:[{d, f, c, w}, ...] }` in a 100x100 box (`C(cx,cy,r)` makes circles; `kw` adds a kawaii face). Use pastel fills + the plum outline default. Draw something that really reads at 200 px (the first "pimple" looked like a target - check on a contact sheet).

## OTHER MODES
### footage mode (keep the speaker on screen)
Use `template-footage/` (glass cards over the upscaled footage, caption highlights, camera punch-ins, brand outro): `END=<s> scripts/01_prepare.sh input.mp4`, then as above with `composition/scene.js` + `lib.js` (see `reference/scene-patterns.md`). Layout zones: face ~y 790-1110, cards y 235-735, captions y~1545. Source is often low-res: lanczos upscale, tell the user the footage is soft while graphics stay crisp. If the source ends with a CapCut/WhatsApp end card pass `LAST_SRC_FRAME=<n>`.

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
- The command checker can fail transiently: retry once, use read-only tools meanwhile.

Install: this skill lives in `.claude/skills/glow/` of https://github.com/MuhammadToffaha/Video-editing (a Claude Code session opened on that repo gets `/glow`); `dist/glow.zip` is the same folder for uploading as a skill elsewhere.
