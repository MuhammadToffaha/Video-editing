#!/usr/bin/env bash
# Append the Glow brand outro (assets/glow_outro.mp4, 16:9) to the end of a finished reel.
# Usage: scripts/04_append_outro.sh out/reel.mp4 [out/reel_final.mp4]
# The 16:9 clip is fitted to the reel width over a blurred, zoomed copy of itself (no cropping of the logo)
# and cross-faded in (XF seconds). Output keeps the reel's size/fps, H.264/AAC 48 kHz.
set -euo pipefail; cd "$(dirname "$0")/.."
IN="${1:?usage: 04_append_outro.sh in.mp4 [out.mp4]}"; OUT="${2:-${IN%.mp4}_outro.mp4}"
OUTRO="${OUTRO:-assets/glow_outro.mp4}"; XF="${XF:-0.4}"; CRF="${CRF:-19}"
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$IN")
H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$IN")
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$IN")
D1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
OFF=$(python3 -c "print(round($D1-$XF,3))")
ffmpeg -v error -y -i "$IN" -i "$OUTRO" -filter_complex \
"[1:v]fps=$FPS,split[a][b];\
 [a]scale=$W:$H:force_original_aspect_ratio=increase,crop=$W:$H,gblur=sigma=40[bg];\
 [b]scale=$W:-2:flags=lanczos[fg];\
 [bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p,setsar=1[ov];\
 [0:v]fps=$FPS,format=yuv420p,setsar=1[rv];\
 [rv][ov]xfade=transition=fade:duration=$XF:offset=$OFF[v];\
 [0:a]aresample=48000,aformat=channel_layouts=stereo[ra];\
 [1:a]aresample=48000,aformat=channel_layouts=stereo[oa];\
 [ra][oa]acrossfade=d=$XF[a]" \
-map "[v]" -map "[a]" -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 192k "$OUT"
echo "wrote $OUT"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
