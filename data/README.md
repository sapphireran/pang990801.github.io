# Personal foot-shape datasets

These JSON files are extracted from the original personal dashboard
(`js/index.js`, `draw1.js`, `draw2.js`). They exist so documentation pages
and standalone examples can load the same numbers without copying arrays
out of chart options.

This is a personal GitHub Pages project. The values are demonstration
series used to draw the 2020 dashboard; they are not a public health
release and should not be treated as clinical advice.

## Files

| File | Chart on live home page | Shape |
| --- | --- | --- |
| `catalog.json` | index of every dataset | `{ project, datasets[] }` |
| `height-shoe-size.json` | scatter, top-left | `{ series: { female, male } }` pairs `[height_cm, shoe_cm]` |
| `age-foot-length.json` | bars + difference line, bottom-left | age-group means |
| `bmi-plumpness.json` | lines + two rings, top-right | BMI bin → plumpness |
| `left-right-ratio.json` | timeline pie, bottom-right | counts by age 2–14 |
| `age-radar.json` | center radar | normalized 0–100 scores, ages 9–12 |
| `plantar-pressure.json` | not wired into `index.html` | seven plantar sites, Pa |
| `tissue-thickness.json` | not wired into `index.html` | fourteen sites, mm / µm |

## Field notes

### Height vs shoe length

- `series.female` / `series.male`: each item is `[standing_height_cm, shoe_length_cm]`.
- `summary.*.pearson_r` is the Pearson correlation of those two columns.
- The live scatter also draws min/max mark points and a vertical average
  height line (115 cm for girls, 110 cm for boys).

### Age vs foot length

- `ages` is `[6, 7, …, 14]`.
- `series.female_cm` and `series.male_cm` are group means, not raw feet.
- `series.female_minus_male_cm` is girl mean minus boy mean. It starts
  positive and becomes negative after age 10.

### BMI vs plumpness

- `bmi_bins` are integer BMI labels, not subject IDs.
- `series.*_plumpness` follows the dashboard axis labeled 脚长/脚宽.
- `extreme_share` copies the original ring-chart numerators/remainders
  (`50/180` thin, `435/2400` wide). Those remainders are placeholders
  in the 2020 option object.

### Left / right mix

The pie timeline is generated, not measured pointwise. For age index
`i = age_years - 2`:

```
left_10_20   = round(36 - 13 * ln(i+1))
left_over_20 = round(17 -  6 * ln(i+1))
right_over_20= round(11 -  4 * ln(i+1))
right_10_20  = round(27 - 10 * ln(i+1))
same         = 63 + left_10_20 + left_over_20 + right_over_20 + right_10_20
```

`scripts/export-datasets.py` uses Python `math.log` (natural log) so the
exported counts match `Math.log` in the browser.

### Radar

Indicators, in order: 身高, 兜跟围长, 跗骨围长, 跖趾围长, 鞋码, 脚长, 体重.
Each value is a 0–100 score, not a raw centimeter or kilogram.

The original 12-year shoe and foot entries were written as `77-6` and
`79-8`. The JSON stores the evaluated numbers `71` and `71`.

### Unused adult series

`draw1.js` and `draw2.js` never load from `index.html`. They compare
typical adult feet with diabetic-foot series (pressure in Pa, tissue
thickness in mm). Examples under `/examples/` render them so those
files are not dead code.

## Regenerating

From the repository root:

```bash
python3 scripts/export-datasets.py
node tests/validate-data.js
```

The exporter overwrites JSON in this folder. Edit the Python source
arrays if a number in the live dashboard changes, then re-run both
commands.
