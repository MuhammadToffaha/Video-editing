"""Wav2Lip (ONNX, CPU) lip-sync: re-animates the speaker's mouth to a NEW audio track (e.g. an English dub).
usage: python3 -I scripts/lipsync.py <raw_frames_dir> <audio_16k_mono.wav> <out_dir> [fps=30] [model=wav2lip_gan_96.onnx] [first_frame last_frame]
 raw_frames_dir: ORIGINAL-resolution frames named 00001.png.. (extract with ffmpeg BEFORE upscaling: the 96px model works at native face size)
 Pipeline: mel-spectrogram -> Haar face box (smoothed over time, gaps interpolated) -> Wav2Lip per frame -> feathered paste of the lower face only.
 Model: facefusion-assets models-3.0.0 (GitHub release) wav2lip_96.onnx / wav2lip_gan_96.onnx -> work/models/. Needs: numpy scipy opencv-python-headless onnxruntime.
Limits: frontal, mostly static, single speaker; ~96px model => slightly soft mouth; speaker's head/hand motion stays the original (only mouth is regenerated)."""
import sys, os, wave, glob, numpy as np, cv2, onnxruntime as ort
from scipy.signal import lfilter, get_window
frames_dir, wav, out_dir = sys.argv[1:4]; FPS = float(sys.argv[4]) if len(sys.argv) > 4 else 30.0
model = sys.argv[5] if len(sys.argv) > 5 else "wav2lip_gan_96.onnx"
files = sorted(glob.glob(os.path.join(frames_dir, "*.png")) + glob.glob(os.path.join(frames_dir, "*.jpg")))
a0, a1 = (int(sys.argv[6]), int(sys.argv[7])) if len(sys.argv) > 7 else (0, len(files))
os.makedirs(out_dir, exist_ok=True)
# ---- audio -> mel (Wav2Lip's exact recipe) ----
w = wave.open(wav); y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
y = lfilter([1, -0.97], [1], y)
def mel_basis(sr=16000, n_fft=800, n=80, fmin=55, fmax=7600):
    f_sp = 200 / 3; mn = np.log(6.4) / 27
    h2m = lambda f: np.where(f < 1000, f / f_sp, 15 + np.log(np.maximum(f, 1e-9) / 1000) / mn)
    m2h = lambda m: np.where(m < 15, m * f_sp, 1000 * np.exp(mn * (m - 15)))
    mf = m2h(np.linspace(h2m(np.array(fmin)), h2m(np.array(fmax)), n + 2)); ff = np.linspace(0, sr / 2, 1 + n_fft // 2)
    fd = np.diff(mf); ramps = mf[:, None] - ff[None]; W = np.zeros((n, len(ff)))
    for i in range(n): W[i] = np.maximum(0, np.minimum(-ramps[i] / fd[i], ramps[i + 2] / fd[i + 1]))
    return W * (2.0 / (mf[2:n + 2] - mf[:n]))[:, None]
yp = np.pad(y, 400, mode="reflect"); win = get_window("hann", 800, fftbins=True)
nfr = 1 + (len(yp) - 800) // 200
D = np.abs(np.fft.rfft(np.stack([yp[i * 200:i * 200 + 800] * win for i in range(nfr)]), axis=1)).T
S = 20 * np.log10(np.maximum(1e-5, mel_basis() @ D)) - 20
mel = np.clip(8 * ((S + 100) / 100) - 4, -4, 4).astype(np.float32); T = mel.shape[1]
def mel_chunk(i):
    s = int(i * 80.0 / FPS); s = s if s + 16 <= T else T - 16; return mel[:, s:s + 16]
# ---- face boxes ----
det = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
imgs0 = cv2.imread(files[0]); H, Wd = imgs0.shape[:2]; boxes = np.full((len(files), 4), np.nan)
grays = lambda f: cv2.cvtColor(cv2.imread(f), cv2.COLOR_BGR2GRAY)
for i, f in enumerate(files):                       # pass 1: strict, whole frame
    r = det.detectMultiScale(grays(f), 1.1, 6, minSize=(int(Wd * .14), int(Wd * .14)))
    if len(r): x, y_, w_, h_ = max(r, key=lambda b: b[2] * b[3]); boxes[i] = [x, y_, x + w_, y_ + h_]
okm = ~np.isnan(boxes[:, 0])
if okm.sum() < 5: sys.exit("no face found - lip-sync not possible on this clip")
med = np.median(boxes[okm], axis=0); mw = med[2] - med[0]; mc = np.array([(med[0] + med[2]) / 2, (med[1] + med[3]) / 2])
def near(b): c = np.array([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]); return np.abs(c - mc).max() < mw * .5 and .75 < (b[2] - b[0]) / mw < 1.3
for i in range(len(files)):                         # reject outliers (hands/shirt/shelf false positives)
    if okm[i] and not near(boxes[i]): boxes[i] = np.nan
for i, f in enumerate(files):                       # pass 2: looser, only inside the region around the median face
    if np.isnan(boxes[i, 0]):
        x0, y0 = int(max(0, mc[0] - mw)), int(max(0, mc[1] - mw)); g = grays(f)[y0:int(mc[1] + mw), x0:int(mc[0] + mw)]
        r = det.detectMultiScale(g, 1.05, 3, minSize=(int(mw * .75), int(mw * .75)), maxSize=(int(mw * 1.3), int(mw * 1.3)))
        if len(r): x, y_, w_, h_ = max(r, key=lambda b: b[2] * b[3]); boxes[i] = [x + x0, y_ + y0, x + x0 + w_, y_ + y0 + h_]
ok = ~np.isnan(boxes[:, 0]); print("face found in", ok.sum(), "/", len(files), "frames (rest interpolated)")
idx = np.arange(len(files))
for c in range(4): boxes[:, c] = np.interp(idx, idx[ok], boxes[ok, c])
k = 9; ker = np.ones(k) / k
for c in range(4): boxes[:, c] = np.convolve(np.pad(boxes[:, c], k // 2, mode="edge"), ker, "valid")
# widen/lengthen slightly so the lower half of the crop contains nose-tip..chin
cx = (boxes[:, 0] + boxes[:, 2]) / 2; bw = (boxes[:, 2] - boxes[:, 0]) * 1.08; y1 = boxes[:, 1]; y2 = boxes[:, 3] + (boxes[:, 3] - boxes[:, 1]) * .10
boxes = np.stack([cx - bw / 2, y1, cx + bw / 2, y2], 1).round().astype(int)
# ---- inference ----
sess = ort.InferenceSession(os.path.join(os.environ.get("MODELS", "work/models"), model), providers=["CPUExecutionProvider"])
m96 = np.zeros((96, 96), np.float32); m96[54:90, 22:74] = 1; m96 = cv2.GaussianBlur(m96, (0, 0), 5)   # mouth area only: keeps the real beard/jaw texture
B = 24
for s in range(a0, a1, B):
    ids = list(range(s, min(a1, s + B))); tg, ml, crops = [], [], []
    for i in ids:
        im = cv2.imread(files[i]); x1, y1_, x2, y2_ = boxes[i]; x1, y1_ = max(0, x1), max(0, y1_); x2, y2_ = min(Wd, x2), min(H, y2_)
        face = cv2.resize(im[y1_:y2_, x1:x2], (96, 96)).astype(np.float32) / 255; masked = face.copy(); masked[48:] = 0
        tg.append(np.concatenate([masked, face], 2).transpose(2, 0, 1)); ml.append(mel_chunk(i)[None]); crops.append((im, x1, y1_, x2, y2_))
    pred = sess.run(None, {"source": np.stack(ml), "target": np.stack(tg)})[0]
    for j, i in enumerate(ids):
        im, x1, y1_, x2, y2_ = crops[j]; p = np.clip(pred[j].transpose(1, 2, 0), 0, 1)
        h_, w_ = y2_ - y1_, x2 - x1; p = cv2.resize(p, (w_, h_), interpolation=cv2.INTER_CUBIC); p = np.clip(cv2.addWeighted(p, 1.7, cv2.GaussianBlur(p, (0, 0), 1.3), -0.7, 0), 0, 1); m = cv2.resize(m96, (w_, h_))[..., None]
        reg = im[y1_:y2_, x1:x2].astype(np.float32) / 255
        lo = slice(h_ // 2, h_)                      # colour-match the generated lower face to the real one (removes the red/pink tint)
        mp, sp = p[lo].mean((0, 1)), p[lo].std((0, 1)) + 1e-4; mr, sr = reg[lo].mean((0, 1)), reg[lo].std((0, 1)) + 1e-4
        p = np.clip((p - mp) / sp * (0.5 * sr + 0.5 * sp) + mr, 0, 1); im[y1_:y2_, x1:x2] = (np.clip(m * p + (1 - m) * reg, 0, 1) * 255).astype(np.uint8)
        cv2.imwrite(os.path.join(out_dir, os.path.basename(files[i]).rsplit(".", 1)[0] + ".png"), im)
    print("lipsync", ids[0], "-", ids[-1], flush=True)
