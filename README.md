# 儿童脚型数据可视化

Personal GitHub Pages project. The root page is a dark ECharts dashboard about children’s foot shape: height versus shoe length, age versus foot length, BMI versus a plumpness index, left/right size mix, and a 9–12 year radar of body and last measurements.

This branch adds a **docs** section and **standalone examples** so those series can be read one chart at a time. The numbers are teaching samples from the original `js/index.js` / `draw1.js` / `draw2.js` files, not a published study.

## Open locally

Anything that can serve the directory works. Datasets are fetched as JSON, so `file://` will fail.

```bash
python3 -m http.server 4173
```

Then:

- dashboard: `http://127.0.0.1:4173/`
- docs hub: `http://127.0.0.1:4173/docs/`
- examples hub: `http://127.0.0.1:4173/examples/`

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Original five-panel dashboard |
| `docs/` | How to read the charts, field dictionary, limits |
| `examples/` | One-chart pages with extra controls |
| `data/` | JSON extracted from the dashboard series |
| `js/data-loader.js` | `FootData.load(name)` for example pages |
| `scripts/validate-data.js` | Checks ids, lengths, and a few invariants |

```bash
node scripts/validate-data.js
```

## Example pages

- [年龄与脚长](examples/growth.html) — means plus girls-minus-boys
- [身高估鞋码](examples/shoe-size.html) — scatter and OLS readout
- [左右脚比例](examples/symmetry.html) — stop the timeline on one age
- [分年龄画像](examples/radar.html) — toggle 9–12 year profiles
- [足底压力](examples/pressure.html) — former `draw1.js` draft
- [皮下厚度](examples/thickness.html) — former `draw2.js` draft

Read [docs/limitations.html](docs/limitations.html) before reusing a number.
