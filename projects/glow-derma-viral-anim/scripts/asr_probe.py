"""Re-listen to uncertain spots: transcribe arbitrary windows in several languages (use 'en' to catch Latin brand names).
usage: python3 -I scripts/asr_probe.py <wav> <langs comma sep, e.g. ar,en> 14.0-16.8 14.5-16.6 ...
Consistent output across overlapping windows = trust it. Divergent output = flag it as low confidence."""
import sys, wave, os, numpy as np, sherpa_onnx
M = os.environ.get("WHISPER_DIR", "work/models/sherpa-onnx-whisper-turbo/")
w = wave.open(sys.argv[1]); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
recs = {l: sherpa_onnx.OfflineRecognizer.from_whisper(encoder=M + "turbo-encoder.int8.onnx", decoder=M + "turbo-decoder.int8.onnx",
        tokens=M + "turbo-tokens.txt", language=l, task="transcribe", num_threads=4) for l in sys.argv[2].split(",")}
for spec in sys.argv[3:]:
    a, b = map(float, spec.split("-"))
    for l, rec in recs.items():
        r = rec.create_stream(); r.accept_waveform(16000, x[int(a*16000):int(b*16000)]); rec.decode_stream(r)
        print(spec, l, r.result.text.strip(), flush=True)
