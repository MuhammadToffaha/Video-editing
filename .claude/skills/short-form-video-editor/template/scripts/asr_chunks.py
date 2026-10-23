"""Whisper (sherpa-onnx) over energy-split chunks. Whisper drops the tail of long chunks, so use SHORT windows (2.4-4.5 s)
cut at the quietest point, and run 2-3 different sizes, then merge the hypotheses by hand.
usage: python3 -I scripts/asr_chunks.py <wav> <lang: ar|en|...|auto> <target_seconds> <tag> [end_seconds]  -> work/seg_<tag>.json (+ stdout)"""
import sys, json, wave, os, numpy as np, sherpa_onnx
M = os.environ.get("WHISPER_DIR", "work/models/sherpa-onnx-whisper-turbo/")
wav, lang, target, tag = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=M + "turbo-encoder.int8.onnx", decoder=M + "turbo-decoder.int8.onnx",
        tokens=M + "turbo-tokens.txt", language="" if lang == "auto" else lang, task="transcribe", num_threads=4)
w = wave.open(wav); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
sr, hop = 16000, 160; n = len(x) // hop
es = np.convolve(np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) for i in range(n)]), np.ones(5) / 5, 'same')
end_t = float(sys.argv[5]) if len(sys.argv) > 5 else n / 100
cuts, t = [0.0], 0.0
while end_t - t > target * 1.4:
    a, b = int((t + target * .7) * 100), int((t + target * 1.3) * 100)
    t = (a + int(np.argmin(es[a:b]))) / 100; cuts.append(t)
cuts.append(end_t); out = []
for a, b in zip(cuts[:-1], cuts[1:]):
    r = rec.create_stream(); r.accept_waveform(sr, x[int(a*sr):int(b*sr)]); rec.decode_stream(r)
    out.append({"start": round(a, 2), "end": round(b, 2), "text": r.result.text.strip()}); print(out[-1], flush=True)
os.makedirs("work", exist_ok=True); json.dump(out, open(f"work/seg_{tag}.json", "w"), ensure_ascii=False, indent=1)
