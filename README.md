# 中国人群脚型数据可视化（儿童脚型）

Personal GitHub Pages board for children’s foot-shape charts. Live dashboard: [pang990801.github.io](https://pang990801.github.io/).

This repo is **personal study / visualization work**. It is not a clinic product and the embedded series are sample dashboard numbers.

## What’s here

| Path | Role |
| --- | --- |
| [`index.html`](index.html) + [`js/index.js`](js/index.js) | Five-panel ECharts dashboard. |
| [`docs/`](docs/index.html) | Chart catalog, data dictionary, measurement caveats, local preview, cookbook. |
| [`examples/`](examples/index.html) | Standalone pages that reload the same series from JSON. |
| [`examples/data/`](examples/data/) | Extracted datasets (scatter, means, radar, pressure, thickness). |
| [`draw1.js`](draw1.js), [`draw2.js`](draw2.js) | Adult plantar-pressure and tissue-thickness options, not mounted on the home page. |

## Dashboard panels

1. Height vs shoe size (scatter, 199 girls + 199 boys).
2. Age 6–14 vs mean foot length (cylinder bars + girl−boy difference).
3. Ages 9–12 growth radar (seven normalized axes).
4. BMI 12–24 vs plumpness index (area lines + two rings).
5. Left/right foot-size share by age 2–14 (timeline pie).

Details: [`docs/charts.md`](docs/charts.md). Units and caveats: [`docs/data-dictionary.md`](docs/data-dictionary.md), [`docs/measurement-notes.md`](docs/measurement-notes.md).

## Preview locally

```bash
python3 -m http.server 4173
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/) for the board and [http://127.0.0.1:4173/examples/](http://127.0.0.1:4173/examples/) for the gallery. Example pages need HTTP because they `fetch` JSON. More notes: [`docs/local-preview.md`](docs/local-preview.md).

## Refresh JSON after editing `js/index.js`

```bash
node examples/scripts/extract-data.js
node examples/scripts/validate-data.js
```

## Related personal pages linked from the nav

- [首页](https://scuscientia.github.io/)
- [畸形足或病足](https://ytep-zhi.github.io/)
