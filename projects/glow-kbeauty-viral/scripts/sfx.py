"""Procedural SFX synthesis. Places one sound per cue exported by the timeline -> work/sfx.wav (48k stereo)."""
import json, sys, wave, numpy as np
SR = 48000; rng = np.random.default_rng(7)
cues = json.load(open(sys.argv[1])); dur = cues["duration"]
t_ = lambda d: np.arange(int(SR * d)) / SR
env = lambda n, a=.004, k=8: np.minimum(1, np.arange(n) / (a * SR)) * np.exp(-k * np.arange(n) / n)

def lp(x, fc):  # one-pole lowpass
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
def bp_noise(d, f0, f1, q=.3):  # swept noisy whoosh via modulated one-pole bandpass approximation
    n = int(SR * d); x = rng.standard_normal(n); fc = np.geomspace(f0, f1, n)
    out = np.zeros(n); lo = 0.; hi = 0.
    for i in range(n):
        a = np.exp(-2 * np.pi * fc[i] / SR); lo = (1 - a) * x[i] + a * lo
        b = np.exp(-2 * np.pi * fc[i] * 0.35 / SR); hi = (1 - b) * x[i] + b * hi
        out[i] = lo - hi
    return out / (np.abs(out).max() + 1e-9)

def whoosh(v):
    d = .42; x = bp_noise(d, 500, 3200); n = len(x); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return .30 * v * x * e
def zoom(v):
    d = .38; x = bp_noise(d, 200, 900); n = len(x); return .16 * v * x * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.3
def pop(v):
    d = .16; t = t_(d); f = 520 + 380 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return .26 * v * np.sin(ph) * env(len(t), .002, 7)
def tick(v):
    d = .08; t = t_(d); return .17 * v * (np.sin(2 * np.pi * 2400 * t) + .4 * np.sin(2 * np.pi * 4800 * t)) * env(len(t), .001, 9)
def chime(v):
    d = .9; t = t_(d); x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-k * t) for f, a, k in [(1318.5, 1, 5), (1975.5, .6, 6), (2637, .3, 8)])
    return .17 * v * x * np.minimum(1, t / .003)
def thud(v):
    d = .7; t = t_(d); sub = np.sin(2 * np.pi * (48 + 40 * np.exp(-t * 14)) * t) * np.exp(-t * 6)
    sh = lp(rng.standard_normal(len(t)), 9000) * np.exp(-t * 9) * .15
    air = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 4) for f in (2093, 3136, 4186)) * .06
    return .55 * v * (sub + sh + air)
def swipe(v):
    d = .22; x = bp_noise(d, 3500, 900); n = len(x); return .22 * v * x * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.2
def sparkle(v):
    out = np.zeros(int(SR * .5))
    for i, f in enumerate((2637, 3322, 3951, 5274)):
        t = t_(.3); s = np.sin(2 * np.pi * f * t) * np.exp(-t * 16) * .6; o = int(i * .05 * SR); out[o:o + len(s)] += s[:len(out) - o]
    return .12 * v * out
def rise(v):
    d = .3; t = t_(d); f = 380 * np.exp(t * 2.6); ph = 2 * np.pi * np.cumsum(f) / SR
    return .14 * v * np.sin(ph) * np.sin(np.pi * t / d) ** .8
def swell(v):
    d = .55; x = bp_noise(d, 300, 2600); n = len(x); return .30 * v * x * np.linspace(0, 1, n) ** 1.5 * np.minimum(1, (n - np.arange(n)) / (.05 * SR))
def scribble(v, d=.4):
    d = float(min(max(d, .15), 1.8)); x = bp_noise(d, 2600, 5200); n = len(x); t = np.arange(n) / SR
    am = .55 + .45 * np.sin(2 * np.pi * 11 * t + rng.uniform(0, 6)) ** 2          # back-and-forth strokes
    return .11 * v * x * am * np.minimum(1, np.minimum(t / .03, (d - t) / .05))
def page(v, d=None):
    x = bp_noise(.28, 1400, 4200); n = len(x); return .16 * v * x * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
S = dict(scribble=scribble, page=page, whoosh=whoosh, zoom=zoom, pop=pop, tick=tick, chime=chime, thud=thud, swipe=swipe, sparkle=sparkle, rise=rise, swell=swell)

N = int(SR * dur); mix = np.zeros(N)
for c in cues["cues"]:
    s = (S[c["type"]](c["v"], c["d"]) if "d" in c and c["type"] == "scribble" else S[c["type"]](c["v"])); o = int(c["t"] * SR)
    if o < N: mix[o:o + len(s)] += s[:N - o]
mix = np.tanh(mix * 1.1)
st = np.stack([mix, mix], 1)
w = wave.open(sys.argv[2], "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
print("cues:", len(cues["cues"]), "peak", float(np.abs(mix).max()))
