# Examples

Standalone pages for the personal children’s foot-shape charts. Each page loads JSON from [`data/`](data/) with `fetch`, so serve the **repository root** over HTTP:

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/examples/.

| Page | JSON | Source in the repo |
| --- | --- | --- |
| [height-shoe-size.html](height-shoe-size.html) | `data/height-shoe-size.json` | `js/index.js` scatter |
| [age-foot-length.html](age-foot-length.html) | `data/age-foot-length.json` | `js/index.js` pictorial bars |
| [growth-radar.html](growth-radar.html) | `data/growth-radar.json` | `js/index.js` radar |
| [bmi-plumpness.html](bmi-plumpness.html) | `data/bmi-plumpness.json` | `js/index.js` BMI panel |
| [bilateral-ratio.html](bilateral-ratio.html) | `data/bilateral-ratio.json` | `js/index.js` timeline pie |
| [plantar-pressure.html](plantar-pressure.html) | `data/plantar-pressure.json` | `draw1.js` (not on the home page) |
| [tissue-thickness.html](tissue-thickness.html) | `data/tissue-thickness.json` | `draw2.js` (not on the home page) |

Shared code:

- [`js/stats.js`](js/stats.js) — mean / OLS / ring percent
- [`js/boot.js`](js/boot.js) — `fetch` + `echarts.init`
- [`css/examples.css`](css/examples.css) — gallery theme (no `flexible.js` rem contract)
- [`scripts/extract-data.js`](scripts/extract-data.js) — rebuild JSON from `js/index.js`
- [`scripts/validate-data.js`](scripts/validate-data.js) — length and formula checks

The live dashboard still embeds arrays in `js/index.js`. These pages exist so a series can be inspected, tabulated, and restyled without opening the five-panel board.
