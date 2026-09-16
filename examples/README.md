# Standalone chart examples

Personal HTML wrappers around the same series the dashboard already draws. Each page loads JSON from [`../data/`](../data/) through `fetch`, so you need a static HTTP server — see [`../docs/local-preview.md`](../docs/local-preview.md).

## Pages

| File | Chart | Script |
| --- | --- | --- |
| [index.html](index.html) | Gallery | — |
| [height-shoe-size.html](height-shoe-size.html) | Height × shoe scatter | `js/height-shoe-size.js` |
| [age-foot-length.html](age-foot-length.html) | Age × foot-length bars | `js/age-foot-length.js` |
| [age-radar.html](age-radar.html) | 9–12 radar | `js/age-radar.js` |
| [bmi-foot-ratio.html](bmi-foot-ratio.html) | BMI × plumpness | `js/bmi-foot-ratio.js` |
| [foot-symmetry.html](foot-symmetry.html) | Symmetry timeline | `js/foot-symmetry.js` |
| [plantar-pressure.html](plantar-pressure.html) | `draw1.js` pressure | `js/plantar-pressure.js` |
| [tissue-thickness.html](tissue-thickness.html) | `draw2.js` thickness | `js/tissue-thickness.js` |

Shared helpers: [`js/shared.js`](js/shared.js). Shared look: [`styles/examples.css`](styles/examples.css). Vendored ECharts: [`../js/echarts.min.js`](../js/echarts.min.js).

## Why these exist

`js/index.js` keeps five IIFEs and inline arrays so the home page can stay a single-file dashboard. The example pages exist so you can:

- open one chart without the rem/1024px shell,
- point a reviewer at a single URL,
- change a series in JSON and see it without hunting through a 1,100-line IIFE.

They are still **personal teaching pages**, not a second product.
