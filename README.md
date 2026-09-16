# 中国人群脚型数据可视化

Personal GitHub Pages dashboard from 2020. The live page is still `index.html`: four side charts and a central radar drawn by ECharts.

This branch adds a **Night Desk** — a personal second-edition reading room and a set of workbenches. They reprint numbers that were already hardcoded in `js/index.js`, `draw1.js`, and `draw2.js`. They do not add field measurements, clinical claims, or factory last specifications.

## Open locally

```bash
python3 -m http.server 4173
```

- [仪表盘](http://127.0.0.1:4173/index.html)
- [夜读](http://127.0.0.1:4173/docs/desk/index.html)
- [课桌示例](http://127.0.0.1:4173/examples/desk/index.html)

## What the desk contains

| Path | Role |
| --- | --- |
| `docs/desk/` | Binding notes, measurement words, chart reading, misread clinic, leftover atlas, print card |
| `examples/desk/` | OLS residuals, age crossover, symmetry formula, radar decoder, leftover mounts |
| `data/desk/` | Extracted JSON plus `payload.js` |
| `scripts/extract-desk.py` | Rebuild the payload from the original scripts |
| `scripts/verify-desk.py` | Re-extract and check counts, crossover age, and pages |

```bash
python3 scripts/extract-desk.py
python3 scripts/verify-desk.py
```

## Anchors already in the 2020 files

- 199 female + 199 male height / labeled-shoe-size points
- Boys' mean foot length first exceeds girls' at age 11 (21.32 vs 21.29 cm)
- OLS slopes about 0.14 cm on the shoe-size axis per cm of height, r² ≈ 0.83
- `draw1.js` / `draw2.js` remain adult leftover contrasts

Read `docs/desk/clinic.html` before treating any axis as a shoe-size standard.
