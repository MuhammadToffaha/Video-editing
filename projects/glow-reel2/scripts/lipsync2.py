"""Landmark-aligned lip-sync (FaceFusion-style): Haar box -> 2dfan4 68 landmarks (smoothed) -> FFHQ-512 aligned crop -> Wav2Lip-GAN (96px face box) or EDTalk (256px)
-> optional GFPGAN restoration -> landmark-shaped mouth mask -> paste back into the ORIGINAL-resolution frame.
usage: python3 -I lipsync2.py <raw_frames_dir> <audio16k.wav> <out_dir> [--model wav2lip_gan_96.onnx|edtalk_256.onnx] [--enhance 0.6] [--weight 1.0] [--range a b] [--fps 30]"""
import sys, os, glob, wave, argparse, numpy as np, cv2, onnxruntime as ort
from scipy.signal import lfilter, get_window
ap = argparse.ArgumentParser(); ap.add_argument("frames"); ap.add_argument("wav"); ap.add_argument("out")
ap.add_argument("--model", default="wav2lip_gan_96.onnx"); ap.add_argument("--enhance", type=float, default=0.0); ap.add_argument("--weight", type=float, default=1.0)
ap.add_argument("--range", nargs=2, type=int); ap.add_argument("--fps", type=float, default=30.0); ap.add_argument("--mask", type=float, default=0.42)
ap.add_argument("--debug", action="store_true"); a = ap.parse_args()
MD = os.environ.get("MODELS", "work/models")
files = sorted(glob.glob(os.path.join(a.frames, "*.png")) + glob.glob(os.path.join(a.frames, "*.jpg"))); N = len(files)
a0, a1 = a.range if a.range else (0, N); os.makedirs(a.out, exist_ok=True)
so = ort.SessionOptions(); so.intra_op_num_threads = 4
S = lambda n: ort.InferenceSession(os.path.join(MD, n), so, providers=["CPUExecutionProvider"])
# ---------- mel (Wav2Lip recipe) ----------
w = wave.open(a.wav); y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; y = lfilter([1, -0.97], [1], y)
def mel_basis(sr=16000, n_fft=800, n=80, fmin=55, fmax=7600):
    f_sp = 200 / 3; mn = np.log(6.4) / 27
    h2m = lambda f: np.where(f < 1000, f / f_sp, 15 + np.log(np.maximum(f, 1e-9) / 1000) / mn); m2h = lambda m: np.where(m < 15, m * f_sp, 1000 * np.exp(mn * (m - 15)))
    mf = m2h(np.linspace(h2m(np.array(fmin)), h2m(np.array(fmax)), n + 2)); ff = np.linspace(0, sr / 2, 1 + n_fft // 2); fd = np.diff(mf); r = mf[:, None] - ff[None]; Wm = np.zeros((n, len(ff)))
    for i in range(n): Wm[i] = np.maximum(0, np.minimum(-r[i] / fd[i], r[i + 2] / fd[i + 1]))
    return Wm * (2.0 / (mf[2:n + 2] - mf[:n]))[:, None]
yp = np.pad(y, 400, mode="reflect"); win = get_window("hann", 800, fftbins=True); nfr = 1 + (len(yp) - 800) // 200
D = np.abs(np.fft.rfft(np.stack([yp[i * 200:i * 200 + 800] * win for i in range(nfr)]), axis=1)).T
mel = np.clip(8 * ((20 * np.log10(np.maximum(1e-5, mel_basis() @ D)) - 20 + 100) / 100) - 4, -4, 4).astype(np.float32); T = mel.shape[1]
def mel_chunk(i): s = int(i * 80.0 / a.fps); s = s if s + 16 <= T else T - 16; return mel[:, s:s + 16]
# ---------- face boxes (Haar, outlier-rejected) -> landmarks ----------
det = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
im0 = cv2.imread(files[0]); H, Wd = im0.shape[:2]; boxes = np.full((N, 4), np.nan); gray = lambda f: cv2.cvtColor(cv2.imread(f), cv2.COLOR_BGR2GRAY)
for i, f in enumerate(files):
    r = det.detectMultiScale(gray(f), 1.1, 6, minSize=(int(Wd * .14),) * 2)
    if len(r): x, y_, w_, h_ = max(r, key=lambda b: b[2] * b[3]); boxes[i] = [x, y_, x + w_, y_ + h_]
okm = ~np.isnan(boxes[:, 0]); assert okm.sum() > 5, "no face found"
med = np.median(boxes[okm], 0); mw = med[2] - med[0]; mc = np.array([(med[0] + med[2]) / 2, (med[1] + med[3]) / 2])
for i in range(N):
    if okm[i]:
        b = boxes[i]; c = np.array([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2])
        if not (np.abs(c - mc).max() < mw * .5 and .75 < (b[2] - b[0]) / mw < 1.3): boxes[i] = np.nan
idx = np.arange(N); ok = ~np.isnan(boxes[:, 0])
for c in range(4): boxes[:, c] = np.interp(idx, idx[ok], boxes[ok, c])
print("haar boxes:", ok.sum(), "/", N, "(rest interpolated)", flush=True)
fan = S("2dfan4.onnx")
def lm68(img, box):
    x1, y1, x2, y2 = box; sc = 195 / max(1, max(x2 - x1, y2 - y1)); A = np.array([[sc, 0, (256 - (x1 + x2) * sc) * .5], [0, sc, (256 - (y1 + y2) * sc) * .5]], np.float32)
    t = (cv2.warpAffine(img, A, (256, 256)).transpose(2, 0, 1).astype(np.float32) / 255)[None]
    p = fan.run(None, {"input": t})[0][0, :, :2] / 64 * 256; inv = cv2.invertAffineTransform(A); return p @ inv[:, :2].T + inv[:, 2]
LM = np.zeros((N, 68, 2), np.float32)
for i in range(N):
    if a0 - 3 <= i < a1 + 3 or True: LM[i] = lm68(cv2.imread(files[i]), boxes[i]) if (a0 - 6 <= i < a1 + 6) else 0
sm = LM.copy(); k = 2
for i in range(max(a0 - 4, 0), min(a1 + 4, N)): sm[i] = LM[max(0, i - k):i + k + 1].mean(0)          # temporal smoothing (5 frames)
print("landmarks done", flush=True)
# ---------- models ----------
lip = S(a.model); EDT = a.model.startswith("edtalk"); gf = S("gfpgan_1.4.onnx") if a.enhance > 0 else None
TPL = np.array([[.37691676, .46864664], [.62285697, .46912813], [.50123859, .61331904], [.39308822, .72541100], [.61150205, .72490465]], np.float32) * 512
lm5 = lambda p: np.array([p[36:42].mean(0), p[42:48].mean(0), p[30], p[48], p[54]], np.float32)
def run_lip(crop, mch, p512):
    if not EDT:
        bb = np.array([p512[:, 0].min(), p512[:, 1].min(), p512[:, 0].max(), p512[:, 1].max()]); bb[1] -= (bb[3] - bb[1]) * .125
        sx, sy = 96 / (bb[2] - bb[0]), 96 / (bb[3] - bb[1]); Mb = np.array([[sx, 0, -bb[0] * sx], [0, sy, -bb[1] * sy]], np.float32)
        close = cv2.warpAffine(crop, Mb, (96, 96)).astype(np.float32) / 255; masked = close.copy(); masked[48:] = 0
        t = np.concatenate([masked, close], 2).transpose(2, 0, 1)[None]
        o = np.clip(lip.run(None, {"source": mch[None, None], "target": t})[0][0].transpose(1, 2, 0), 0, 1)
        return cv2.warpAffine((o * 255).astype(np.uint8), cv2.invertAffineTransform(Mb), (512, 512), borderMode=cv2.BORDER_REPLICATE, flags=cv2.INTER_CUBIC)
    c256 = cv2.resize(crop, (256, 256), interpolation=cv2.INTER_AREA)
    t = (c256[:, :, ::-1].astype(np.float32) / 255).transpose(2, 0, 1)[None]
    o = lip.run(None, {"source": mch[None, None], "target": t, "weight": np.array([a.weight], np.float32)})[0][0].transpose(1, 2, 0)
    o = (np.clip(o, 0, 1) * 255).astype(np.uint8)[:, :, ::-1]
    return cv2.resize(o, (512, 512), interpolation=cv2.INTER_CUBIC)
def enhance(crop):
    t = ((crop[:, :, ::-1].astype(np.float32) / 255 - .5) / .5).transpose(2, 0, 1)[None]
    o = np.clip(gf.run(None, {"input": t})[0][0].transpose(1, 2, 0) * .5 + .5, 0, 1); return (o[:, :, ::-1] * 255).astype(np.uint8)
for i in range(a0, a1):
    img = cv2.imread(files[i]); p = sm[i]; M, _ = cv2.estimateAffinePartial2D(lm5(p), TPL, method=cv2.LMEDS)
    crop = cv2.warpAffine(img, M, (512, 512), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE); p512 = cv2.transform(p[None], M)[0]
    pred = run_lip(crop, mel_chunk(i), p512)
    if gf is not None: pred = cv2.addWeighted(pred, 1 - a.enhance, enhance(pred), a.enhance, 0)
    mw_ = np.linalg.norm(p512[48] - p512[54]); hull = cv2.convexHull(p512[48:68].astype(np.int32)); m = np.zeros((512, 512), np.float32); cv2.fillConvexPoly(m, hull, 1.0)
    r = int(mw_ * a.mask); m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1)))
    m[: int(p512[33, 1]) + 6] = 0                                                      # never touch the nose
    m = cv2.GaussianBlur(m, (0, 0), max(4, r * .45))
    Mi = cv2.invertAffineTransform(M); wp = cv2.warpAffine(pred, Mi, (Wd, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE); wm = cv2.warpAffine(m, Mi, (Wd, H))[..., None]
    out = np.clip(img.astype(np.float32) * (1 - wm) + wp.astype(np.float32) * wm, 0, 255).astype(np.uint8)
    cv2.imwrite(os.path.join(a.out, os.path.basename(files[i]).rsplit(".", 1)[0] + ".png"), out)
    if (i - a0) % 24 == 0: print("lipsync", i, flush=True)
