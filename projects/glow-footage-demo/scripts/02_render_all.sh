#!/usr/bin/env bash
# Renders every frame (duration comes from window.DURATION in composition/scene.js) with 4 parallel Chromium workers -> work/out/NNNNN.jpg
set -euo pipefail; cd "$(dirname "$0")/.."
P="${WORKERS:-4}"; N=$(node scripts/render.mjs frames); S=$(( (N + P - 1) / P )); mkdir -p work/out
for i in $(seq 0 $((P-1))); do a=$((i*S)); b=$(( a+S > N ? N : a+S )); [ $a -lt $N ] && node scripts/render.mjs $a $b work/out & done; wait
echo "rendered $(ls work/out | wc -l)/$N frames"
