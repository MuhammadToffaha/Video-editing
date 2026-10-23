"""List pauses (>=70 ms low energy) in the voice track. These are the reliable phrase boundaries used to anchor word timing.
usage: python3 -I scripts/pauses.py <wav>"""
import sys, wave, numpy as np
w = wave.open(sys.argv[1]); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
h = 160; n = len(x) // h; e = np.array([np.sqrt(np.mean(x[i*h:(i+1)*h]**2)) for i in range(n)])
th = max(np.percentile(e, 15) * 1.6, 150); low = e < th; i = 0; res = []
while i < n:
    if low[i]:
        j = i
        while j < n and low[j]: j += 1
        if j - i >= 7: res.append((round(i / 100, 2), round(j / 100, 2)))
        i = j
    else: i += 1
print("threshold", round(th), "\n".join(f"pause {a:6.2f} - {b:6.2f}" for a, b in res), sep="\n")
