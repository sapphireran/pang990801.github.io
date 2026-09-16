# Notes on reading the pictures

This is a **personal visualisation notebook**, not a methods paper. The points below exist so a future self (or anyone forking the Pages site) does not over-interpret the ECharts chrome.

## What the dashboard is for

The live title is 中国人群脚型数据可视化, with a nav split across:

- 首页 — `scuscientia.github.io`
- 儿童脚型 — this repo
- 畸形足或病足 — `ytep-zhi.github.io`
- mail contact

So this page is the **children’s** panel of a small multi-site story. Adult / pathologic sketches (`draw1.js`, `draw2.js`) belong to the neighbouring motif and were left as loose gallery options.

## Measurement names (as used on the charts)

| Chinese on chart | How this repo treats it |
| --- | --- |
| 身高 | standing height, cm |
| 鞋码 | plotted in cm → foot length proxy, **not** Mondopoint / EU size |
| 脚长 | foot length, cm |
| 脚胖瘦度（脚长/脚宽） | scaled length/width index |
| 兜跟围长 | heel (counter) girth, radar index only |
| 跗骨围长 | tarsal girth, radar index only |
| 跖趾围长 | metatarsophalangeal girth, radar index only |
| 双脚相同 / 左脚比右脚大… | size-class labels on a synthetic pie |

Girth radar axes are **unitless 0–100**. Do not caption them as millimetres unless you replace the data.

## Statistical grain

Three grains are mixed on one screen:

1. **Micro** — 398 unsorted scatter points (child-level, two variables only).
2. **Meso** — means by age or BMI bin (one number per sex per bin; no n, no IQR on the chart).
3. **Cartoon** — log-generated pie slices; radar polygons; ring-chart counts.

A sentence that starts from the scatter (“r ≈ 0.91”) is on firmer ground than a sentence that starts from the pie (“symmetry increases with age”), because the pie is a formula.

## Correlation vs causation

Height and foot length grow together. That does not mean a height-only formula should set shoe size: residual sd of shoe/foot length is still ~3 cm in each sex, which is several children’s sizes.

The BMI chart suggests plumpness index rises with BMI bins, but:

- bins are integers with no occupancy counts
- y is a scaled ratio, so a 1-point move is not “1 cm of width”
- the ring percentages are independent decorations

## Age 8–9 dip

Both sex means drop from age 8 to 9 in `age-foot-length.json`. Real paediatric series are almost monotone in that window. Prefer: “the uploaded means include a dip; inspect n before quoting a growth curve.” The example page draws the dip faithfully and captions it.

## Left–right story

The pie’s “same size” share at age 2 is `154/245 ≈ 63%` wait — `same / total = 154/245 ≈ 63%` actually `same` already contains `63 + a+b+c+d` so the same-size share is `154/245 ≈ 62.9%` at age 2 and climbs as `a…d` decay. That is a **designed** story (feet become more even), implemented with `Math.log`, not a chi-square on paired measurements.

If you ever replace it with real paired lengths, store `left_mm` / `right_mm` and compute `|L−R| / mean(L,R)` yourself. Do not keep the log generator.

## Colour

Dashboard scatter: girls `#ff4f3b`, boys `#ffe01f` on a translucent navy panel. Examples reuse those hex values so a screenshot of the gallery still matches the board.

Do not rely on colour alone in new charts — the radar already uses four hues plus filled polygons, and the BMI chart uses pink vs cyan plus two extra pies.

## Reproducing a chart

1. Read the JSON for that chart (not `js/index.js`) so you are not fighting `markArea` boilerplate.
2. Open the matching `examples/*.html`.
3. Diff `option.series[*].data` against the JSON.

If the example and the dashboard diverge, the JSON + example are the **documented** series; fix `js/index.js` only when you intend to change the live board.

## What would be needed for a real methods write-up

Not present in this repo, and not invented here:

- sampling frame (schools, clinics, years)
- inclusion ages and exclusion (injury, congenital conditions — those are a different site)
- instrument (caliper, scanner, last stick)
- inter-observer error
- ethics approval identifier

Until those exist, captions should say **illustrative sample**, not “Chinese children” as a census claim.
