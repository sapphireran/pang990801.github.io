# Chart catalog

Map of every chart that this personal Pages repo can render. The homepage mounts five of them. Two more live as option sketches and now have example pages.

## Homepage mount points

`js/index.js` is five independent IIFEs. Each one queries a CSS selector, calls `echarts.init`, and binds `window.resize`.

| Order in file | Title on page | DOM hook | ECharts types | Theme |
| ---: | --- | --- | --- | --- |
| 1 | 男童女童身高与鞋码的关系 | `.bar .chart` | `scatter` + markArea / markPoint / markLine | `dark` |
| 2 | 男童女童年龄与脚长的关系 | `.line .chart` | `bar` + `pictorialBar` + `line` | `dark` |
| 3 | 儿童BMI与脚的胖瘦度关系 | `.bar1 .chart` | `line` + two `pie` rings | `dark` |
| 4 | 儿童双脚比例 | `.line1 .chart` | timeline `pie` | `dark` |
| 5 | (untitled radar) | `.map .chart` | `radar` | default |

The center column reuses a `.map` class from an older China-map experiment. `js/myMap.js` and `js/china.js` are still in the tree but are commented out of `index.html`. The radar is what actually fills that hole.

## Scatter: stature × shoe last

File region: first IIFE, series names `女性` and `男性`.

Why this shape: a scatter keeps every child visible. Sex is color (`#ff4f3b` girls, `#ffe01f` boys). Cross-hair tooltips print both centimetres. Brush and dataZoom stay in the toolbox so a region can be boxed without rewriting the option.

Oddities worth knowing:

- The tooltip still says `鞋码：…cm`. That is a length, not a size label.
- Click handlers on `".bar h2 a"` swap in a leftover 2019/2020 bar dataset (`dataAll`). The current heading has no `<a>` links, so that handler never fires.
- `markLine` vertical references are hardcoded at 115 cm and 110 cm of stature.

Standalone page: [`../examples/height-shoe-size.html`](../examples/height-shoe-size.html)

## Diamond bars: age × foot length

File region: second IIFE.

Each sex is a pair of series: a gradient bar and a diamond `pictorialBar` parked on the top face. The cyan line is `girl − boy` on `yAxisIndex: 1`.

The primary Y axis starts at 12 cm so the bars do not sit on a zero baseline. That exaggerates year-to-year change. The example page keeps the same floor so it matches the dashboard, and it also prints the raw table.

Standalone page: [`../examples/age-foot-length.html`](../examples/age-foot-length.html)

## Area + rings: BMI × slenderness

File region: third IIFE.

Two smoothed area lines share a category BMI axis. Two donut pies are absolutely placed at 83% of the grid width. The pies do not encode the line series; they are fixed placeholder fractions for 过瘦脚 and 过胖脚.

Grid `right: 35%` exists only to leave room for those rings. If the rings are removed, reclaim that margin.

Standalone page: [`../examples/bmi-foot-ratio.html`](../examples/bmi-foot-ratio.html)

## Timeline pie: left / right classes

File region: fourth IIFE.

`baseOption` holds a playing timeline (`playInterval: 2000`). `options` is one `{ series: { data } }` object per age from 2 to 14. Slice values come from the log-decay formula documented in [data-dictionary.md](data-dictionary.md).

Because the pie is a timeline, `echarts.init` here is the only chart that animates without user input.

Standalone page: [`../examples/left-right-asymmetry.html`](../examples/left-right-asymmetry.html)

## Radar: seven normalized traits

File region: fifth IIFE.

One circular radar, four series (ages 9–12). `splitNumber: 3` and `splitArea.color = transparent` keep the dark background visible. Radius is a raw `255` pixels, which is why this chart wants a tall center column.

Standalone page: [`../examples/radar-growth.html`](../examples/radar-growth.html)

## Sketch: plantar pressure

File: `draw1.js`. Not mounted on the homepage.

Combo of a seven-point smooth line and a single decorative ring. Colors are purple / orange on a mint background (`#96e8eb`). The example page restyles it to the shared dark chrome so it can sit next to the children's charts without a second visual language.

Standalone page: [`../examples/plantar-pressure.html`](../examples/plantar-pressure.html)

## Sketch: soft-tissue thickness

File: `draw2.js`. Not mounted on the homepage.

Stacked-looking bars that are actually unstacked: typical adults in coral, diabetic-foot adults in teal, difference as a mint area line. A `dataZoom` window starts at 10–80% of the 14 sites.

Standalone page: [`../examples/tissue-thickness.html`](../examples/tissue-thickness.html)

## Shared libraries

| File | Role on the homepage |
| --- | --- |
| `js/flexible.js` | Sets `html` font-size from viewport width / 24 so `rem` layout scales |
| `js/jquery.js` | Click helpers and the unused heading swap |
| `js/echarts.js` + `js/echarts.min.js` | Both are loaded; `echarts.min.js` wins if it loads second |
| `js/macarons.js` | Theme file loaded in `<head>` but charts request `'dark'` |
| `js/click.js` | Tab highlighters for markup the current homepage does not render |
| `js/index.js` | The five live options |

Example pages skip `flexible.js` and jQuery. They use a plain pixel layout and only `echarts.min.js`.

## Adding a sixth homepage panel

1. Add a `.panel` in `index.html` with a unique class and an inner `.chart`.
2. Append a new IIFE in `js/index.js` that inits that selector.
3. Extend `scripts/extract_example_data.py` if the series should be downloadable.
4. Add a row to this catalog and a page under `examples/`.

Keep new work personal. Do not drop in company dashboards or private tables.
