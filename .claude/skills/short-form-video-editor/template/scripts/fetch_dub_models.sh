#!/usr/bin/env bash
# Models for DUB MODE (all from GitHub releases; huggingface is blocked in the sandbox):
#   Kokoro v0.19 English TTS (11 voices, ~300MB)  +  Wav2Lip GAN 96px ONNX lip-sync (145MB)
# Pins: opencv 5.x REMOVED CascadeClassifier -> use opencv-python-headless==4.10.0.84 (needs numpy<2.3)
set -euo pipefail; cd "$(dirname "$0")/.."; mkdir -p work/models; cd work/models
pip install -q sherpa-onnx onnxruntime scipy "opencv-python-headless==4.10.0.84" "numpy<2.3" pillow
[ -d kokoro-en-v0_19 ] || { curl -sSL -o k.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-en-v0_19.tar.bz2 && tar xjf k.tar.bz2 && rm k.tar.bz2; }
[ -f wav2lip_gan_96.onnx ] || curl -sSL -o wav2lip_gan_96.onnx https://github.com/facefusion/facefusion-assets/releases/download/models-3.0.0/wav2lip_gan_96.onnx
ls -la
