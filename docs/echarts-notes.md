# ECharts notes for this Pages repo

Personal reminders about the chart library as it is actually used here. Official ECharts docs remain the reference for APIs.

## Two builds, one global

`index.html` loads both:

```html
<script src="js/echarts.js"></script>
<script src="js/echarts.min.js"></script>
```

Both assign `window.echarts`. The minified file is enough for every chart on this site (scatter, bar, pictorialBar, line, pie, radar, timeline). The full build stays in the tree as a leftover from early experiments. Example pages load only `echarts.min.js`.

## Theme names

Most homepage inits look like:

```js
echarts.init(document.querySelector(".bar .chart"), "dark");
```

`js/macarons.js` registers the `macarons` theme from `js/macarons.json`, but nothing on the homepage asks for it. The radar in the center column is initialized without a theme name. Backgrounds are therefore a mix of the built-in dark theme and hand-set `backgroundColor: 'rgba(...,0.3)'`.

Example pages do not register `macarons`. They set text, axis, and series colors in the option so the pages still look finished if the theme file is missing.

## Selector contract

Each IIFE assumes its DOM node exists. `echarts.init(null)` throws. That is why the example pages copy the same class names (`.bar .chart`, `.line .chart`, …) instead of inventing new ones for the extracted options.

If a future page only needs one chart, keep a dummy node with the original class or rewrite the init selector. Do not drop `js/index.js` onto a page that is missing a column.

## Resize

Every homepage IIFE binds:

```js
window.addEventListener("resize", function () {
  myChart.resize();
});
```

Example pages share one helper, `bindChartResize(chart)`, so a single listener can resize several instances. Always call `resize()` after a layout change that is not a window event (tabs, font-size toggles, splitting a panel).

## Pictorial bars

The age panel uses `pictorialBar` with `symbol: 'diamond'` and `symbolPosition: 'end'`. The diamond is a cap, so its `data` must repeat the bar values. `symbolOffset` is hardcoded to `±12.5` to match `barWidth = 25`. If the bar width changes, the offset has to change with it.

## Timeline pies

The left/right panel is `baseOption` + `options[]`. Only `series.data` is overridden per age. Colors, radius, and label style stay in `baseOption`. Autoplay is `playInterval: '2000'` (string). ECharts coerces it, but new work should pass a number.

## Radar radius

The center radar uses `radius: 255` as a pixel value. It looks right on a wide desktop column and overflows a narrow one. Example pages switch that to a percentage radius (`68%`) so the same option survives a 720 px column.

## Linear gradients

Several series build

```js
new echarts.graphic.LinearGradient(x, y, x2, y2, colorStops, false)
```

That constructor lives on the `echarts` global. Example pages therefore load ECharts before the chart module. Do not move gradient construction above the script tag.

## Dark-theme contrast

Hand-picked colors that already work on the navy background:

| Role | Hex |
| --- | --- |
| Girl / warm | `#ff4f3b`, `#FF69B4` |
| Boy / cool | `#ffe01f`, `#3deaff`, `#319cf1` |
| Axis hairline | `#65C6E7`, `#BEBEBE` |
| Typical adult | `#a60bde`, `rgba(255,144,128,1)` |
| Diabetic-foot adult | `#ff733f`, `rgba(0,191,183,1)` |

Avoid `#000` text on the dashboard. The background image is already near black.

## Toolbox leftovers

The scatter toolbox still offers `dataZoom`, `brush`, and `saveAsImage`. The BMI panel sets `toolbox.show = false` but leaves a `saveAsImage` feature in the object. Harmless. New charts should either show a toolbox or omit it.

## China map leftovers

`js/china.js` registers a geo map. `js/myMap.js` draws origin–destination flights on it. Both are commented out of `index.html`. Keep them if a later personal map experiment needs them; do not load them on the children's dashboard or they will fight the radar for `.map .chart`.

## Macarons palette

If a page does want the registered theme:

```js
echarts.init(node, "macarons");
```

The first five swatches are `#2ec7c9`, `#b6a2de`, `#5ab1ef`, `#ffb980`, `#d87a80`. That palette is lighter than the current dashboard and reads better on a white example page than on `images/bg.jpg`.
