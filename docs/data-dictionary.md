# Data dictionary

Extracted series live in [`examples/data/`](../examples/data/). `catalog.json` lists every file.

Coordinates and labels below match the **dashboard**, including quirks.

## `height-shoe.json`

| Field | Type | Meaning |
| --- | --- | --- |
| `series.female.points` | `[height_cm, shoe_cm][]` | 199 girl pairs |
| `series.male.points` | `[height_cm, shoe_cm][]` | 199 boy pairs |

`shoe_cm` is what the tooltip calls 鞋码. It is a centimetre length, i.e. **foot length used as a size proxy**, not EU/US/UK last size.

### Summary (`height-shoe-summary.json`)

| Group | n | height mean (sd) | shoe mean (sd) | Pearson r |
| --- | ---: | --- | --- | ---: |
| girls | 199 | 116.855 (21.396) | 16.761 (3.300) | 0.9135 |
| boys | 199 | 111.819 (21.754) | 15.963 (3.406) | 0.9156 |

Height range roughly 75–153 cm (early childhood through early teens). Rows are **not** an age column — you cannot recover age from this file.

## `age-foot-length.json`

| Field | Length | Unit |
| --- | ---: | --- |
| `ages_years` | 9 | years 6–14 |
| `series.girls_foot_length_cm` | 9 | cm, sample mean |
| `series.boys_foot_length_cm` | 9 | cm, sample mean |
| `series.girl_minus_boy_cm` | 9 | cm, girl − boy |

`girl_minus_boy_cm[i]` equals the two length series subtracted; keep it for the example chart so it does not recompute a different rounding.

Observed crossover: last positive difference at age 10 (`+0.08`), first negative at age 11 (`−0.03`).

## `bmi-foot-ratio.json`

| Field | Meaning |
| --- | --- |
| `bmi` | integer bins 12–24 |
| `series.girls` / `series.boys` | plumpness index (length/width style, y ≈ 23–30) |
| `ring_charts.thin_feet` | `{highlighted: 50, remainder: 180}` |
| `ring_charts.thick_feet` | `{highlighted: 435, remainder: 2400}` |

Do not join this file to `height-shoe.json` by row index. They are different aggregations.

## `bilateral-symmetry.json`

Each `rows[]` element:

| Field | Origin |
| --- | --- |
| `age_years` | 2 … 14 |
| `age_label` | `2岁` … |
| `same` | `63 + a + b + c + d` |
| `left_10_20_pct_larger` | `a` |
| `left_over_20_pct_larger` | `b` |
| `right_over_20_pct_larger` | `c` |
| `right_10_20_pct_larger` | `d` |
| `total` | sum of the five slices |

Natural log is `Math.log` (base *e*). At age 2, `i = 0`, `ln(1) = 0`, so `a=36, b=17, c=11, d=27`, `same=154`, `total=245`.

## `growth-radar.json`

| Field | Meaning |
| --- | --- |
| `axes` | seven Chinese indicator names, dashboard order |
| `axes_en` | snake_case English, same order |
| `series.age_9` … `age_12` | length-7 vectors in `[0, 100]` |

These are **not** z-scores of the scatter sample. They are hand-set polygon shapes.

## `plantar-pressure.json`

| Field | Meaning |
| --- | --- |
| `sites` | 位点一 … 位点七 |
| `series.typical_adults` | Pa as labelled |
| `series.diabetic_foot` | Pa as labelled |

Site anatomy is **not named** in `draw1.js` (no hallux / heel / metatarsal labels). Keep the original 位点 numbering.

## `subcutaneous-thickness.json`

| Field | Unit on chart | n |
| --- | --- | ---: |
| `series.typical_adults_mm` | mm | 14 |
| `series.diabetic_foot_mm` | mm | 14 |
| `series.difference_um_label` | labelled `um` | 14 |

Check: site 1 typical 11.6 mm, diabetic 13.2 mm, difference plotted 16 — not 1.6 mm and not 1600 µm. Treat the line as a **separate authored series**.

## What is not in the JSON

- Individual ages for the 398 scatter points
- Province / city of measurement
- Protocol (standing height vs recumbent, calliper vs scanner)
- Ethics / consent text
- Colour palettes (those stay in the example HTML)

If you add a new measurement, add a file + an entry in `catalog.json` rather than growing `js/index.js` further.
