# 中国人群脚型数据可视化

Personal GitHub Pages project. Children’s foot-shape charts from a student-era dashboard, plus a reading room and a small lab that sit **next to** the original five panels.

Live dashboard (when Pages points at this tree): [`index.html`](index.html)

## What is in this branch

| Path | Role |
| --- | --- |
| `index.html` + `js/index.js` | Original five-chart dashboard |
| [`docs/`](docs/README.md) | Source atlas, glossary, formulas, units, caveats |
| [`data/`](data/README.md) | JSON/CSV extracted from the IIFEs |
| [`examples/lab/`](examples/lab/README.md) | Explorer, regression, story, converters |
| `scripts/extract-personal-datasets.py` | Regenerates `data/` |

No company repositories and no new survey data. The lab reads the same literals that were already in `js/index.js`, `draw1.js`, and `draw2.js`.

## Preview locally

```bash
python3 -m http.server 4173
```

- Dashboard: http://127.0.0.1:4173/
- Notes: http://127.0.0.1:4173/docs/
- Lab: http://127.0.0.1:4173/examples/lab/
- Regenerated numbers: http://127.0.0.1:4173/data/summary.json

Refresh the extracted files after editing the original series:

```bash
python3 scripts/extract-personal-datasets.py
```

## Dashboard at a glance

1. Height × shoe length scatter (199 girls, 199 boys, *r* ≈ 0.91)
2. Mean foot length, ages 6–14 (crossover at 11)
3. BMI vs a “stoutness” series + two decorative rings
4. Left/right mix pie generated with `Math.log`
5. Radar of 0–100 display scores for ages 9–12

`draw1.js` and `draw2.js` are unmounted adult sketches. Notes: [`docs/display-caveats.md`](docs/display-caveats.md).

## Pages URL

The working user/repo URL is `https://sapphireran.github.io/pang990801.github.io/`.
The apex `https://pang990801.github.io/` is a different host.
