# glow-kbeauty-whiteboard  (whiteboard-explainer cut of the Glow reel)

The speaker's footage is removed. His ORIGINAL Arabic voice narrates over a hand-drawn whiteboard explainer: white paper, doodles that draw themselves under a
marker-holding hand (the hand follows the pen tip of whatever is being drawn), handwritten labels (Baloo Bhaijaan 2 / Bebas Neue / Permanent Marker),
orange-coral "K-BEAUTY" banner + sketch label box per section, a table, charts, brand-colour logo. Captions keep the reel's style (Cairo ExtraBold,
active-word highlight, coral pills). Scribble + paper-swipe SFX synthesized from the same cue list. Final: `out/glow-kbeauty-whiteboard.mp4` (1080x1920, 30 fps, 57 s, -14 LUFS).

Everything is keyed to the word timings in `data/transcript.json` (`ts('word')` in `composition/wb.js`): edit scenes there.
Rebuild (needs `work/voice_raw.wav` = original audio, no frames needed):
```
ffmpeg -t 55.6 -i input/source.mp4 -vn -ac 2 -ar 48000 work/voice_raw.wav
scripts/02_render_all.sh                      # headless Chromium, 4 workers
node scripts/render.mjs cues work/cues.json && python3 -I scripts/sfx.py work/cues.json work/sfx.wav
OUT=out/glow-kbeauty-whiteboard.mp4 scripts/03_mix_and_encode.sh
```
Engine notes: doodles = SVG paths drawn with stroke-dashoffset + colour fill after the outline; text = clip-path wipe while a zig-zag pen path drives the hand;
`penPos()` glides the hand between drawings and parks it off-screen in long gaps. Same transcript caveats as the reel (low-confidence: 36-38 s, 4th brand omitted).
