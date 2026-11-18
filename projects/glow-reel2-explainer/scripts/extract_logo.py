"""Turn a logo on a flat colour background into a white-on-transparent PNG + print the brand colour.
usage: python3 -I scripts/extract_logo.py logo.png assets/logo_white.png"""
import sys, numpy as np
from PIL import Image
im = np.array(Image.open(sys.argv[1]).convert("RGB")).astype(float)
bg = np.median(im.reshape(-1, 3), axis=0); print("brand/background colour rgb", bg, "hex #%02X%02X%02X" % tuple(int(v) for v in bg))
a = np.clip((im.mean(2) - bg.mean()) / (255 - bg.mean()), 0, 1)       # works for LIGHT logo on DARKER bg; invert for dark-on-light
ys, xs = np.where(a > 0.05)
out = np.zeros(im.shape[:2] + (4,), np.uint8); out[..., :3] = 255; out[..., 3] = (a * 255).astype(np.uint8)
Image.fromarray(out).crop((xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5)).save(sys.argv[2]); print("saved", sys.argv[2])
