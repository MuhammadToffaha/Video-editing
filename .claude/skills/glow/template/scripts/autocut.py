"""Glow footage mode: turn ONE continuous take into a tight, viral-paced edit.
Removes dead air (long pauses), aligns every cut to a video frame, writes the edited voice track, the output->source frame map for the renderer,
and camera.js with ALTERNATING zoom levels between cuts (classic jump-cut trick: the zoom change hides the cut).

usage (run in the project root, after 01_prepare.sh and after the phrases are written on the ORIGINAL timeline):
  python3 -I scripts/autocut.py [--min-gap 0.40] [--keep 0.12] [--lead 0.10] [--tail 0.35] [--zooms 1.0,1.13] [--face 0.5,0.55]
                                [--punch-every 3.2] [--phrases data/transcript.source.json] [--no-zoom]
reads : work/asr16k.wav (mono 16k, ORIGINAL; backed up to asr16k_orig.wav), work/voice_raw.wav (48k stereo, ORIGINAL; backed up to voice_orig.wav) - safe to re-run
writes: work/voice_raw.wav (edited), work/asr16k.wav (edited), work/framemap.json, work/edl.json, composition/camera.js,
        data/transcript.source.json (phrase times remapped to the edited timeline, if --phrases given; original kept as transcript.source.orig.json)
Then: build_transcript.py on the EDITED work/asr16k.wav, scenes in EDITED time, finish({duration: edited_len + 1.8, outroAt: edited_len + .5, footage: true})."""
import sys, os, json, wave, argparse, shutil, numpy as np
ap = argparse.ArgumentParser()
ap.add_argument("--min-gap", type=float, default=0.40); ap.add_argument("--keep", type=float, default=0.12)
ap.add_argument("--lead", type=float, default=0.10); ap.add_argument("--tail", type=float, default=0.35)
ap.add_argument("--zooms", default="1.0,1.13"); ap.add_argument("--face", default="0.5,0.55")
ap.add_argument("--punch-every", type=float, default=3.2); ap.add_argument("--phrases", default=None); ap.add_argument("--no-zoom", action="store_true"); ap.add_argument("--fps", type=float, default=30.0)
a = ap.parse_args(); FPS = a.fps

def read(p):
    w = wave.open(p); n = w.getnframes(); ch = w.getnchannels(); sr = w.getframerate()
    x = np.frombuffer(w.readframes(n), np.int16).reshape(-1, ch).astype(np.float32) / 32768; return x, sr
def write(p, x, sr):
    w = wave.open(p, "wb"); w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()

if not os.path.exists("work/asr16k_orig.wav"): shutil.copy("work/asr16k.wav", "work/asr16k_orig.wav")      # idempotent: always cut from the ORIGINALS
if not os.path.exists("work/voice_orig.wav"): shutil.copy("work/voice_raw.wav", "work/voice_orig.wav")
m16, sr16 = read("work/asr16k_orig.wav"); m = m16[:, 0]
H = 160; n = len(m) // H; e = np.array([np.sqrt(np.mean(m[i * H:(i + 1) * H] ** 2)) for i in range(n)]) * 32768
th = max(np.percentile(e, 15) * 1.6, 150); low = e < th
# long pauses
pauses = []; i = 0
while i < n:
    if low[i]:
        j = i
        while j < n and low[j]: j += 1
        if (j - i) / 100 >= a.min_gap: pauses.append((i / 100, j / 100))
        i = j
    else: i += 1
dur = n / 100
speech = np.where(~low)[0]
t_first, t_last = speech[0] / 100, speech[-1] / 100
start = max(0.0, t_first - a.lead); end = min(dur, t_last + a.tail)
cuts = []                                    # removed intervals (source time)
for p0, p1 in pauses:
    if p1 <= start or p0 >= end: continue
    c0, c1 = max(p0, start) + a.keep, min(p1, end) - a.keep
    if c1 - c0 > 0.08: cuts.append((c0, c1))
q = lambda t: round(t * FPS) / FPS           # snap to frame boundaries
segs = []; cur = q(start)
for c0, c1 in cuts:
    c0, c1 = q(c0), q(c1)
    if c1 <= c0: continue
    if c0 - cur >= 1 / FPS: segs.append([cur, c0])
    cur = c1
