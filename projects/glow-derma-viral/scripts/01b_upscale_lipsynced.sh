#!/usr/bin/env bash
# Lip-synced ORIGINAL-resolution frames (work/ls/00001.png ...) -> work/frames/f_%05d.jpg (same denoise/upscale/grade as 01_prepare.sh)
set -euo pipefail; cd "$(dirname "$0")/.."; rm -rf work/frames; mkdir -p work/frames
ffmpeg -v error -y -framerate 30 -i work/ls/%05d.png \
  -vf "hqdn3d=1.2:1.2:3:3,scale=1080:1920:flags=lanczos,unsharp=5:5:0.7:5:5:0.0,eq=contrast=1.05:saturation=1.1:gamma=0.98" -q:v 2 work/frames/f_%05d.jpg
echo "frames: $(ls work/frames | wc -l)"
