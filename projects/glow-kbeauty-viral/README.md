# glow-kbeauty-viral  (Korean sticker-pop cut)

No footage. His original Arabic voice narrates over a pastel "healing" backdrop (pink-cream-lavender gradient, floating hearts/stars/sparkles), kawaii cosmetics stickers
with white die-cut outlines that bounce in on the spoken word and idle-wiggle, bubble text with highlighter strokes, ranking cards, outlined variety-show captions
(fat plum outline, key words yellow, active word pops pink). Final: `out/glow-kbeauty-viral.mp4` (1080x1920, 30 fps, 57 s, -14 LUFS).

Sticker library (`ICONS` in `composition/viral.js`): lipstick, lip gloss, nail polish, compact mirror, cushion, eyeshadow palette, makeup brush, blush brush, mascara, perfume,
sheet mask, cotton pad, sunscreen, cleanser foam, gua sha, serum dropper, cream jar, pump bottle, tube, gift box, heart, star, shield, chat, flask, factory, store + UI stickers.
Add an icon = one entry of path shapes (100x100 box); faces via `kw:[x,y]`.

Rebuild: `scripts/02_render_all.sh; node scripts/render.mjs cues work/cues.json; python3 -I scripts/sfx.py work/cues.json work/sfx.wav; OUT=out/glow-kbeauty-viral.mp4 scripts/03_mix_and_encode.sh`
(needs `work/voice_raw.wav` = original audio). Timings come from `data/transcript.json` via `ts('word')`.
