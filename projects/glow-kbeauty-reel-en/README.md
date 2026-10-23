# glow-kbeauty-reel-en  (English dub, cloned voice, landmark-aligned lip-sync)

Final: `out/glow-kbeauty-reel-en-v2.mp4` (1080x1920, 30fps, 57 s, -14 LUFS).
v2 changes vs v1: (1) voice cloned to the speaker with YourTTS (`data/ref_voice_sample.wav` = his original speech) instead of a stock voice;
(2) lip-sync rebuilt as `scripts/lipsync2.py` (2dfan4 landmarks, FFHQ-aligned crop, Wav2Lip-GAN, GFPGAN 0.7, mouth-shaped mask) - v1 had smeared lips.

Rebuild (skill: `.claude/skills/short-form-video-editor/SKILL.md`, Dub mode):
```
scripts/fetch_dub_models.sh ; scripts/fetch_asr_model.sh
python3 -I scripts/tts_clone.py data/phrases.en.json data/ref_voice_sample.wav 8 57      # -> work/voice_en.wav, data/transcript.source.json
ffmpeg -t 55.6 -i input/source.mp4 -vf fps=30 work/raw/%05d.png ; ffmpeg -i work/voice_en.wav -ac 1 -ar 16000 work/en16k.wav
MODELS=work/models python3 -I scripts/lipsync2.py work/raw work/en16k.wav work/ls --model wav2lip_gan_96.onnx --enhance 0.7   # ~25-30 min
scripts/01b_upscale_lipsynced.sh ; python3 -I scripts/build_transcript.py work/en16k.wav ; echo "window.TRANSCRIPT=$(cat data/transcript.json);" > composition/transcript.js
LAST_SRC_FRAME=1657 scripts/02_render_all.sh ; node scripts/render.mjs cues work/cues.json ; python3 -I scripts/sfx.py work/cues.json work/sfx.wav
VOICE=work/voice_en.wav OUT=out/glow-kbeauty-reel-en-v2.mp4 scripts/03_mix_and_encode.sh
```
Measured: cloned voice median pitch 144 Hz vs speaker 154 Hz (stock voice 123); tone similarity 0.96 vs 0.90.
Known weak spots: cloned voice is slightly less crisp than a stock voice in a few words; accent is whatever the model transfers (not a guaranteed Egyptian accent);
34-38 s translation is based on an unclear Arabic source line.
