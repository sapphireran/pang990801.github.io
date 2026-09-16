# Data dictionary

Field names, units, and where each series is used. All numbers below come from the arrays already embedded in `js/index.js`, `draw1.js`, and `draw2.js`. They are **dashboard sample series**, not a published clinical extract.

JSON copies live under [`examples/data/`](../examples/data/).

## Shared conventions

| Topic | Convention |
| --- | --- |
| Age | Integer years. Dashboard charts use 2–14 (bilateral pie), 6–14 (foot length), or 9–12 (radar). |
| Length / height | Centimetres (`cm`). |
| Shoe size | Plotted in centimetres on the scatter and labelled `鞋码`. This matches a Mondopoint-style length, not a US/EU last number. |
| BMI | Integer bins 12–24 on the plumpness chart. No raw weight/height pairs are stored for that panel. |
| Radar scores | Unitless 0–100 indices, already scaled in the source option. Do not read them as centimetres. |
| Pressure | Pascals (`Pa`) at named plantar sites. |
| Tissue thickness | Millimetres (`mm`). The overlay series is labelled `差值:um` in `draw2.js`. |

Chinese labels are kept as they appear on the live dashboard so the dictionary can be compared to the UI without translation drift.

## `height-shoe-size.json`

Scatter used by the top-left panel **男童女童身高与鞋码的关系**.

| Path | Type | Unit | Meaning |
| --- | --- | --- | --- |
| `female.points[]` / `male.points[]` | `[height, shoe]` | `cm`, `cm` | One child. X is stature, Y is shoe / foot length as plotted. |
| `female.summary` / `male.summary` | object | — | `n`, min / max / mean for both axes. Computed when the file was extracted. |

Extracted counts:

| Group | n | Height range | Height mean | Shoe range | Shoe mean |
| --- | --- | --- | --- | --- | --- |
| Female (`女性`) | 199 | 79.73–152.78 cm | 116.86 cm | 10.08–24.21 cm | 16.76 cm |
| Male (`男性`) | 199 | 75.48–149.96 cm | 111.82 cm | 9.74–24.40 cm | 15.96 cm |

Dashboard extras (not in the JSON):

- Mark area from each series min to max.
- Mark points for max / min.
- Average mark line, plus a vertical reference at **115 cm** (girls) and **110 cm** (boys).

## `age-foot-length.json`

Pictorial bars + difference line for **男童女童年龄与脚长的关系**.

| Path | Type | Unit | Meaning |
| --- | --- | --- | --- |
| `ages` | `number[]` | years | 6 through 14. |
| `femaleFootLengthCm` | `number[]` | cm | Mean girl foot length at that age. |
| `maleFootLengthCm` | `number[]` | cm | Mean boy foot length at that age. |
| `femaleMinusMaleCm` | `number[]` | cm | Girl minus boy. Positive ⇒ girls longer that year. |

Crossover in the stored series: girls are longer through age 10; the difference flips to negative at age 11 (`-0.03`) and stays negative through 14 (`-0.50`).

The left Y axis starts at 12 cm. The difference line uses a second Y axis.

## `bmi-plumpness.json`

Line + dual ring charts for **儿童BMI与脚的胖瘦度关系**.

| Path | Type | Unit | Meaning |
| --- | --- | --- | --- |
| `bmi` | `number[]` | BMI | Category axis 12–24. |
| `femalePlumpness` / `malePlumpness` | `number[]` | index | Y values in the low-to-high 20s. |
| `thinFootRing` / `wideFootRing` | object | count-like | Ring slices. Each has `value` plus a `placeholder` used only to draw the remaining arc. |

Honest label note: the axis title in `js/index.js` is `脚胖瘦度（脚长/脚宽）`, but a raw length/width ratio would sit near 2–3, not 22–30. Treat the series as **the plumpness index the dashboard already plots**. Do not convert it back to centimetres without a new measurement definition.

Ring percentages on screen are `value / (value + placeholder)`:

| Ring | value | placeholder | Display fraction |
| --- | --- | --- | --- |
| 过瘦脚占比 | 50 | 180 | 21.7% |
| 过胖脚占比 | 435 | 2400 | 15.3% |

## `bilateral-ratio.json`

Timeline pie for **儿童双脚比例**.

These are **not raw survey counts**. `js/index.js` builds each age with:

```
a = round(36 - 13 * ln(i+1))   // 左脚比右脚大 10–20%
b = round(17 -  6 * ln(i+1))   // 左脚比右脚大 20% 以上
c = round(11 -  4 * ln(i+1))   // 右脚比左脚大 20% 以上
d = round(27 - 10 * ln(i+1))   // 右脚比左脚大 10–20%
same = 63 + a + b + c + d      // 双脚相同
```

`i` is the 0-based index of ages 2–14.

| Path | Meaning |
| --- | --- |
| `ages[].age` | Label such as `2岁`. |
| `ages[].same` | Generated “same size” bucket. |
| `ages[].left10to20` / `leftOver20` | Left larger. |
| `ages[].right10to20` / `rightOver20` | Right larger. |

As `i` grows, the four asymmetric buckets shrink (log decay) and the same-size share rises. That is a visual story about symmetry increasing with age, not a claim that those exact counts were measured.

## `growth-radar.json`

Centre radar (the `.map .chart` panel). Seven axes, four ages.

| Axis (source label) | Role |
| --- | --- |
| 身高 | Stature |
| 兜跟围长 | Heel / counter girth |
| 跗骨围长 | Tarsal girth |
| 跖趾围长 | Ball / metatarsophalangeal girth |
| 鞋码 | Shoe size (scaled) |
| 脚长 | Foot length (scaled) |
| 体重 | Body mass (scaled) |

Each `series[].values` entry is a 0–100 score. Age 12 shoe and foot-length scores are written in source as `77-6` and `79-8` (both 71). The JSON stores the evaluated numbers.

## `plantar-pressure.json`

From `draw1.js` (not mounted on `index.html` today).

| Path | Unit | Meaning |
| --- | --- | --- |
| `sites` | — | 位点一 … 位点七 |
| `typicalPa` | Pa | Typical-adult pressure |
| `diabeticFootPa` | Pa | Diabetic-foot adult pressure |
| `sourceRing` | — | Decorative ring from the original option (`typicalShare` 335 vs placeholder 180) |

## `tissue-thickness.json`

From `draw2.js` (also not mounted on the live dashboard).

| Path | Unit | Meaning |
| --- | --- | --- |
| `sites` | — | 位点1 … 位点14 |
| `typicalAdultMm` | mm | Typical adult thickness |
| `diabeticFootAdultMm` | mm | Diabetic-foot adult thickness |
| `differenceUm` | labelled µm | Overlay line from the original option. Values (3–45) do **not** equal `1000 * (diabetic − typical)` in millimetres; keep the label the source used. |

## Files that are not datasets

| File | Why it is omitted |
| --- | --- |
| `js/china.js`, `js/myMap.js` | Geo fly-line demo. Commented out in `index.html`. |
| `js/macarons.js` / `macarons.json` | ECharts theme. |
| Year toggle `dataAll` in the first IIFE of `js/index.js` | `[200, 300, …]` placeholder. The scatter panel has no year `<a>` links, so the click handler never swaps real foot data. |

## Provenance

Extracted from this personal GitHub Pages repo (`pang990801.github.io`). Do not treat the JSON as anonymized subject-level research data suitable for medical decisions.
