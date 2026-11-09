"""Voice-CLONED dub: YourTTS (zero-shot cloning from the speaker's own recording) with best-of-N take selection by speech-recognition read-back.
usage: python3 -I scripts/tts_clone.py data/phrases.en.json work/ref.wav [N=6] [total_seconds=57]
 -> work/voice_en.wav (48k stereo, silence between phrases) + data/transcript.source.json (ACTUAL speech spans)
 ref.wav: 10-20 s of the speaker's clean original speech (concatenate several pauses-bounded clips, 16k mono).
Needs: torch, coqui-tts[codec], work/models/yourtts (GitHub release v0.10.1_models, fix /home/julian paths in config.json), whisper turbo (read-back).
Why best-of-N: YourTTS drops/mangles words ~30% of takes; picking the take whose Whisper transcript matches the script fixes most of it.
Cloned timbre/pitch follows the reference; accent is only what the model transfers - it cannot guarantee a native-sounding accent."""
import sys, os, json, re, wave, difflib, numpy as np, torch, sherpa_onnx
from scipy.signal import resample_poly
phr = json.load(open(sys.argv[1])); REF = sys.argv[2]; NT = int(sys.argv[3]) if len(sys.argv) > 3 else 6; TOTAL = float(sys.argv[4]) if len(sys.argv) > 4 else 57.0
D = os.environ.get("YOURTTS_DIR", "work/models/yourtts/tts_models--multilingual--multi-dataset--your_tts/"); WH = os.environ.get("WHISPER_DIR", "work/models/sherpa-onnx-whisper-turbo/")
from TTS.utils.synthesizer import Synthesizer
os.makedirs("work/vd", exist_ok=True)
syn = Synthesizer(tts_checkpoint=D + "model_file.pth", tts_config_path=D + "config.json", tts_speakers_file=D + "speakers.json", encoder_checkpoint=D + "model_se.pth", encoder_config=D + "config_se.json", use_cuda=False, voice_dir="work/vd")
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=WH + "turbo-encoder.int8.onnx", decoder=WH + "turbo-decoder.int8.onnx", tokens=WH + "turbo-tokens.txt", language="en", task="transcribe", num_threads=4)
def asr(x16):
    r = rec.create_stream(); r.accept_waveform(16000, np.asarray(x16, np.float32)); rec.decode_stream(r); return r.result.text.strip()
def parse(t):  # -> (spoken text, set of brand tokens excluded from scoring)
    out, brands = [], set()
    for tok in t.split(" "):
        tok = tok.replace("*", "")
        if "|" in tok: tok = tok.split("|")[1]; brands |= {w.lower() for w in re.findall(r"[A-Za-z]+", tok.replace(" ", " "))}
        out.append(tok.replace(" ", " "))
    return " ".join(out), brands
norm = lambda s, b: [w for w in re.findall(r"[a-z']+", s.lower()) if w not in b]
def score(ref, hyp, b): return difflib.SequenceMatcher(None, norm(ref, b), norm(hyp, b)).ratio()
def gen(txt, ls, seed):
    torch.manual_seed(seed); syn.tts_model.length_scale = ls
    w = np.array(syn.tts(txt, speaker_name="spk", language_name="en", speaker_wav=REF), np.float32)
    i = np.where(np.abs(w) > 0.01)[0]; return (w[i[0]:i[-1] + 1] if len(i) else w)
SR_IN = syn.output_sample_rate; SR = 48000; out = np.zeros(int(TOTAL * SR), np.float32); src = []
for k, (a, b, t) in enumerate(phr):
    nxt = phr[k + 1][0] if k + 1 < len(phr) else TOTAL; win = b - a; txt, brands = parse(t)
    ls = 1.3                                                                          # YourTTS barely follows length_scale; the real fit is the time-stretch below
    best = None
    for s in range(1, NT + 1):
        w = gen(txt, ls, s); hyp = asr(resample_poly(w, 16000, SR_IN) if SR_IN != 16000 else w); sc = score(txt, hyp, brands)
        d = len(w) / SR_IN; sc -= 0.15 * max(0, d - (nxt - a - 0.1)) / win          # prefer takes that fit
        if best is None or sc > best[0]: best = (sc, w, hyp, d)
        if sc > 0.97: break
    sc, w, hyp, d = best
    tempo = float(np.clip(d / (0.9 * win), 0.72, 1.25))                               # <1 slows (pitch-preserving), fill ~90% of the window but never slower than 0.72x
    if d / tempo > (nxt - a) - 0.12: tempo = d / ((nxt - a) - 0.12)
    if abs(tempo - 1) > 0.03:
        import subprocess, tempfile, soundfile as sf
        tmp = tempfile.mktemp(suffix=".wav"); sf.write(tmp, w, SR_IN)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"atempo={tempo:.4f}", tmp + ".o.wav"], check=True)
        w, _ = sf.read(tmp + ".o.wav"); w = w.astype(np.float32); d = len(w) / SR_IN
    y = resample_poly(w, SR // SR_IN, 1) if SR % SR_IN == 0 else resample_poly(w, SR, SR_IN)
    f_ = int(.012 * SR); y[:f_] *= np.linspace(0, 1, f_); y[-f_:] *= np.linspace(1, 0, f_)
    # slight centring inside the window; lips start close to the speaker's own mouth movement
    s0 = a + 0.03 + max(0.0, win - d) * 0.2; o = int(s0 * SR); out[o:o + len(y)] += y[:len(out) - o]; src.append([round(s0, 3), round(s0 + len(y) / SR, 3), t])
    print(f"{a:6.2f}-{b:6.2f} win {win:4.2f}s speech {d:4.2f}s score {sc:4.2f}  heard: {hyp[:70]}", flush=True)
out = out / max(1e-6, np.abs(out).max()) * 0.9
w = wave.open("work/voice_en.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.repeat(out[:, None], 2, 1) * 32767).astype(np.int16).tobytes()); w.close()
json.dump({"_note": "voice-cloned dub; start/end = actual speech spans", "max_chars": 22, "max_words": 4, "phrases": src}, open("data/transcript.source.json", "w"), ensure_ascii=False, indent=1)
