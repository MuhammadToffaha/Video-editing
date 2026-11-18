#!/usr/bin/env bash
# Usage: [END=55.6] 01_prepare.sh input.mp4
# -> work/frames/f_00001.jpg (1080x1920 @30fps, denoised+upscaled+light grade), work/asr16k.wav (mono 16k), work/voice_raw.wav (48k stereo)
# END = seconds to keep (use it to cut a trailing CapCut/WhatsApp end card). Portrait 9:16 sources only; for other ratios edit the scale filter.
set -euo pipefail; cd "$(dirname "$0")/.."
IN="$1"; mkdir -p work/frames; T=(); [ -n "${END:-}" ] && T=(-t "$END")
ffmpeg -v error -y "${T[@]}" -i "$IN" -an \
  -vf "fps=30,hqdn3d=1.6:1.6:4:4,scale=1080:1920:flags=lanczos,unsharp=5:5:0.7:5:5:0.0,eq=contrast=1.05:saturation=1.1:gamma=0.98" \
  -q:v 2 work/frames/f_%05d.jpg
ffmpeg -v error -y -i "$IN" -vn -ac 1 -ar 16000 work/asr16k.wav
ffmpeg -v error -y "${T[@]}" -i "$IN" -vn -ac 2 -ar 48000 work/voice_raw.wav
echo "frames: $(ls work/frames | wc -l)"
