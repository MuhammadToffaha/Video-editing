"""Distribute word timings inside each pause-anchored phrase (weight ~ syllables),
snap inner word boundaries to local energy valleys, then chunk into caption groups."""
import json, re, sys, wave, numpy as np
src = json.load(open("data/transcript.source.json"))
w = wave.open(sys.argv[1]); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
H = 160; env = np.array([np.sqrt(np.mean(x[i*H:(i+1)*H]**2)) for i in range(len(x)//H)])
env = np.convolve(env, np.ones(3)/3, 'same')

def weight(tok):
    t = re.sub(r"[^\w]", "", tok.replace("‏", ""))
    if re.match(r"^[A-Za-z]", t): return max(2, len(t) * 0.7)
    t = re.sub(r"^(و|ف|ب|ل)?ال", lambda m: (m.group(1) or "") + "l", t)
    return max(2.0, len(t) * 0.85)

words, phrases = [], []
for pi, (a, b, text) in enumerate(src["phrases"]):
    toks = text.split(' ')
    ws = np.array([weight(t.replace("*", "")) for t in toks])
    edges = a + np.concatenate([[0], np.cumsum(ws)]) / ws.sum() * (b - a)
    for k in range(1, len(toks)):               # snap inner edges to valleys (+-70ms)
        c = int(edges[k] * 100); lo, hi = max(0, c - 7), min(len(env), c + 8)
        v = lo + int(np.argmin(env[lo:hi]))
        if env[v] < 0.6 * np.mean(env[max(0, c - 20):c + 20]): edges[k] = v / 100
    for k, t in enumerate(toks):
        key = t.startswith("*") or t.startswith("و‏*")
        clean = t.replace("*", "")
        words.append(dict(i=len(words), p=pi, text=clean, key=bool(key), start=round(float(edges[k]), 3), end=round(float(edges[k+1]), 3)))
    phrases.append(dict(p=pi, start=a, end=b))

# caption chunks: balanced split, <=4 words and <=26 chars per chunk, never across phrases
chunks = []
for ph in phrases:
    ids = [wd["i"] for wd in words if wd["p"] == ph["p"]]
    k = -(-len(ids) // 4)
    while True:
        sizes = [len(ids) // k + (1 if j < len(ids) % k else 0) for j in range(k)]
        parts, pos = [], 0
        for sz in sizes: parts.append(ids[pos:pos+sz]); pos += sz
        if k >= len(ids) or all(sum(len(words[i]["text"]) + 1 for i in pt) <= 27 for pt in parts): break
        k += 1
    chunks += parts
json.dump(dict(words=words, chunks=chunks, phrases=phrases), open("data/transcript.json", "w"), ensure_ascii=False, indent=1)
print(len(words), "words", len(chunks), "chunks")
for c in chunks: print(f'{words[c[0]]["start"]:6.2f}-{words[c[-1]]["end"]:6.2f}', " ".join(words[i]["text"] for i in c))
