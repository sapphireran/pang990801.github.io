# Data notes and caveats

This page records what the samples **are**, what they **are not**, and the numbers that are easy to misread.

## Provenance

All home-dashboard arrays were already hardcoded in `js/index.js` when this docs folder was added. The JSON under `data/` is a structured copy of those arrays plus short metadata. No new subjects were measured for this documentation pass.

`draw1.js` and `draw2.js` are the same kind of personal sketch: option objects with literal series, not exports from a lab notebook.

## Sample sizes you can actually count

| Chart | What you can count | What you cannot count |
| --- | --- | --- |
| Height × shoe length | 199 girl points, 199 boy points | Age, city, left vs right, width |
| Age × foot length | 9 age categories × 2 means | n per age, SD, min/max |
| BMI × plumpness | 13 BMI buckets × 2 means | n per bucket, individual BMI |
| Symmetry pies | 13 generated frames | Real feet; the frames are a formula |
| Radar | 4 age polygons × 7 spokes | Raw cm / kg; values are 0–100 |
| Plantar pressure | 7 sites × 2 series | Anatomy of each 位点 |
| Tissue thickness | 14 sites × 2 bars + 1 line | A mm↔um derivation |

## Summaries from the scatter JSON

Computed while extracting `height-shoe-size.json`:

| Series | n | Height cm (min / mean / max) | Shoe length cm (min / mean / max) |
| --- | --- | --- | --- |
| Girls | 199 | 79.73 / 116.05 / 152.78 | 10.08 / 16.54 / 24.21 |
| Boys | 199 | 75.48 / 112.55 / 149.96 | 9.74 / 16.10 / 24.40 |

Those means are **unweighted over points**, not age-standardized. A cloud that happens to contain more mid-childhood points will pull the mean toward that band.

## Age coverage is not the same on every panel

| Panel | Ages present |
| --- | --- |
| Height × shoe | unknown (height only) |
| Foot length bars | 6–14 |
| Radar | 9–12 |
| Symmetry pies | 2–14 |
| BMI lines | no age at all |

Do not line up “age 9 on the radar” with “the 9-year bar” and call it the same cohort. Nothing in the repo says they share IDs.

## The difference line is girls minus boys

On the age × foot-length chart:

```
0.28, 0.48, 0.40, 0.33, 0.08, −0.03, −0.15, −0.33, −0.50
```

Positive means the girl mean is larger. The zero crossing sits between 10 and 11 on this sample. The second Y axis is a **value** axis without a `cm` formatter — the line is still centimeters of difference.

## Radar age-12 arithmetic

The live option includes:

```js
value: [84, 45, 55, 70, 77-6, 79-8, 79]
```

That evaluates to `[84, 45, 55, 70, 71, 71, 79]`. The JSON stores the evaluated row and a note. If you copy-paste the option, keep the expression or the numbers — do not “fix” 77 and 79 without deciding which the chart should show.

## Symmetry frames are synthetic

The pie timeline is honest as a **visual**, misleading as a **statistic**. Each age `i` (0-based) does:

```js
a = Math.round(36 - 13 * Math.log(i + 1));
b = Math.round(17 -  6 * Math.log(i + 1));
c = Math.round(11 -  4 * Math.log(i + 1));
d = Math.round(27 - 10 * Math.log(i + 1));
same = 63 + a + b + c + d;
```

As `i` grows, `a+b+c+d` shrinks, so the “双脚相同” slice becomes larger **by construction**. That is a storytelling device (“children’s left/right gap settles”), not evidence from paired measurements.

Worked frame at 2 years (`i = 0`, `ln(1) = 0`):

- a=36, b=17, c=11, d=27, same=63+91=154

Worked frame at 14 years (`i = 12`, `ln(13) ≈ 2.565`):

- a≈3, b≈2, c≈1, d≈1, same≈70

Exact rounded integers are in [`../data/foot-symmetry.json`](../data/foot-symmetry.json).

## Ring charts are independent shares

过瘦脚 / 过胖脚 rings use:

| Ring | Highlighted | Remainder | Highlight % (highlight / total) |
| --- | --- | --- | --- |
| Slim | 50 | 180 | 50/230 ≈ 21.7% |
| Wide | 435 | 2400 | 435/2835 ≈ 15.3% |

Those percentages are what `{d}` prints. They do not come from counting points on the BMI lines.

## Plantar extras

- Legend leftover: `draw1.js` lists `潍V` with no series. Ignore it.
- Thickness difference series is labeled `差值:um` while bars are mm. The numbers (16, 13, 8, …) are **not** `(diabetic − typical) * 1000`. Example: site 1 is 13.2 − 11.6 = 1.6 mm, but the line is 16. Treat the line as its own illustrative series.
- `dataZoom` on `draw2.js` opens at start 10 / end 80 (roughly sites 2–11). The example page keeps that default so it matches the original sketch.

## Honest limits (read before quoting a number)

1. **No sampling frame.** No city list, school list, year of collection, or inclusion rule lives in this repo.
2. **No identifiers.** You cannot join scatter points to BMI rows to radar scores.
3. **No uncertainty.** Means have no CI, no SD, no n.
4. **No clinical meaning.** Diabetic-foot series are personal example strokes. They are not a screening tool.
5. **No shoe prescription.** Height-to-shoe clouds do not include width, instep, or last allowance.
6. **Chinese labels vs English keys.** JSON uses English keys so example scripts stay readable; the live dashboard stays Chinese. Both describe the same personal sample.

## If you add real measurements later

- Keep raw rows in a new file, e.g. `data/raw/your-batch.csv`, and **do not** overwrite these teaching JSON files in place.
- Document n, age rule, left/right rule, and the tape stations in the same commit.
- Say whether 鞋码 is last length, Mondopoint, or a converted EU size.
- Recompute summaries in the JSON `summary` block instead of editing them by hand.
