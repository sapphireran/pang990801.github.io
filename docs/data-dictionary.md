# Data dictionary

Field names used by the dashboard, the example pages, and the files under `examples/data/`.

The live charts keep Chinese labels. Downloadable tables add English column names so the same series can be opened in a spreadsheet without renaming headers by hand.

## Shared conventions

| Convention | Meaning |
| --- | --- |
| `*_cm` | Length in centimetres |
| `*_mm` | Thickness in millimetres |
| `*_um` | Thickness difference in micrometres, as stored in `draw2.js` |
| `*_pa` | Plantar pressure in pascals, as stored in `draw1.js` |
| `*_zh` | Original Chinese label from the dashboard |
| Sex codes | `female` / `male` in files; 女童 / 男童 on the charts |
| Radar scores | Unitless 0–100 ranks, not raw centimetres |

Sample sizes on the homepage scatter are 199 girls and 199 boys. Age curves use one mean per integer age. Pressure and thickness sketches are landmark series, not population samples.

## `height-shoe-size`

Source: first IIFE in `js/index.js` (`name: '女性'` / `name: '男性'`).

| Column | Type | Unit | Description |
| --- | --- | --- | --- |
| `sex` | string | — | `female` or `male` |
| `sex_zh` | string | — | `女童` or `男童` |
| `height_cm` | number | cm | Standing stature |
| `shoe_length_cm` | number | cm | Shoe last / foot length used as 鞋码 on the Y axis |

Dashboard tooltip prints both values as centimetres even though the panel title says 鞋码. Treat Y as a length, not a Mondopoint or EU size.

Extracted summary from the current file:

| Group | n | Mean stature (cm) | Mean shoe length (cm) |
| --- | --- | ---: | ---: |
| Girls | 199 | 116.86 | 16.76 |
| Boys | 199 | 111.82 | 15.96 |

## `age-foot-length`

Source: second IIFE in `js/index.js`.

| Column | Type | Unit | Description |
| --- | --- | --- | --- |
| `age_years` | integer | years | Ages 6 through 14 |
| `girl_foot_length_cm` | number | cm | Mean girl foot length |
| `boy_foot_length_cm` | number | cm | Mean boy foot length |
| `girl_minus_boy_cm` | number | cm | Girl mean minus boy mean |

The difference series is the cyan area line on a secondary Y axis. It crosses zero between ages 10 and 11.

## `bmi-foot-ratio`

Source: third IIFE in `js/index.js`.

| Column | Type | Unit | Description |
| --- | --- | --- | --- |
| `bmi` | integer | kg/m² | Category axis, 12 through 24 |
| `girl_length_width_ratio` | number | — | Girl 脚胖瘦度, encoded as length/width × 10 in the file |
| `boy_length_width_ratio` | number | — | Boy 脚胖瘦度, same encoding |

The Y-axis caption is `脚长/脚宽`, but the stored values sit near 23–30. That is the dashboard's display scale (roughly ratio × 10), not a raw ratio near 2.5.

Ring charts on the same panel use placeholder numerators:

- Thin-foot ring: 50 / (50 + 180) ≈ 21.7%
- Wide-foot ring: 435 / (435 + 2400) ≈ 15.3%

Those rings are composition decorations, not a second independent study.

## `radar-age-profiles`

Source: fifth IIFE in `js/index.js`.

| Column | Dashboard label | Meaning |
| --- | --- | --- |
| `age_years` | 9岁–12岁 | One row per age |
| `stature` | 身高 | Normalized stature |
| `heel_girth` | 兜跟围长 | Heel / back-part girth |
| `tarsal_girth` | 跗骨围长 | Midfoot / tarsal girth |
| `metatarsal_girth` | 跖趾围长 | Ball / metatarsophalangeal girth |
| `shoe_size` | 鞋码 | Normalized shoe last |
| `foot_length` | 脚长 | Normalized foot length |
| `body_weight` | 体重 | Normalized body mass |

Every axis is capped at 100. Compare ages against each other, not against a centimetre tape.

## `left-right-asymmetry`

Source: fourth IIFE in `js/index.js`. Counts are generated, not typed in:

```text
a = round(36 - 13 * ln(i + 1))   # left 10–20% larger
b = round(17 -  6 * ln(i + 1))   # left >20% larger
c = round(11 -  4 * ln(i + 1))   # right >20% larger
d = round(27 - 10 * ln(i + 1))   # right 10–20% larger
same = 63 + a + b + c + d
```

`i` is 0 at age 2 and 12 at age 14. Natural log is `Math.log` in the browser.

| Column | Dashboard slice |
| --- | --- |
| `same_feet` | 双脚相同 |
| `left_larger_10_20` | 左脚比右脚大10-20% |
| `left_larger_over_20` | 左脚比右脚大20%以上 |
| `right_larger_over_20` | 右脚比左脚大20%以上 |
| `right_larger_10_20` | 右脚比左脚大10-20% |

## `plantar-pressure`

Source: `draw1.js`. Seven landmarks.

| Column | Unit | Description |
| --- | --- | --- |
| `site_zh` | — | 位点一 … 位点七 |
| `site` | — | `site_1` … `site_7` |
| `typical_pa` | Pa | Typical-foot series |
| `diabetic_foot_pa` | Pa | Diabetic-foot series |
| `difference_pa` | Pa | Diabetic minus typical |

Landmark names are ordinal only. The sketch never maps them onto heel, midfoot, or hallux.

## `tissue-thickness`

Source: `draw2.js`. Fourteen landmarks.

| Column | Unit | Description |
| --- | --- | --- |
| `site_index` | — | 1–14 |
| `typical_mm` | mm | Typical adult thickness |
| `diabetic_foot_mm` | mm | Diabetic-foot adult thickness |
| `difference_um` | µm | Difference series as stored in the sketch |

The difference series is labelled `差值:um` in the original option. It is not a precise millimetre conversion of the two bar series. Keep it as a third plotted track.

## File formats

Each dataset is written three ways by `scripts/extract_example_data.py`:

| Suffix | Use |
| --- | --- |
| `.csv` | Spreadsheet / pandas |
| `.json` | Structured payload with description + rows |
| `.js` | `window.ExampleData.<name>` for the example pages |

Regenerate all three from the chart sources instead of editing a CSV by hand. That keeps the example tables aligned with the homepage.
