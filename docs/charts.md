# Chart notes

How each homepage panel is built, what it actually plots, and where
the unused option files fit. Titles below are the Chinese headings
from `index.html`.

## 1. 男童女童身高与鞋码的关系

**DOM:** `.bar .chart`  
**Type:** two scatter series, ECharts `dark` theme  
**Data:** `data/height-shoe-size.json` (199 + 199 points)

X is height in cm. Y is labelled 鞋码 but formatted as `{value} cm`
in both the axis and the tooltip (`身高：…cm 鞋码：…cm`). Treat Y as
a **last length / foot-length proxy in centimetres**, not a Chinese
Mondopoint integer (those are millimetres) and not a European size.

Both series enable:

- crosshair tooltip
- `dataZoom` + rectangular / polygon brush
- save-as-image
- min / max markPoints
- average markLine
- a dedicated vertical markLine at x = 115 cm (girls) and x = 110 cm
  (boys)
- a dashed `markArea` spanning min→max of each series

OLS on the extracted points (see `generated-stats.md`):

| Group | n | Pearson r | shoe_cm ≈ | R² | RMSE |
| --- | ---: | ---: | --- | ---: | ---: |
| Female | 199 | 0.914 | `0.141 × height + 0.299` | 0.835 | 1.34 cm |
| Male | 199 | 0.916 | `0.143 × height − 0.065` | 0.838 | 1.37 cm |

The leftover 2019/2020 bar swap under this panel is **not** foot
data. Ignore it unless you restore the `<a>` year links.

## 2. 男童女童年龄与脚长的关系

**DOM:** `.line .chart`  
**Type:** pictorial 3D-style bars + difference line  
**Data:** `data/age-foot-length.json`

Ages 6–14. Each sex is a gradient bar (`barWidth = 25`) with a
diamond cap (`pictorialBar`, `symbolPosition: 'end'`). A second
y-axis draws `女生脚长 − 男生脚长` as a smooth area line.

Observed pattern in the stored means:

- Girls longer at 6–10 (gap peaks at +0.48 cm at age 7).
- Near parity at 11 (−0.03 cm).
- Boys longer at 12–14 (gap −0.50 cm at 14).
- Age 8 and 9 sit below age 7 for both series. That is a property of
  the charted means, not something this repo can explain.

## 3. Center “map” — growth radar

**DOM:** `.map .chart`  
**Type:** polar radar, no `dark` theme  
**Data:** `data/growth-radar.json`

Seven indicators, each maxed at 100. Four series (9 / 10 / 11 / 12
years) with linear-gradient area fills. Values are **dashboard
indices**. They are not centimetres.

The 12-year script writes shoe last as `77-6` and foot length as
`79-8` (JavaScript subtraction). The archive stores the evaluated
results **71** and **71**.

`js/china.js` and `js/myMap.js` are a leftover geographic layer for
this same DOM node. They stay commented out in `index.html`.

## 4. 儿童BMI与脚的胖瘦度关系

**DOM:** `.bar1 .chart`  
**Type:** two smooth area lines + two ring pies  
**Data:** `data/bmi-foot-ratio.json`

X is BMI 12–24. Y is 脚胖瘦度, documented on the axis as
`脚长/脚宽`. The axis minimum is 20. Both lines generally rise with
BMI in this series (slimmer/longer relative ratio as BMI increases),
which is worth treating as a charting choice rather than a clinical
claim.

The rings on the right are labelled 过瘦脚占比 and 过胖脚占比:

| Ring | Highlighted | Remainder | Share |
| --- | ---: | ---: | ---: |
| Thin | 50 | 180 | 21.7% |
| Plump | 435 | 2400 | 15.3% |

The leftover slice name in the script is still `用户来源分析`
(copied from an ECharts gallery demo).

## 5. 儿童双脚比例

**DOM:** `.line1 .chart`  
**Type:** timeline pie, 2-second autoplay  
**Data:** `data/bilateral-symmetry.json`

`js/index.js` does **not** load a table. It loops ages 2–14 and
builds five slices from:

```
a = round(36 - 13 * log(i+1))   // left 10–20% larger
b = round(17 -  6 * log(i+1))   // left >20% larger
c = round(11 -  4 * log(i+1))   // right >20% larger
d = round(27 - 10 * log(i+1))   // right 10–20% larger
same = 63 + a + b + c + d
```

`i` is the 0-based index. As `i` grows, a–d shrink and “双脚相同”
dominates. Read this panel as a **motion graphic**, not a
prevalence study.

## Unused: 足部压力数据图 (`draw1.js`)

Line + ring option for seven plantar sites. Two series (正常人群,
糖尿病足人群) in Pa. Legend also lists `潍V` with no series. The
example `examples/plantar-pressure.html` is the first page that
actually calls `setOption` on this object.

## Unused: 足底皮下组织厚度 (`draw2.js`)

Stacked-looking bars (they are **not** stacked; only the normal
series sets `"stack": "总量"`) plus a difference line labelled
`差值:um` while bars are millimetres. Fourteen sites. Mounted by
`examples/tissue-thickness.html`.

The um series is the same length as the bars but is **not** exactly
`(diabetic_mm - normal_mm) * 1000` or `* 10`. Do not derive one
column from the other.

## Interaction leftovers

| Control | Intended | Actual |
| --- | --- | --- |
| Header clock | Live datetime | Works |
| Nav links | Sibling Pages + mailto | Works |
| Scatter toolbox | Zoom / brush / save | Works |
| Year `<a>` on scatter title | Swap 2019/2020 bars | No anchors in HTML |
| `click.js` tabs | Panel switching | Markup removed |
| Radar legend | Toggle ages | Works |
| Bilateral timeline | Autoplay pies | Works |
