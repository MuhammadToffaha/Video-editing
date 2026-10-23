# Scene patterns (all in projects/glow-kbeauty-reel/composition/scene.js)

Helpers (lib.js): `card(t0,t1,{y=235,h,w=900,cls,html})` glass card with enter/exit + sheen + whoosh cue; `cls:'brand'` = solid brand colour hero card.
`pop(el,t,{s,y,d,ease,snd,v})` scale/fade in (+SFX); `fade`, `draw(svgPath,t,d)`, `hide`, `cue(t,type,vol)` where type in whoosh|zoom|pop|tick|chime|thud|swipe|sparkle|rise|swell.
`ts('word',nth,after)` -> start time of a spoken word (throws if missing - good, catches typos). `wd()` returns the word object. `ico('name')` icon set: drop sparkle bottle tube jar dropper sun shield check x flask info pump chat face heart flame star box factory plus play arrow.

| Spoken idea | Pattern |
|---|---|
| Hook / topic | icon tile + eyebrow + 2-line headline, sparkle burst on the key word |
| Choosing / confusion | 3 tiles scanned in sequence + bouncing "؟" bubble |
| Brand / name mention | brand-colour card, logo `clip-path` wipe + thud |
| List of names | skeleton chips (dashed) that fill with the name at its word time; last chip "+ MORE" |
| Categories | tiles with a travelling highlight, labels under |
| A matches B | two nodes, dashed line, mint line + travelling dot, check badge on the word "suitable" |
| Not X or Y | chips with coral strike-through drawn on each word, then dimmed |
| Trust / authentic | shield tile + flow nodes (source -> brand) |
| Quality | 5 stars filling sequentially |
| Steps / explain | dim rows that light up + mint check at each spoken item |
| Roadmap / "not the last" | node track, dashed future nodes appear on "not last", pulse on "step" |
| Growth / "better every day" | bar chart via attr tweens + trend line draw + arrow |
| Closing emotion | heart tile + pulse rings + keyword fade |
| End | brand-colour wipe + logo scale-in |
