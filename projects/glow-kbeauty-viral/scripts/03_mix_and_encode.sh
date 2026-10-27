#!/usr/bin/env bash
# frames + cleaned voice + SFX -> $OUT (default out/reel.mp4). Run after: node scripts/render.mjs cues work/cues.json && python3 -I scripts/sfx.py work/cues.json work/sfx.wav
set -euo pipefail; cd "$(dirname "$0")/.."; mkdir -p out
OUT="${OUT:-out/reel.mp4}"; SFX_GAIN="${SFX_GAIN:-0.35}"; CRF="${CRF:-19}"
DUR=$(python3 -I -c "import json;print(json.load(open('work/cues.json'))['duration'])")
ffmpeg -v error -y -framerate 30 -i work/out/%05d.jpg -i work/voice_raw.wav -i work/sfx.wav -filter_complex \
"[1:a]highpass=f=70,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=120:makeup=3,loudnorm=I=-15:TP=-2:LRA=9,aresample=48000,apad=whole_dur=${DUR}[v];\
 [2:a]volume=${SFX_GAIN}[s];[v][s]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.89,atrim=0:${DUR}[a]" \
-map 0:v -map "[a]" -t "$DUR" -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 192k "$OUT"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak|LRA):" | tail -3
