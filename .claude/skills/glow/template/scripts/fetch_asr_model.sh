#!/usr/bin/env bash
# Offline-friendly speech model: sherpa-onnx + Whisper large-v3-turbo (multilingual, ~560MB) + Silero VAD, all from GitHub releases
# (huggingface.co is blocked in the cloud sandbox; github.com release downloads work).
set -euo pipefail; cd "$(dirname "$0")/.."; mkdir -p work/models; cd work/models
pip install -q sherpa-onnx numpy
B=https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models
[ -d sherpa-onnx-whisper-turbo ] || { curl -sSL -o turbo.tar.bz2 $B/sherpa-onnx-whisper-turbo.tar.bz2 && tar xjf turbo.tar.bz2 && rm turbo.tar.bz2; }
[ -f silero_vad.onnx ] || curl -sSL -o silero_vad.onnx $B/silero_vad.onnx
ls -la
