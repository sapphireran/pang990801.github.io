# Sample datasets

These JSON files are **personal dashboard samples**, extracted from the live charts on this GitHub Pages site. They exist so the documentation and standalone examples can load the same numbers the dashboard already draws.

They are **not** a published clinical study, a shoe-factory last library, or a public health dataset. Treat every file as a teaching sample that ships with this personal visualization.

## Files

| File | Dashboard panel | Shape |
| --- | --- | --- |
| [`height-shoe-size.json`](height-shoe-size.json) | 男童女童身高与鞋码的关系 | 199 girl + 199 boy `[heightCm, shoeLengthCm]` points, plus min/max/mean summaries |
| [`age-foot-length.json`](age-foot-length.json) | 男童女童年龄与脚长的关系 | Ages 6–14, girl/boy mean foot length, and girl−boy difference |
| [`bmi-foot-ratio.json`](bmi-foot-ratio.json) | 儿童BMI与脚的胖瘦度关系 | BMI 12–24 vs plumpness series, plus the two ring-chart shares |
| [`foot-symmetry.json`](foot-symmetry.json) | 儿童双脚比例 | Ages 2–14 pie frames from the original `Math.log` formula |
| [`age-radar.json`](age-radar.json) | Center radar | Normalized 0–100 scores for height, three girths, shoe size, foot length, weight |
| [`plantar-pressure.json`](plantar-pressure.json) | `draw1.js` example | Seven plantar sites, typical vs diabetic-foot series (Pa) |
| [`tissue-thickness.json`](tissue-thickness.json) | `draw2.js` example | Fourteen sites, thickness in mm plus the original difference series |

## Units to keep straight

- **Height / foot length / shoe length on the scatter**: centimeters.
- **Age**: completed years on the category axis.
- **BMI**: `kg/m²` on the category axis.
- **Plumpness**: the dashboard’s 脚长/脚宽 style index, not a raw millimeter width.
- **Radar**: already normalized to 0–100. Do not add “cm” to those numbers.
- **Plantar pressure**: pascals, as labeled in `draw1.js`.
- **Tissue thickness**: millimeters for the two bar series. The line series is labeled `um` on the original chart and is **not** a unit conversion of the bars.

## How the files were produced

A one-off extractor read the arrays already embedded in `js/index.js`, `draw1.js`, and `draw2.js`. The symmetry frames re-run the same `Math.round(... Math.log(i+1))` expressions the pie timeline uses, so the example page and the live dashboard stay aligned.

If you edit a chart’s hardcoded series, update the matching JSON here and the example page that loads it.

## Suggested reads

1. [`../docs/data-notes.md`](../docs/data-notes.md) — caveats, age coverage, and what not to infer.
2. [`../docs/measurements.md`](../docs/measurements.md) — what each Chinese measurement name means.
3. [`../examples/index.html`](../examples/index.html) — pages that render these files.
