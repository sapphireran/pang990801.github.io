# Chart catalog

This page is a field guide to every visualization in the repository: the five homepage panels plus the two draft option files.

## 1. Height × shoe size scatter

- **DOM**: `.panel.bar .chart`
- **Type**: two scatter series (`女性`, `男性`)
- **File**: `js/index.js` (first IIFE), JSON in `examples/data/height-shoe-*.json`
- **Axes**: height (cm) × shoe length (cm), both value scales
- **Extras**: dashed min/max boxes, max/min mark points, average mark lines, a vertical reference at 115 cm (girls) and 110 cm (boys)

Each point is one child. Symbol size is 4 so ~400 points stay readable on the dark field. Tooltip prints both coordinates. Brush and dataZoom sit in the toolbox; they are the reason this panel is taller than the Less draft.

The leftover click handler on `.bar h2 a` swaps in a 2019/2020 bar series that the current heading no longer exposes. Example page drops that handler.

## 2. Age × foot length

- **DOM**: `.panel.line .chart`
- **Type**: paired pictorial bars + a gap line on a second y-axis
- **File**: `js/index.js`, JSON in `examples/data/age-foot-length.json`
- **X**: integer ages 6–14
- **Y left**: foot length (cm), floor 12
- **Y right**: girls minus boys (cm)

The diamond caps (`pictorialBar` at `symbolPosition: "end"`) are decoration. The useful series are the two bars and the cyan gap line. The gap is positive while girls' mean length is larger, then crosses zero around age 11.

## 3. Growth radar

- **DOM**: `.map .chart` (name is historical)
- **Type**: polar radar, four age overlays
- **File**: `js/index.js` (last IIFE), JSON in `examples/data/growth-radar.json`
- **Indicators**: 身高, 兜跟围长, 跗骨围长, 跖趾围长, 鞋码, 脚长, 体重
- **Scale**: 0–100 relative scores, not millimetres

Ages 9–12 each get a translucent wash. The 12-year shoe and foot-length scores in the original file were written as `77-6` and `79-8`; the JSON stores the evaluated values 71 and 71.

## 4. BMI × foot shape

- **DOM**: `.panel.bar1 .chart`
- **Type**: two smooth area lines + two decorative donuts
- **File**: `js/index.js`, JSON in `examples/data/bmi-foot-shape.json`
- **X**: BMI 12–24
- **Y**: labeled 脚长/脚宽; values sit in the mid-20s

The donuts on the right are labeled “过瘦脚占比” and “过胖脚占比”. Their slices are hardcoded placeholders (`50/180` and `435/2400`), not a derived cut of the line series. Treat them as layout furniture unless you replace the values.

## 5. Left / right timeline pie

- **DOM**: `.panel.line1 .chart`
- **Type**: ECharts `timeline` + pie
- **File**: `js/index.js`, JSON in `examples/data/foot-symmetry.json`
- **Playhead**: ages 2–14, 2 s per step, autoplay

Categories:

| Slice | Meaning on the original label |
| --- | --- |
| 双脚相同 | treated as the same size |
| 左脚比右脚大 10–20% | left larger, moderate |
| 左脚比右脚大 20% 以上 | left larger, strong |
| 右脚比左脚大 20% 以上 | right larger, strong |
| 右脚比左脚大 10–20% | right larger, moderate |

The percentages are **not** a survey crosstab. They come from a log-decay illustration:

```
a = round(36 - 13 * ln(i+1))
b = round(17 -  6 * ln(i+1))
c = round(11 -  4 * ln(i+1))
d = round(27 - 10 * ln(i+1))
same = 63 + a + b + c + d
```

where `i` is the age index starting at 0 for “2岁”. The example page documents the formula next to the chart.

## 6. Plantar pressure (draft)

- **File**: `draw1.js`
- **Type**: two smooth lines + one donut
- **X**: 位点一 … 位点七
- **Unit**: Pascal (title only; no calibration notes)
- **Series**: 正常人群, 糖尿病足人群

This option was copied from an ECharts gallery composition (line + side pie). The pie does not encode the line series; it is a “source share” decoration. The example page keeps both so the draft stays recognizable, and the JSON spells out which numbers are traces vs. furniture.

## 7. Plantar tissue thickness (draft)

- **File**: `draw2.js`
- **Type**: grouped bars + difference line + dataZoom
- **X**: 位点1 … 位点14
- **Bars**: adult normal mm, adult diabetic-foot mm
- **Line**: labeled `差值:um` with values in the 3–45 range

The line unit in the legend says micrometres while the bars are millimetres. The example page repeats that warning. Do not subtract the two bar series and expect the line; the stored difference is its own array.

## Shared interaction habits

- Hover tooltip on every numeric series
- `saveAsImage` in the scatter toolbox
- Window `resize` → `chart.resize()`
- Dark theme on homepage panels; examples use an explicit dark `backgroundColor` so they look right without the macarons/dark theme file

## Adding an eighth chart

1. Put a JSON file in `examples/data/`.
2. Add a row to `examples/index.html`.
3. Copy an existing example HTML/JS pair.
4. Write a short card in this catalog and a field in `data-dictionary.md`.
5. Only then, if the chart belongs on the cockpit, add a `.panel` and a new IIFE in `js/index.js`.
