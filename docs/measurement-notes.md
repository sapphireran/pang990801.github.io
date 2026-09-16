# Measurement notes

What the dashboard is trying to show, and where the numbers should not be over-read. This is a personal visualization notebook, not a methods paper.

## Why these views exist

Children’s feet grow on a different schedule from stature. Last makers care about **length**, **girths**, and **left/right mismatch**, not only shoe size printed on a box. The five live panels are five cuts through that idea:

1. **Height vs shoe size** — does a taller child automatically need a longer last?
2. **Age vs mean foot length** — when do boys overtake girls in the stored series?
3. **Multi-axis growth** — length, three girths, shoe size, height, and mass moving together from 9 to 12.
4. **BMI vs plumpness index** — body mass vs how “wide” the foot looks on the chart.
5. **Left/right share over age** — how often the two feet are treated as the same size.

`draw1.js` and `draw2.js` are a second story: adult plantar **pressure** and **soft-tissue thickness**, typical vs diabetic-foot groups. They are not on the children’s dashboard.

## Units that look like shoe sizes

The scatter Y axis is labelled `鞋码` and formatted as `{value} cm`. In last design that usually means **foot length used as size** (Mondopoint is millimetres of foot length; dividing by 10 yields centimetres). It is not a US, UK, or EU size scale.

If you re-plot this series against a retail size chart you must convert through foot length first.

## Plumpness index

The BMI panel Y title is `脚胖瘦度（脚长/脚宽）`. A true length/width ratio for a child’s foot is typically a little above 2. The stored Y values are 22–30.

Until a measurement protocol is written down, the safe reading is:

> Higher Y = “fatter / wider” foot **on this dashboard**, at that BMI bin.

Do not invert the series into centimetres of width.

A common last-making width index is `100 × ball girth / foot length` or `100 × width / length`. Those *would* land in the 20s–40s. The source comment does not confirm which formula was used.

## Radar scores are already normalized

The centre radar axis max is 100 for every spoke. Age-9 height is 43, age-12 height is 84. Those are **relative scores in the original option**, not 43 cm or 84 cm.

Comparing a radar spoke to the scatter’s raw centimetres is a category error.

Age 12 shoe and foot-length scores are authored as `77-6` and `79-8`. That is just `71` and `71`. The examples JSON stores the evaluated values and mentions the source expression so a later edit does not “fix” a number that was intentional.

## Bilateral pie is a formula

See [`data-dictionary.md`](data-dictionary.md) for the exact `Math.log` terms. The timeline is a **parametric illustration**: asymmetric buckets shrink as age index grows. It should not be cited as an observed prevalence.

If you later replace it with real counts, keep the five labels (`双脚相同`, two left-larger bins, two right-larger bins) so the example page and the dashboard stay aligned.

## Pressure and thickness sites

`draw1.js` names seven sites (`位点一` … `位点七`) without a foot map. `draw2.js` names fourteen. There is no shared site index between the two files.

Typical vs diabetic-foot overlays are **adult** series. Mixing them onto the children’s radar or scatter would invent a comparison the source never made.

The thickness difference line is labelled `差值:um` but is not `1000 × (mm_diabetic − mm_typical)`. Document it as an overlay series with that label, not as a derived SI conversion.

## Dead or decorative numbers

| Location | What it is |
| --- | --- |
| Scatter `dataAll` 2019/2020 | Unrelated integers. Not foot data. |
| BMI ring `placeholder` | Geometry only. Changes the displayed percent. |
| `draw1.js` legend entry `潍V` | Unused third colour in the legend; no series. |
| Clock text in `index.html` | Static placeholder until `time()` runs. |

## Suggested reading order for the examples

1. [`examples/height-shoe-size.html`](../examples/height-shoe-size.html) — raw points + regression.
2. [`examples/age-foot-length.html`](../examples/age-foot-length.html) — means and the girl−boy sign flip.
3. [`examples/growth-radar.html`](../examples/growth-radar.html) — normalized multi-metric view.
4. [`examples/bmi-plumpness.html`](../examples/bmi-plumpness.html) — index vs BMI, with the label caveat.
5. [`examples/bilateral-ratio.html`](../examples/bilateral-ratio.html) — generated shares, formula shown.
6. [`examples/plantar-pressure.html`](../examples/plantar-pressure.html) / [`tissue-thickness.html`](../examples/tissue-thickness.html) — adult site studies.

## What not to do with these files

- Do not diagnose a child or size a medical insole from the sample arrays.
- Do not merge the children’s scatter with the adult pressure file on one axis without a new study design.
- Do not “correct” plumpness or difference-µm values to match SI algebra unless you are replacing the source definition on purpose.
