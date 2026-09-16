# Chart guide

Every panel on the live dashboard is an ECharts instance created in `js/index.js`. This page walks each one: DOM hook, chart type, series, and how to read it. Standalone copies live under [`../examples/`](../examples/) and load JSON from [`../data/`](../data/).

## 1. 男童女童身高与鞋码的关系

| | |
| --- | --- |
| DOM | `.bar .chart` |
| Type | Two `scatter` series (`女性`, `男性`) |
| Data | [`../data/height-shoe-size.json`](../data/height-shoe-size.json) — 199 + 199 points |
| Theme | `dark`, translucent blue panel `rgba(27,116,163,0.3)` |

**How to read it.** X is height (cm), Y is shoe length (cm). Red points are girls, yellow points are boys. Each series draws a dashed bounding box (min→max on both axes), min/max mark points, an average mark line, and a vertical reference (115 cm for girls, 110 cm for boys).

The tooltip formatter assumes `params.value` is a two-number point and prints `身高` / `鞋码` in centimeters. Brush and dataZoom sit in the toolbox; they are the reason this panel feels like an explorer, not a static poster.

**What it is good for.** Seeing that shoe length rises with height, and that the two clouds overlap heavily — sex is not a clean separator at childhood heights.

**What it is not.** A sizing chart. There is no last allowance, no width fitting, and no age on the point.

Leftover hook: `$(".bar h2 ").on("click", "a", …)` still swaps `series[0].data` from a 2019/2020 dummy array. The live heading has no `<a>` tags, so that path never runs. The example page drops the hook on purpose.

## 2. 男童女童年龄与脚长的关系

| | |
| --- | --- |
| DOM | `.line .chart` |
| Type | Two gradient `bar` series, two `pictorialBar` diamond caps, one `line` on a second Y axis |
| Data | [`../data/age-foot-length.json`](../data/age-foot-length.json) |
| Theme | `dark`, `rgba(33,64,112,0.3)` |

**How to read it.** Category axis is age 6–14. Cyan bars are mean girl foot length (cm); blue bars are mean boy foot length. Diamonds sit on the bar tops (`symbolPosition: 'end'`). The cyan line is **girls minus boys**, not a third length series.

The difference starts slightly positive (girls a few millimeters ahead on average), shrinks through age 10, and turns negative from age 11. That crossing is the point of the dual-axis design.

**What it is good for.** Showing that “who has the longer middle foot at a given age” is not a single answer for the whole childhood span.

**What it is not.** A growth-percentile chart. There are no error bars, no sample sizes per age, and no longitudinal IDs.

## 3. Center radar — ages 9–12

| | |
| --- | --- |
| DOM | `.map .chart` |
| Type | Single `radar` series, four named polygons |
| Data | [`../data/age-radar.json`](../data/age-radar.json) |
| Theme | default instance (no `'dark'` string), custom split lines |

The file is still named `.map` because an earlier version used `js/myMap.js` (China geo + flying lines). `index.html` comments that script out. The radar reused the map column.

**Spokes (clockwise from the top, `startAngle: 90`):** 身高, 兜跟围长, 跗骨围长, 跖趾围长, 鞋码, 脚长, 体重. Each indicator `max` is 100. Shape is a circle with three split rings.

**How to read it.** Age 9 is the smallest polygon; age 12 is the largest. The interesting part is **uneven growth**: some spokes jump more than others between 10→11 and 11→12. The live option writes the age-12 shoe and foot spokes as `77-6` and `79-8` (JavaScript arithmetic → 71 and 71). The JSON stores the evaluated numbers and mentions the original expression.

**What it is good for.** A single-glance “does the whole foot-and-body profile inflate together?” comparison.

**What it is not.** A map, and not raw centimeters. `js/china.js` / `js/myMap.js` remain in the repo as unused personal experiments.

## 4. 儿童BMI与脚的胖瘦度关系

| | |
| --- | --- |
| DOM | `.bar1 .chart` |
| Type | Two smooth `line` + `areaStyle` series, plus two center-label `pie` rings |
| Data | [`../data/bmi-foot-ratio.json`](../data/bmi-foot-ratio.json) |
| Theme | `dark`, `rgba(33,64,112,0.3)` |

**How to read it.** X is BMI buckets 12–24. Y is the plumpness index (脚长/脚宽), minimum 20. Pink is girls, cyan is boys. The grid is shoved left (`right: '35%'`) so two rings can sit at `83%` / `33%` and `83%` / `72%`.

The rings are **not** computed from the line points. They are independent `{value, name}` slices with a remainder `占位` slice, labeled 过瘦脚占比 and 过胖脚占比.

**What it is good for.** Seeing that both sex series trend upward across the BMI axis on this sample, with boys more jagged.

**What it is not.** A regression of width on BMI. There is no scatter of individuals on this panel.

## 5. 儿童双脚比例

| | |
| --- | --- |
| DOM | `.line1 .chart` |
| Type | Timeline `pie` (`baseOption` + `options[]`) |
| Data | [`../data/foot-symmetry.json`](../data/foot-symmetry.json) |
| Theme | `dark`, `rgba(49,32,112,0.3)` |

**How to read it.** The timeline plays ages 2–14 every 2 seconds (`autoPlay`, `playInterval: '2000'`). Each frame is a doughnut (`36%–58%` radius) with five named buckets. The “same both feet” slice dominates and grows as the log terms decay.

Construction (from the live IIFE):

```text
i = 0 … 12   (age = i + 2)
a = round(36 − 13 ln(i+1))   left 10–20% larger
b = round(17 − 6  ln(i+1))   left >20% larger
c = round(11 − 4  ln(i+1))   right >20% larger
d = round(27 − 10 ln(i+1))   right 10–20% larger
same = 63 + a + b + c + d
```

**What it is good for.** A looping explanation that asymmetry buckets shrink as the log terms fall.

**What it is not.** Observed pair counts. If you need real left/right pairs, replace `pieData` and the JSON together.

## 6–7. Personal extras (not on the home dashboard)

| Example | Source file | Chart |
| --- | --- | --- |
| [Plantar pressure](../examples/plantar-pressure.html) | `draw1.js` | Dual line + one ring, seven sites, Pa |
| [Tissue thickness](../examples/tissue-thickness.html) | `draw2.js` | Dual bar + difference line, fourteen sites, dataZoom |

`draw1.js` still mentions a leftover legend item `潍V` that has no series. The example page drops that ghost name.

## Color habits on the dashboard

| Role | Typical color |
| --- | --- |
| Girls / “女性” | `#ff4f3b` scatter, pink `#FF69B4` plumpness, cyan gradient bars for girl length |
| Boys / “男性” | `#ffe01f` scatter, `#3deaff` plumpness, blue gradient bars for boy length |
| Age 9–12 radar | `#00c2ff`, `#f9cf67`, `#32CD32`, `#e92b77` |
| Symmetry slices | `#56c979`, `#5CAFF2`, `#B6A2DF`, `#a96ec9`, `#2DC7C9` |

Panel chrome (corner ticks, `#02a6b5` borders, `images/line(1).png` hatch) is CSS, not ECharts.

## Shared runtime behavior

Every IIFE in `js/index.js` ends with:

```js
window.addEventListener("resize", function () {
  myChart.resize();
});
```

`js/flexible.js` rem-scales the page from viewport width. Below 1024px the CSS forces `html { font-size: 42px }`. The layout’s `min-width: 1024px` means the home dashboard is a **wide desktop** composition. Example pages use ordinary CSS grid so they stay readable on a narrower window.
