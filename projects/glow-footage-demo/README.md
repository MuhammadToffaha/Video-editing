# glow-footage-demo  (/glow FOOTAGE mode on an uncut single take)

Source: the first doctor clip (one continuous shot, no cuts, 478x850 WhatsApp). `autocut.py` removed 2.9 s of dead air (4 cuts) and added 10 soft punch-in zooms
(1.0 <-> 1.13 alternating at sentence starts) so the framing changes every few seconds; the speaker sits in a rounded plum-outlined card on the pastel Glow backdrop;
cosmetics stickers / bubbles / logo card pop in the clear area above him on his words; variety-style captions; logo; SFX; -14 LUFS.
Final: `out/glow-footage-demo.mp4` (1080x1920, 30 fps, 56.1 s). Footage is soft (low-res source upscaled), graphics are crisp.
Pipeline: see `.claude/skills/glow/SKILL.md` -> "FOOTAGE mode". Transcript phrases = `data/transcript.source.json` (remapped by autocut; original in `transcript.source.orig.json`).
