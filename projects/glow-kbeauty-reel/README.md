# video-editing

Short-form (Reels / TikTok / Shorts) edit pipeline. First project: **Glow Cosmetics - Korean skincare announcement** (Egyptian Arabic, 57 s, 1080x1920 @30).

## What it does
- Word-synced Arabic captions (Cairo ExtraBold), active-word highlight, accent pills on key words/brands.
- Motion-graphics cards keyed to the spoken words: K-Beauty hook, brand chips (COSRX / Dr. Althea / Axis-Y), skincare categories,
  product-to-skin match diagram, trending/popular strike-through, authenticity + trusted-source flow, quality stars,
  guided-choice checklist, roadmap, growth chart, trust.
- Camera punch-ins on sentence starts, slow drifts between them. Logo: watermark, hero reveal at the brand mention, end card.
- Procedural SFX (whoosh / pop / tick / chime / thud) placed from the same cue list the animations use.
- Voice kept as recorded (HPF + light compression + loudness to -14 LUFS).

## Rebuild
```
scripts/fetch_asr_model.sh                                  # only if re-transcribing
END=55.6 scripts/01_prepare.sh input/source.mp4             # frames + audio -> work/ (END cuts the CapCut end card)
python3 -I scripts/build_transcript.py work/asr16k.wav      # data/transcript.source.json -> data/transcript.json
echo "window.TRANSCRIPT=$(cat data/transcript.json);" > composition/transcript.js
LAST_SRC_FRAME=1657 scripts/02_render_all.sh                # headless Chromium, 4 workers -> work/out/*.jpg
node scripts/render.mjs cues work/cues.json && python3 -I scripts/sfx.py work/cues.json work/sfx.wav
OUT=out/glow-kbeauty-reel.mp4 scripts/03_mix_and_encode.sh
```
Needs: ffmpeg, Node + Playwright (Chromium), Python + numpy/Pillow, `npm i`. Reusable version of this pipeline: `../../skills/short-form-video-editor`.

## Editing the content
- Captions/timing: `data/transcript.source.json` (phrase start/end + text, `*` marks key words).
- Graphics: `composition/scene.js` (one block per scene, times derived from word lookups such as `ts('COSRX')`).

## Known limits
- Source is 478x850, so it is upscaled ~2.3x; graphics/captions are crisp, the footage is soft. Re-export from the original phone file for a sharper result.
- Transcript came from automatic speech recognition + manual cleanup, word timing is distributed within pause-anchored phrases.
  Lowest confidence: 36.1-38.1 s ("بصورتها الأصلية") and the 4th brand name at ~15.5 s ("سينتلا"). Verify by ear before publishing.
