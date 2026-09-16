# 中国人群脚型数据可视化

Personal GitHub Pages dashboard for **children’s foot-shape samples**: height vs shoe length, age vs foot length, BMI vs a length/width plumpness index, left/right size bands, and a 9–12 year radar of height, girths, shoe length, foot length, and weight.

Live site: <https://pang990801.github.io/>

This repository is **personal only**. It is a static visualization notebook, not a clinic, not a shoe factory, and not company code.

## Open the site

On GitHub Pages the root `index.html` is the dashboard.

Locally (needed for the example pages that `fetch` JSON):

```bash
python3 -m http.server 4173
```

- Dashboard: <http://127.0.0.1:4173/index.html>
- Written guide: <http://127.0.0.1:4173/docs/guide.html>
- Example gallery: <http://127.0.0.1:4173/examples/index.html>

More preview notes: [`docs/local-preview.md`](docs/local-preview.md)

## What is on the dashboard

| Panel | Chart | Sample file |
| --- | --- | --- |
| 男童女童身高与鞋码的关系 | Girl / boy scatter | [`data/height-shoe-size.json`](data/height-shoe-size.json) |
| 男童女童年龄与脚长的关系 | Dual bars + difference line | [`data/age-foot-length.json`](data/age-foot-length.json) |
| Center (old map column) | Ages 9–12 radar | [`data/age-radar.json`](data/age-radar.json) |
| 儿童BMI与脚的胖瘦度关系 | Dual area lines + two rings | [`data/bmi-foot-ratio.json`](data/bmi-foot-ratio.json) |
| 儿童双脚比例 | Playing pie timeline | [`data/foot-symmetry.json`](data/foot-symmetry.json) |

Two extra personal sketches (`draw1.js`, `draw2.js`) are wrapped as:

- [`examples/plantar-pressure.html`](examples/plantar-pressure.html)
- [`examples/tissue-thickness.html`](examples/tissue-thickness.html)

## Documentation

- [`docs/README.md`](docs/README.md) — index
- [`docs/overview.md`](docs/overview.md) — purpose and page layout
- [`docs/charts.md`](docs/charts.md) — how to read each panel
- [`docs/measurements.md`](docs/measurements.md) — 围长 / 鞋码 / 胖瘦度 glossary
- [`docs/methodology.md`](docs/methodology.md) — rem layout, ECharts IIFEs, Pages
- [`docs/data-notes.md`](docs/data-notes.md) — sample limits (please read before quoting a number)
- [`docs/guide.html`](docs/guide.html) — styled HTML version of the guide

## Repo layout

```
index.html          dashboard shell
css/index.css       live panel layout
js/index.js         five chart IIFEs (inline series)
js/echarts.min.js   vendored ECharts
data/               JSON mirrors of those series
docs/               personal documentation
examples/           standalone pages that load the JSON
draw1.js draw2.js   extra option sketches
```

`js/china.js` and `js/myMap.js` are an older flying-line map experiment. They stay in the tree but are commented out of `index.html`.

## Honest limits

The series are **teaching samples already embedded in the JavaScript**, not a published survey. There is no sampling frame, no per-age n, and no clinical claim. Details: [`docs/data-notes.md`](docs/data-notes.md).
