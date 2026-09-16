# Data notes

Every JSON file under `examples/data/` is copied or regenerated from
files in **this** repository. The extractor is
`examples/scripts/extract-dashboard-data.js`.

```bash
node examples/scripts/extract-dashboard-data.js
```

That command overwrites the JSON. It does not call a network API and it
does not create new measurements.

## Inventory

| File | Rows / points | Origin |
| --- | --- | --- |
| `height-shoe-size.json` | 199 girls + 199 boys | Scatter series in `js/index.js` |
| `age-foot-length.json` | 9 ages (6–14) | Bar + line series in `js/index.js` |
| `bmi-foot-ratio.json` | 13 BMI integers (12–24) | Area series + ring constants in `js/index.js` |
| `foot-symmetry-by-age.json` | 13 ages (2–14) | Same `Math.log` formulas as the timeline pie |
| `radar-age-profiles.json` | 4 ages × 7 spokes | Radar `value` arrays in `js/index.js` |
| `plantar-pressure.json` | 7 sites | `draw1.js` |
| `plantar-thickness.json` | 14 sites | `draw2.js` |
| `catalog.json` | file list | Written by the extractor |

`examples/data/catalog.json` is a short index of those files.

## What the numbers are (and are not)

- They are the literals already drawn on a personal study dashboard.
- They are **not** a released research table, a CSV from a lab, or a
  patient registry.
- They should not be used to size shoes, diagnose a foot, or estimate
  prevalence.
- The symmetry pie is a **formula**, not a counted sample. As age
  index `i` grows, the unequal-foot slices shrink and the “same” slice
  is `63 + a + b + c + d`.
- The BMI rings are two-slice decorations. Their percentages are
  `highlighted / (highlighted + placeholder)`, not statistics computed
  from the scatter cloud.
- Radar spokes are already normalized to 0–100. Adding them as if they
  were centimeters will not recover stature or foot length.

## Checks after a re-extract

```bash
node examples/scripts/test-foot-stats.js
node examples/scripts/summarize-data.js
```

The test file asserts, among other things:

- 199 + 199 scatter points
- the published age-6 foot lengths `18.55` / `18.27`
- symmetry at 2 years matches `generateSymmetryByAge()`
- a hand-checked linear regression (`y = 2x + 1`)
- Pearson correlation of a series with itself is 1

If `js/index.js` changes, re-run the extractor and the tests so the
example pages stay aligned with the dashboard.