segs.append([cur, q(end)])
out_t = 0.0
for s in segs: s.append(out_t); out_t += s[1] - s[0]       # [src_a, src_b, out_a]
total = out_t
# ---- audio ----
orig_p = "work/voice_orig.wav"
v, sr = read(orig_p); parts = []; f = int(.006 * sr)
for sa, sb, _ in segs:
    seg = v[int(sa * sr):int(sb * sr)].copy()
    if len(seg) > 2 * f: seg[:f] *= np.linspace(0, 1, f)[:, None]; seg[-f:] *= np.linspace(1, 0, f)[:, None]
    parts.append(seg)
write("work/voice_raw.wav", np.concatenate(parts), sr)
mp = [];
for sa, sb, _ in segs: mp.append(m16[int(sa * sr16):int(sb * sr16)])
write("work/asr16k.wav", np.concatenate(mp), sr16)
# ---- frame map (output frame -> 1-based source frame file number) ----
nf = int(round(total * FPS)); fmap = []
k = 0
for fr in range(nf):
    t = fr / FPS
    while k + 1 < len(segs) and t >= segs[k + 1][2] - 1e-9: k += 1
    sa, sb, oa = segs[k]; st = sa + (t - oa); fmap.append(int(round(st * FPS)) + 1)
json.dump(fmap, open("work/framemap.json", "w"))
json.dump({"segments": [{"src_a": s[0], "src_b": s[1], "out_a": s[2]} for s in segs], "src_duration": dur, "out_duration": total}, open("work/edl.json", "w"), indent=1)
# ---- remap phrase times ----
def to_out(t):
    for sa, sb, oa in segs:
        if t <= sa: return oa                 # inside a removed gap -> start of the next kept segment
        if t <= sb: return oa + (t - sa)
    return total
if a.phrases:
    src = json.load(open(a.phrases))
    if not os.path.exists("data/transcript.source.orig.json"): shutil.copy(a.phrases, "data/transcript.source.orig.json")
    new = []
    for s0, s1, txt in src["phrases"]:
        o0, o1 = to_out(s0), to_out(s1)
        if o1 - o0 > 0.05: new.append([round(o0, 3), round(o1, 3), txt])
    src["phrases"] = new; src["_note"] = (src.get("_note", "") + " | times remapped by autocut.py").strip(" |")
    json.dump(src, open("data/transcript.source.json", "w"), ensure_ascii=False, indent=1)
# ---- camera.js: alternate zoom at every hard cut AND at sentence starts at least --punch-every apart (soft punch-in) ----
zs = [float(z) for z in a.zooms.split(",")]; face = [float(z) for z in a.face.split(",")]
starts = [p[0] for p in (new if a.phrases else [])]
bounds = [(round(oa, 3), False) for _, _, oa in segs]                  # (out time, soft?)
if not a.no_zoom and a.punch_every > 0:
    last = 0.0
    for t in sorted(set([b_[0] for b_ in bounds] + starts)):
        if any(abs(t - b_[0]) < 1e-3 for b_ in bounds): last = t; continue
        if t - last >= a.punch_every and total - t > 1.0: bounds.append((t, True)); last = t
bounds.sort()
cam = []
for i, (t, soft) in enumerate(bounds):
    nxt = bounds[i + 1][0] if i + 1 < len(bounds) else total + 3.0
    z = 1.0 if a.no_zoom else zs[i % len(zs)]
    cam.append({"a": round(t, 3), "b": round(nxt, 3), "z": z, "d": 0.0 if a.no_zoom else .03, "soft": soft})
os.makedirs("composition", exist_ok=True)
open("composition/camera.js", "w").write("window.CAMERA = " + json.dumps({"face": face, "segs": cam}) + ";\n")
print(f"source {dur:.1f}s -> edited {total:.1f}s ({len(segs)} segments, {len(cuts)} cuts, {dur - total:.1f}s of dead air removed, {sum(1 for c in cam if c["soft"])} punch-ins)")
print("finish({ duration: %.2f, outroAt: %.2f, footage: true })" % (total + 1.8, total + .5))
