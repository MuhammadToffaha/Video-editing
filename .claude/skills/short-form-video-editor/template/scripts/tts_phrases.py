"""English (or any Kokoro-supported) dubbing voice, fitted into the ORIGINAL phrase windows so camera moves/graphics keep their beats.
usage: python3 -I scripts/tts_phrases.py data/phrases.en.json [speaker_id=5] [total_seconds=57]
 phrases.en.json: [[win_start, win_end, "display text with *key words and DISPLAY|spoken overrides (NBSP = space inside a token)"], ...]
 -> work/voice_en.wav (48k stereo, silence between phrases), data/transcript.source.json (start/end = ACTUAL speech spans)
Kokoro v0.19 speakers: 0 af,1 af_bella,2 af_nicole,3 af_sarah,4 af_sky,5 am_adam,6 am_michael,7 bf_emma,8 bf_isabella,9 bm_george,10 bm_lewis
Voice is synthetic (no cloning available offline): tell the user."""
import sys, os, json, re, wave, numpy as np, sherpa_onnx
from scipy.signal import resample_poly
M = os.environ.get("KOKORO_DIR", "work/models/kokoro-en-v0_19/")
phr = json.load(open(sys.argv[1])); sid = int(sys.argv[2]) if len(sys.argv) > 2 else 5; TOTAL = float(sys.argv[3]) if len(sys.argv) > 3 else 57.0
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
    model=M + "model.onnx", voices=M + "voices.bin", tokens=M + "tokens.txt", data_dir=M + "espeak-ng-data"), num_threads=4)))
def spoken(t):  # strip *, apply DISPLAY|spoken, NBSP->space
    out = []
    for tok in t.split(" "):
        tok = tok.replace("*", ""); tok = tok.split("|")[1] if "|" in tok else tok
        out.append(tok.replace(" ", " "))
    return " ".join(out)
def gen(t, sp):
    a = tts.generate(t, sid=sid, speed=sp); x = np.array(a.samples, np.float32)
    i = np.where(np.abs(x) > 0.012)[0]; return (x[i[0]:i[-1] + 1] if len(i) else x), a.sample_rate
SR = 48000; out = np.zeros(int(TOTAL * SR), np.float32); src = []
for k, (a, b, t) in enumerate(phr):
    nxt = phr[k + 1][0] if k + 1 < len(phr) else TOTAL; win = b - a; txt = spoken(t)
    x, sr = gen(txt, 1.0); ratio = (len(x) / sr) / win
    sp = float(np.clip(ratio / 0.93, 0.85, 1.2)); x, sr = gen(txt, sp)       # fill ~93% of the window; never rush past 1.2x
    d = len(x) / sr
    if d > (nxt - a) - 0.08:
        sp = float(np.clip(sp * d / ((nxt - a) - 0.12), 0.85, 1.35)); x, sr = gen(txt, sp); d = len(x) / sr
    y = resample_poly(x, SR // sr, 1) if SR % sr == 0 else resample_poly(x, SR, sr)
    f = int(.012 * SR); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    s0 = a + 0.03; o = int(s0 * SR); out[o:o + len(y)] += y[:len(out) - o]
    src.append([round(s0, 3), round(s0 + len(y) / SR, 3), t])
    print(f"{a:6.2f}-{b:6.2f} win {win:4.2f}s speech {d:4.2f}s speed {sp:4.2f}  {txt[:58]}")
out = out / max(1e-6, np.abs(out).max()) * 0.9
os.makedirs("work", exist_ok=True)
w = wave.open("work/voice_en.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.repeat(out[:, None], 2, 1) * 32767).astype(np.int16).tobytes()); w.close()
os.makedirs("data", exist_ok=True)
json.dump({"_note": "English dub phrases; start/end = actual TTS speech span", "phrases": src}, open("data/transcript.source.json", "w"), ensure_ascii=False, indent=1)
