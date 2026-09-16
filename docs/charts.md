# Chart catalog

How the live dashboard is wired, plus the two standalone option files that never made it onto `index.html`.

## Page structure

`index.html` is a three-column ECharts board:

```
header (title + clock)
nav (首页 / 儿童脚型 / 畸形足或病足 / 联系我们)
.mainbox
  .column
    .panel.bar     男童女童身高与鞋码的关系
    .panel.line    男童女童年龄与脚长的关系
  .column
    .map           seven-axis growth radar
  .column
    .panel.bar1    儿童BMI与脚的胖瘦度关系
    .panel.line1   儿童双脚比例
```

Each panel owns a `.chart` div. `js/index.js` wraps every chart in an IIFE, calls `echarts.init(document.querySelector(…))`, and binds `window.resize` → `chart.resize()`.

Scripts loaded by the dashboard, in order:

1. `js/macarons.js` (head)
2. `js/flexible.js` — rem scaling from viewport width
3. `js/jquery.js`
4. `js/echarts.js` **and** `js/echarts.min.js` (both)
5. `js/index.js`
6. `js/click.js`

`js/china.js` and `js/myMap.js` are commented out. `draw1.js` and `draw2.js` sit at the repo root and are not referenced.

## Panel → selector → type

| Dashboard title | CSS hook | ECharts types | Data file |
| --- | --- | --- | --- |
| 男童女童身高与鞋码的关系 | `.bar .chart` | `scatter` + markArea / markPoint / markLine | `examples/data/height-shoe-size.json` |
| 男童女童年龄与脚长的关系 | `.line .chart` | `bar` + `pictorialBar` + `line` | `examples/data/age-foot-length.json` |
| (centre) growth profile | `.map .chart` | `radar` | `examples/data/growth-radar.json` |
| 儿童BMI与脚的胖瘦度关系 | `.bar1 .chart` | `line` + two `pie` rings | `examples/data/bmi-plumpness.json` |
| 儿童双脚比例 | `.line1 .chart` | timeline `pie` | `examples/data/bilateral-ratio.json` |
| 足部压力数据图 | not mounted | `line` + `pie` | `examples/data/plantar-pressure.json` |
| 足底各位点皮下组织厚度数据图 | not mounted | stacked `bar` + `line` + `dataZoom` | `examples/data/tissue-thickness.json` |

Class names (`bar`, `line`, `bar1`, `line1`) no longer match the rendered geometry. When you add a panel, key off the **selector string in `js/index.js`**, not the English class name.

## Chart notes

### Height × shoe size scatter

- Theme: `dark`.
- Two series, 199 points each, symbol size 4.
- Tooltip prints `身高` and `鞋码` in cm. The formatter also has a one-dimensional branch (`params.value` not an array) that the current series never hits.
- Toolbox exposes dataZoom, brush (`rect` / `polygon` / `clear`), and save-as-image.
- The IIFE still defines `dataAll` for 2019/2020 and a `$(".bar h2").on("click", "a", …)` handler. The heading has no `<a>` children, so that path is dead.

### Age × foot length

- Gradient cylinder bars: a `bar` plus a `pictorialBar` diamond cap per sex.
- Girl series uses a cyan vertical gradient; boy series uses blue.
- Difference line (`女生脚长与男生脚长之差`) is smooth, filled, and bound to `yAxisIndex: 1`.
- `setOption` is called twice in a row with the same object.

### BMI × plumpness

- Category X = BMI 12–24, no boundary gap.
- Y min is hard-coded to 20.
- Two area lines + two gauge-style rings on the right (`center` 83%/33% and 83%/72%).
- Ring labels are `\n过瘦脚占比` and `\n过胖脚占比`. The leading newline is intentional so the percent sits in the hole and the caption sits below.

### Bilateral timeline pie

- `baseOption.timeline` auto-plays every 2000 ms across 2岁–14岁.
- Donut radius `36%–58%`, centre shifted to `60%, 50%` to leave room for the timeline.
- Slice colours: `#56c979`, `#5CAFF2`, `#B6A2DF`, `#a96ec9`, `#2DC7C9`.

### Growth radar

- Circular radar, radius 255, three split rings, start angle 90°.
- Split area is fully transparent; axis and split lines are `#BEBEBE`.
- Four age polygons with linear-gradient fills. Age 11’s `itemStyle.borderColor` is still `#f9cf67` (the age-10 colour) even though the fill is green — a copy-paste leftover.

### `draw1.js` / `draw2.js`

These look like gallery experiments that were never hooked up:

- `draw1.js` — plantar pressure lines for 正常人群 vs 糖尿病足人群, plus a source ring. Background `#96e8eb`.
- `draw2.js` — 14-site thickness bars, a difference line, and a `dataZoom` slider.

Standalone, readable versions are in [`examples/plantar-pressure.html`](../examples/plantar-pressure.html) and [`examples/tissue-thickness.html`](../examples/tissue-thickness.html).

## Interaction that is not a chart

`js/click.js` binds:

- `.index_nav ul li` → `.index_tabs .inner` fade
- `.tabs ul li` → `.tabs_map > div` fade
- `.middle_top_bot ul li` active class

The current `index.html` nav is a row of `<a>` tags, not `<li>` tabs, and those extra containers are absent. The file is harmless leftover from an earlier layout (`index_new.css` still has `.tabs` rules).

`header .showTime` is a one-second clock. The initial HTML text (`2020年3月17-0时54分14秒`) is replaced on first tick.

## Adding a panel without breaking rem layout

1. Add a `.panel` (or reuse `.map`) with a unique class and an empty `.chart`.
2. Give the chart a height. Panels are `height: 7rem` in `css/index.css`; `.chart` is `height: 6.5rem` (see the stylesheet). `flexible.js` sets `1rem` from `document.documentElement.clientWidth / 24`.
3. Init ECharts against that selector. Prefer the already-loaded `echarts.min.js` instead of adding a third build.
4. Extract the series into `examples/data/` and add a row to this table.

Worked copies of each option, loaded from JSON, are in [`examples/`](../examples/index.html).
