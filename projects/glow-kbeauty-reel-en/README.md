# glow-kbeauty-reel-en  (English dub + lip-sync of the Glow K-beauty reel)

Source: Egyptian-Arabic talking-head clip (see `../glow-kbeauty-reel`). This cut: English script, synthetic English voice (Kokoro, speaker `am_adam`),
Wav2Lip GAN lip-sync on the original-resolution frames, same visual system re-laid-out LTR (Inter), English captions/graphics keyed to the English words.
Final: `out/glow-kbeauty-reel-en.mp4` (1080x1920, 30fps, 57 s, -14 LUFS).

Rebuild (see `.claude/skills/short-form-video-editor/SKILL.md`, "Dub mode"):
```
scripts/fetch_dub_models.sh ; python3 -I scripts/tts_phrases.py data/phrases.en.json 5 57
ffmpeg -t 55.6 -i input/source.mp4 -vf fps=30 work/raw/%05d.png ; ffmpeg -i work/voice_en.wav -ac 1 -ar 16000 work/en16k.wav
MODELS=work/models python3 -I scripts/lipsync.py work/raw work/en16k.wav work/ls 30 wav2lip_gan_96.onnx ; scripts/01b_upscale_lipsynced.sh
python3 -I scripts/build_transcript.py work/en16k.wav ; echo "window.TRANSCRIPT=$(cat data/transcript.json);" > composition/transcript.js
LAST_SRC_FRAME=1657 scripts/02_render_all.sh ; node scripts/render.mjs cues work/cues.json ; python3 -I scripts/sfx.py work/cues.json work/sfx.wav
VOICE=work/voice_en.wav OUT=out/glow-kbeauty-reel-en.mp4 scripts/03_mix_and_encode.sh
```
Notes: translation condensed to fit the original timing windows. Brand list omits the 4th (low-confidence) Arabic brand name. Voice is synthetic, not the speaker's.
Lowest-confidence translated line: 34.2-38.1 s ("quality of our selections and presentation") - the Arabic source there was unclear.
