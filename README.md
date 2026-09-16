# 中国人群脚型数据可视化

Personal GitHub Pages project: a 2020 children’s foot-shape dashboard
built with ECharts. This repository is **personal only**. It does not
contain company code.

Live homepage: [`index.html`](index.html)

## Field yearbook

A bilingual desk copy now sits beside the original one-screen dashboard:

- [Docs lobby](docs/yearbook/index.html) — stations, reading notes, provenance, leftover annex, hosting, glossary
- [Example desk](examples/yearbook/index.html) — scatter fit, growth folio, BMI bench, symmetry reel, radar portraits, leftover reconstructions, unused map, print folio
- [Data pack](data/yearbook/README.md) — JSON extracted from `js/index.js`, `draw1.js`, and `draw2.js`

```
python3 -m http.server 4173
python3 scripts/build-yearbook.py
python3 scripts/verify-yearbook.py
```

## What the homepage already shows

| Panel | Host | Series |
| --- | --- | --- |
| Height × shoe | `.bar .chart` | 199 girl + 199 boy scatter points |
| Age × foot length | `.line .chart` | Means for ages 6–14, plus girl−boy |
| BMI × shape | `.bar1 .chart` | Length/width lines and placeholder rings |
| Left/right share | `.line1 .chart` | Formula bins, ages 2–14 |
| Center radar | `.map .chart` | Relative 7-spoke profiles, ages 9–12 |

Leftover files `draw1.js`, `draw2.js`, `js/china.js`, and `js/myMap.js`
are documented in the yearbook annex. They are not mounted by the homepage.

## Local preview

Serve the repo root (needed for the map annex, which loads `js/china.js`):

```
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/` for the dashboard, or
`http://127.0.0.1:4173/docs/yearbook/` for the desk copy.
