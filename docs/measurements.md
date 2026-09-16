# Measurement glossary

The dashboard mixes everyday words (身高, 鞋码, 体重) with last-making girth names (兜跟围长, 跗骨围长, 跖趾围长). This page is the personal glossary for those labels. Values on the **radar** are normalized 0–100 scores, not raw tape measurements.

## Body measures

| Label | Pinyin / English | What it means here | Typical unit on this site |
| --- | --- | --- | --- |
| 身高 | shēngāo / stature | Standing height used as the scatter X axis and as one radar spoke | cm on the scatter; 0–100 on the radar |
| 体重 | tǐzhòng / body mass | Radar spoke only | 0–100 score |
| BMI | body mass index | Category axis on the plumpness chart | integer `kg/m²` buckets 12–24 |
| 年龄 | niánlíng / age | Completed years | 2–14 on the pie timeline; 6–14 on the bar chart; 9–12 on the radar |

BMI on this page is a **bucket label**, not a continuously computed `weight / height²` from the scatter points. The scatter and the BMI chart are separate samples that happen to share a childhood theme.

## Foot length and shoe size

| Label | What it means here | Unit |
| --- | --- | --- |
| 脚长 | Heel-to-longest-toe length used on the age bars and as a radar spoke | cm on the bars; 0–100 on the radar |
| 鞋码 | Shoe-related length on the scatter Y axis and as a radar spoke | cm on the scatter tooltip (`鞋码：… cm`); 0–100 on the radar |

Two important caveats:

1. **Chinese children’s shoe sizes are usually last length in millimeters** (often 5 mm or 10 mm grades), sometimes shown as a EU/US conversion. This dashboard’s scatter tooltip prints **centimeters**. Read 鞋码 on the scatter as “shoe-length sample in cm,” not as a shop tag like “32码.”
2. **脚长 and 鞋码 are not interchangeable.** Last length includes allowance (放余). A child with 21.0 cm foot length does not automatically wear a 21.0 cm last. The radar treats them as two different spokes for that reason.

## Girths (围长)

Girth is a tape around the foot at a named station. These three names appear only on the center radar.

| Label | English-ish last term | Station (plain language) |
| --- | --- | --- |
| 兜跟围长 | heel / seat girth | Tape around the heel seat and instep throat — the “cup” that holds the rearfoot |
| 跗骨围长 | tarsal / instep girth | Tape over the tarsus (midfoot / instep), where the last’s waist sits |
| 跖趾围长 | ball / MTP girth | Tape around the metatarsophalangeal joints — the ball of the foot, where width is usually judged |

On a physical last these are often written as **heel girth**, **instep girth**, and **ball girth**. The radar does **not** plot millimeters; it plots the same 0–100 scale as height and weight so the four age polygons can be compared by shape.

## Plumpness (脚胖瘦度)

The right-hand line chart titles the Y axis:

> 脚胖瘦度（脚长/脚宽）

So the series is a **length-to-width style index**. Larger numbers on this sample sit with higher BMI buckets more often, which is a chart composition choice — do not invert it into “higher BMI always means a wider foot.” Width itself is never plotted as a raw millimeter series on the live page.

The two rings next to that chart are labeled:

- **过瘦脚占比** — share called out as “too slim”
- **过胖脚占比** — share called out as “too wide / plump”

Each ring is a highlighted slice plus a remainder placeholder (`占位`), copied from the original option object. They are illustrative shares, not a second computation of the line series.

## Left / right symmetry (双脚比例)

The pie timeline uses five buckets:

| Bucket | Meaning |
| --- | --- |
| 双脚相同 | Left and right land in the same band |
| 左脚比右脚大 10–20% | Left larger by about 10–20% |
| 左脚比右脚大 20% 以上 | Left larger by more than 20% |
| 右脚比左脚大 20% 以上 | Right larger by more than 20% |
| 右脚比左脚大 10–20% | Right larger by about 10–20% |

The live chart **does not load a table of measured pairs**. It builds each age frame with a decaying `Math.log` recipe (see [`data-notes.md`](data-notes.md)). Use it as a motion graphic about “same-size share rising with age,” not as a prevalence study.

## Plantar examples (`draw1.js` / `draw2.js`)

These two files were never mounted on `index.html`. They are personal extras:

| Sketch | Measure | Unit on the original option |
| --- | --- | --- |
| 足部压力数据图 | Pressure at named plantar sites | Pa |
| 足底各位点皮下组织厚度 | Soft-tissue thickness at named sites | mm (bars), `um` (difference line, as labeled) |

Site names are just 位点一 … 位点十四. There is no anatomical map in the repo. Do not assign “site 3 = second metatarsal head” unless you add that legend yourself.

## Reading order for a newcomer

1. Scatter: height vs shoe length, girls vs boys.
2. Bars: age vs mean foot length, then the difference line.
3. Radar: which spokes grow fastest from 9 to 12.
4. BMI lines: plumpness index vs BMI bucket.
5. Pie timeline: same-size share vs asymmetric buckets.
6. Only then open the plantar example pages — they are a different personal sketch, not a sixth panel of the children’s dashboard.
