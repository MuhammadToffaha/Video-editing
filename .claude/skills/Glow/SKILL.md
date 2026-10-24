---
name: Glow
argument-hint: "[optional: language, brand colour, style notes, logo attached as image]"
description: Turn a talking-head / spoken video into a polished, high-retention Reel/TikTok/Short - word-synced captions (Arabic/RTL and English), animated key-word callouts, infographics/diagrams/UI cards timed to what is said, camera punch-ins, brand logo placement, subtle synthesized SFX, loudness-normalized audio. Use when the user attaches a video and asks to edit it professionally, add captions/motion graphics/infographics/SFX/logo, or make a reel/short from it. Works fully offline in the cloud sandbox (ffmpeg + headless Chromium + GSAP + sherpa-onnx Whisper).
---

# AUTOPILOT - what to do when the user types `/Glow`
The user uploads a video (and optionally a logo image) and types the command. Every video made with this skill is a Glow Cosmetics video: the Glow brand outro is always appended. Do the WHOLE job without asking questions; only stop if something truly blocks you (no video found, no ffmpeg). Extra text after the command = style/brand notes, apply them.

1. **Find inputs**: newest video in the session uploads (`ls -t /root/.claude/uploads/*/*.{mp4,mov,webm}` or the path given in the message); logo = an attached image if any (no logo -> skip watermark/hero/outro-logo, use a clean text-free outro). Language = auto-detect with `asr_chunks.py ... auto`.
2. **Locate the toolkit**: this skill's folder (the directory containing this SKILL.md) holds `template/`. Work in a new project folder: inside the Video-editing repo clone as `projects/<slug>-<YYYYMMDD>/` when that repo is in the session, otherwise in the scratchpad. `cp -r template/. <project>/`.
3. **Check/install deps** (once): `ffmpeg`, Node + Playwright Chromium (`/opt/pw-browsers`, never run `playwright install`), `pip install numpy pillow sherpa-onnx`, `scripts/fetch_asr_model.sh`. No network for huggingface; GitHub releases + npm + PyPI work.
4. Run the **Workflow** below end to end, making design decisions yourself (brand colour from the logo; otherwise coral/teal tech palette; scenes chosen from `reference/scene-patterns.md` to fit what is actually said).
5. **Deliver**: append the Glow outro (`scripts/04_append_outro.sh out/name.mp4 out/name_final.mp4`; see below), then `SendUserFile` the final mp4 (display render), then a short summary: specs, what graphics were added, LOW-CONFIDENCE transcript spots to verify by ear, footage-resolution caveat, "audio not auditioned". Save the project (without `work/`) and the final mp4 into the repo and push to the session's designated branch (or `main` if none was given). Never create a PR unless asked.
6. Expect ~15-25 min for a 60 s video (transcription ~3 min, rendering ~4 min, encoding ~2 min). Tell the user at the start in one line, then work silently until done.


# Short-form video editor (captions + motion graphics + SFX)

Pipeline proven on a 57 s Egyptian-Arabic pharmacy promo (Glow Cosmetics). Output: 1080x1920 @30, H.264/AAC, -14 LUFS.
Worked example project: `projects/glow-kbeauty-reel/` in https://github.com/MuhammadToffaha/Video-editing

