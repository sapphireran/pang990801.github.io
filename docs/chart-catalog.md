# Chart catalog

All five live panels are defined in `js/index.js`. The matching isolated
pages load JSON from `examples/data/` instead of reading the dashboard
file.

## 1. Height vs shoe length

- **DOM:** `.bar .chart`
- **Type:** two scatter series (`女性`, `男性`)
- **Source arrays:** ~199 points each, `[heightCm, shoeLengthCm]`
- **JSON:** `examples/data/height-shoe-size.json`
- **Example:** `examples/charts/height-shoe-scatter.html`

Tooltips print both coordinates in centimeters. Each series has a dashed
bounding box (`markArea`), min/max `markPoint`s, an average `markLine`,
and a vertical guide at 115 cm (girls) or 110 cm (boys). The toolbox
exposes brush, dataZoom, and save-as-image.

The example page adds a least-squares line computed in
`examples/js/foot-stats.js`. The dashboard itself does not draw that
line.

## 2. Age vs foot length

- **DOM:** `.line .chart`
- **Type:** paired pictorial bars plus a difference line
- **Ages:** 6 through 14
- **JSON:** `examples/data/age-foot-length.json`
- **Example:** `examples/charts/age-foot-length.html`

Girl and boy means are drawn as gradient bars capped with a diamond
`pictorialBar`. The cyan line is girl mean minus boy mean. It uses the
second y-axis. The sign flips around age 11: the stored differences are
`[0.28, 0.48, 0.4, 0.33, 0.08, -0.03, -0.15, -0.33, -0.5]`.

## 3. BMI vs plumpness index

- **DOM:** `.bar1 .chart`
- **Type:** two smooth area lines plus two decorative rings
- **JSON:** `examples/data/bmi-foot-ratio.json`
- **Example:** `examples/charts/bmi-ratio.html`

X-axis values are integer BMI 12–24. The y-axis is labeled
`脚胖瘦度（脚长/脚宽）` with a minimum of 20. The stored numbers sit
between about 23 and 30, so they cannot be a raw length/width ratio
(that would be near 2.5). Treat the series as a **displayed index**.

The two rings on the right are labeled 过瘦脚占比 and 过胖脚占比. Each
ring is a two-slice pie: one highlighted value and one placeholder
slice. The percentages are therefore

```
thin  = 50 / (50 + 180)     ≈ 21.7%
plump = 435 / (435 + 2400)  ≈ 15.3%
```

Those shares are decorative. They are not derived from the BMI lines.

## 4. Left / right foot symmetry

- **DOM:** `.line1 .chart`
- **Type:** timeline pie (`baseOption` + `options`)
- **JSON:** `examples/data/foot-symmetry-by-age.json`
- **Example:** `examples/charts/symmetry-timeline.html`

Ages 2–14 auto-play every two seconds. Category counts are **not**
stored as tables in `js/index.js`. They are generated with:

```js
a = Math.round(36 - 13 * Math.log(i + 1)); // left larger 10–20%
b = Math.round(17 -  6 * Math.log(i + 1)); // left larger >20%
c = Math.round(11 -  4 * Math.log(i + 1)); // right larger >20%
d = Math.round(27 - 10 * Math.log(i + 1)); // right larger 10–20%
same = 63 + a + b + c + d;
```

`i` is the age index starting at 0 for 2 years. Natural log. The
extractor and `foot-stats.generateSymmetryByAge()` use the same
formulas so the JSON matches the live pie.

## 5. Age 9–12 radar

- **DOM:** `.map .chart` (the center column is named `map` for historical
  reasons)
- **Type:** circular radar, four overlapping series
- **JSON:** `examples/data/radar-age-profiles.json`
- **Example:** `examples/charts/age-radar.html`

Seven axes, each capped at 100: 身高, 兜跟围长, 跗骨围长, 跖趾围长,
鞋码, 脚长, 体重. The plotted values are already scaled. They are not
centimeters or kilograms.

The age-12 shoe and foot-length entries are written in source as
`77-6` and `79-8`, i.e. **71** and **71**. The JSON stores the evaluated
numbers and a short source note.

## Unpublished sketches

`draw1.js` (plantar pressure, Pa) and `draw2.js` (plantar thickness, mm)
are catalogued in [unpublished-sketches.md](unpublished-sketches.md) and
rendered under `examples/charts/plantar-*.html`.
