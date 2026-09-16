# Chart catalogue

Every visualisation that ships in this repo, including sketches that the dashboard does not load.

## 1. Height × shoe size (scatter)

- **Dashboard title:** 男童女童身高与鞋码的关系
- **DOM:** `.bar .chart`
- **Type:** two scatter series (`女性`, `男性`), `symbolSize: 4`
- **Data:** `examples/data/height-shoe.json` (199 × 2 points)
- **Example:** [`examples/height-shoe-scatter.html`](../examples/height-shoe-scatter.html)

Axes are both `type: 'value'` with `{value} cm`. Tooltip: `身高：{x}cm` / `鞋码：{y}cm`. Each series has `markPoint` min/max, `markLine` average plus a vertical reference (`xAxis: 115` girls, `110` boys), and a dashed `markArea` spanning the series min/max box.

**Read as:** taller children have longer feet. Pearson *r* is 0.9135 (girls) and 0.9156 (boys). The cloud is wide at a given height — shoe size is not a deterministic function of stature.

## 2. Age × foot length (pictorial bars + line)

- **Dashboard title:** 男童女童年龄与脚长的关系
- **DOM:** `.line .chart`
- **Type:** paired gradient bars with diamond caps (`pictorialBar`) and a difference line on a second y-axis
- **Data:** `examples/data/age-foot-length.json`
- **Example:** [`examples/age-foot-length.html`](../examples/age-foot-length.html)

Categories: ages **6 through 14**. Girl means start ~0.3 cm above boys and fall behind after age 11 (difference series crosses zero).

There is a small **dip at ages 8–9** in both sexes (21.01 → 20.34 cm girls). That is in the original arrays; it is probably sampling noise, not a biological shrink. Do not smooth it away in docs without saying so.

## 3. BMI × plumpness (lines + rings)

- **Dashboard title:** 儿童BMI与脚的胖瘦度关系
- **DOM:** `.bar1 .chart`
- **Type:** two smooth area-lines plus two donut pies on the right
- **Data:** `examples/data/bmi-foot-ratio.json`
- **Example:** [`examples/bmi-foot-ratio.html`](../examples/bmi-foot-ratio.html)

X: integer BMI 12–24. Y: labelled 脚长/脚宽, minimum 20. Values sit in the mid-20s, so they are almost certainly a **scaled** length/width index, not a raw ratio (a raw ratio of ~1.4 would not be plotted at 25).

Ring charts:

| Ring | Highlighted | Remainder | Label |
| --- | ---: | ---: | --- |
| upper | 50 | 180 | 过瘦脚占比 |
| lower | 435 | 2400 | 过胖脚占比 |

Percentages displayed are `highlighted / (highlighted + remainder)`. These counts are **not** derived from the line series in code.

## 4. Left / right mix (timeline pie)

- **Dashboard title:** 儿童双脚比例
- **DOM:** `.line1 .chart`
- **Type:** ECharts `timeline` + pie, `autoPlay: true`, 2 s interval
- **Data:** `examples/data/bilateral-symmetry.json` (materialised from the formula)
- **Example:** [`examples/bilateral-symmetry.html`](../examples/bilateral-symmetry.html)

Generator in `js/index.js` (age index `i` from 0 = 2 years):

```
a = round(36 − 13 ln(i+1))   // left 10–20% larger
b = round(17 − 6 ln(i+1))    // left >20% larger
c = round(11 − 4 ln(i+1))    // right >20% larger
d = round(27 − 10 ln(i+1))   // right 10–20% larger
same = 63 + a + b + c + d
```

As age increases, the “same size” slice grows because `a…d` shrink with `ln`. This is a **cartoon of increasing symmetry**, not a survey table.

## 5. Growth radar (centre panel)

- **Dashboard:** no `h2`; sits in `.map`
- **DOM:** `.map .chart`
- **Type:** polar radar, circle shape, four series
- **Data:** `examples/data/growth-radar.json`
- **Example:** [`examples/growth-radar.html`](../examples/growth-radar.html)

Indicators (each max 100): 身高, 兜跟围长, 跗骨围长, 跖趾围长, 鞋码, 脚长, 体重.

| Age | Vector |
| --- | --- |
| 9 | 43, 29, 37, 37, 38, 31, 41 |
| 10 | 53, 32, 42, 46, 43, 42, 49 |
| 11 | 66, 37, 47, 60, 57, 59, 65 |
| 12 | 84, 45, 55, 70, 71, 71, 79 |

Age 12 shoe size / foot length are `77-6` and `79-8` in source (both 71). Indices are **relative dashboard units**, not centimetres.

## 6. Plantar pressure (sketch)

- **File:** `draw1.js`
- **Dashboard:** not referenced
- **Example:** [`examples/plantar-pressure.html`](../examples/plantar-pressure.html)
- **Data:** `examples/data/plantar-pressure.json`

Seven named sites, two lines (typical vs diabetic-foot adults) plus a decorative pie. Units labelled Pa.

## 7. Subcutaneous thickness (sketch)

- **File:** `draw2.js`
- **Dashboard:** not referenced
- **Example:** [`examples/tissue-thickness.html`](../examples/tissue-thickness.html)
- **Data:** `examples/data/subcutaneous-thickness.json`

Fourteen sites (`位点1` … `位点14`), grouped bars + a “difference” line labelled `um`. The difference series is **not** `(diabetic − typical) × 1000`.

## Intentionally unused

- `js/china.js` + `js/myMap.js`: national geo with animated origin–destination lines. Centre column used to be a map; radar replaced it.
- Year toggle in the first IIFE (`.bar h2 a` click → `dataAll` 2019/2020 arrays): the heading has no `<a>` tags, so the handler never fires. Those yearly arrays are unrelated to foot length.