## Rules that define "professional, not template"
- Keep the speaker, voice and meaning untouched. Never invent claims (numbers, "100%", prices). If a graphic needs text that was not spoken, keep it generic (category names, eyebrow labels).
- Every visual supports a spoken phrase and is triggered ON the word (`ts('word')`), not on a phrase start. Cards exit before the next one enters; no overlapping ghosts.
- One visual language: brand colour (sample it from the logo) + white + deep ink glass panels, Inter for Latin labels, Cairo (Arabic) for headlines/captions. Mint only for success states.
- Layout zones (1080x1920, speaker's face ~y 790-1110): cards y 235-735 (never over the face, even after 1.15x zoom), captions y~1545, keep bottom 220 px and top 130 px free of key content (platform UI). Re-check the face position for each source.
- Retention devices, in moderation: punch-in snap (1.12-1.15x) on sentence starts with slow drifts between, a graphic every 2-4 s, active-word caption highlight, strike-through / check / count-up micro-animations, hero logo moment when the brand is said, brand end card.
- SFX: whoosh on card-in, pop/tick on elements, chime on success, thud on logo. Quiet (about -10 dB under voice). No music unless the user supplies it.

## Glow outro (mandatory, last step of every video)
`template/assets/glow_outro.mp4` (10 s, 1280x720, Glow Cosmetics logo reveal with its own audio) is appended to the END of every video: `scripts/04_append_outro.sh out/name.mp4 out/name_final.mp4`. It fits the 16:9 clip to the reel width over a blurred copy of itself (logo never cropped) and cross-fades 0.4 s (`XF=`). With this outro in place, skip the built-in brand end card in `scene.js` (keep only the voice end + ~0.3 s) so the brand is not shown twice. Final length = reel + 9.6 s. Deliver the `_final` file.

## Workflow
1. **Inspect**: `ffprobe`, contact sheet (`ffmpeg -vf "fps=1/6,scale=239:-1,tile=5x2"`), find trailing end cards (WhatsApp/CapCut black frame) and note speaker position. Source is usually low-res (phone/WhatsApp): upscale with lanczos, tell the user footage will be soft while graphics stay crisp.
2. **Project**: `cp -r <skill>/template/. my-project/ && cd my-project`; `cp <logo> assets/`; `python3 -I scripts/extract_logo.py assets/logo_original.png assets/logo_white.png` (prints brand hex). Update `--coral/--brand` in `composition/style.css` and `#wm`/`#outro`.
3. **Prepare**: `END=<trim seconds> scripts/01_prepare.sh input.mp4` (frames, 16k wav, voice).
4. **Transcribe** (no HF access in sandbox; GitHub releases work): `scripts/fetch_asr_model.sh`; then
   - `python3 -I scripts/asr_chunks.py work/asr16k.wav <lang|auto> 3.2 a`, repeat with 2.4 and 4.5. Whisper truncates chunk tails; merge the 3 hypotheses yourself and fix with your own language knowledge.
   - Uncertain words / brand names: `python3 -I scripts/asr_probe.py work/asr16k.wav ar,en 14.0-16.8 14.5-16.6 ...` (the `en` pass spells Latin brand names). Trust only what is consistent across overlapping windows; list the rest as LOW-CONFIDENCE in the final message and README. Do not build graphics on guessed names.
5. **Timing**: `python3 -I scripts/pauses.py work/asr16k.wav` -> pauses are the reliable phrase boundaries. Write `data/transcript.source.json` as `[start, end, "text"]` phrases (see `data/transcript.source.example.json`; `*word` = accent pill; use NBSP inside multi-word Latin names; Latin brands in RTL text: avoid gluing the Arabic `و` prefix to them, write `و Brand`). Then `python3 -I scripts/build_transcript.py work/asr16k.wav` and `echo "window.TRANSCRIPT=$(cat data/transcript.json);" > composition/transcript.js`. It distributes word times by syllable weight inside each phrase and snaps to energy valleys, then makes balanced 2-4 word caption chunks. Sanity check: no word onset inside silence.
6. **Design scenes** in `composition/scene.js` (see `reference/scene-patterns.md`). Use `card(t0,t1,{y,h,html})`, `pop`, `fade`, `draw`, `cue`, `ts`. Take the example scenes as patterns: hook card, brand chips (skeleton slots that fill when each name is said), category tiles, A->B match diagram with travelling dot + check, struck-through chips, flow nodes, star rating, checklist rows, roadmap, bar chart, trust rings, hero logo reveal, brand outro. Set `finish(<seconds>)` = voice end + ~1.7 s outro.
7. **Render + QA**: render a few test frames first (`node scripts/render.mjs <f> <f+1> work/test`), build contact sheets with Pillow, LOOK at them. Then `scripts/02_render_all.sh` (4 workers, ~8 fps total), `node scripts/render.mjs cues work/cues.json && python3 -I scripts/sfx.py work/cues.json work/sfx.wav`, `OUT=out/name.mp4 scripts/03_mix_and_encode.sh`. If the source ends with an end card, pass `LAST_SRC_FRAME=<n>` to freeze the last clean frame.
8. **Deliver**: send the mp4 (SendUserFile), state specs, the low-confidence transcript spots, the footage-resolution limit, and that audio was not auditioned by ear (you cannot hear it) - only checked with loudness meters and onset-vs-energy tests.

## Pitfalls already solved (do not re-learn)
- Python `str.split()` splits on NBSP - use `split(' ')` (already in build_transcript.py).
- Animating SVG `<rect>` with CSS `scaleY` flips/offsets it in headless Chromium - tween `attr:{y,height}` instead. Stroke draw-on: `draw(path,t,d)`.
- Elements that start hidden need CSS `opacity:0` (class `hid`) and tweens with `immediateRender:false`; every tween must be seekable (workers jump straight to their start frame).
- Cards with `backdrop-filter` only blur if the video frame is in the same page (`#bg` img) - that is why frames are composited in-page.
- Empty blurred cards look broken: either start the card on its trigger word or show dim placeholder rows/slots that light up when spoken.
- Arabic needs real shaping: Chromium + Cairo woff2 (unicode-range split Arabic/Latin) works; Pillow/ffmpeg drawtext does not.
- Whisper in sherpa-onnx has no word timestamps and truncates tails; hence short windows + pause anchoring.
- GitHub MCP `create_repository` can be 403 - ask the user to create the repo, then `add_repo` + clone (clone to a fresh dir if the path exists).
