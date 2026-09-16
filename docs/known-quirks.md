# Known quirks

Small traps in the original dashboard. Documented rather than silently rewritten, except where the examples already sidestep them.

## Double ECharts bundle

`index.html` loads `js/echarts.js` (~3.0 MB) and then `js/echarts.min.js` (~0.7 MB). The minified file overwrites `window.echarts`. The first script is wasted bytes on Pages. Examples load **only** `echarts.min.js`.

## `querySelector` extra comma

```js
echarts.init(document.querySelector(".bar .chart",), 'dark')
```

The trailing comma inside `querySelector` is legal JavaScript (elided), so the scatter still boots. It looks like a typo. Examples pass a single selector string.

## Radar replaced the map

`js/china.js` and `js/myMap.js` are commented out, but the centre column is still classed `.map` and `css/index.css` still sizes it like a map. The fifth IIFE in `js/index.js` draws a radar into `.map .chart`. `js/myMap.js` would also call `echarts.init(document.querySelector(".map .chart"))` — they cannot coexist.

## Dead year toggle

The scatter IIFE defines `dataAll` for 2019/2020 and binds `$(".bar h2").on("click", "a", ...)`. The heading has no `<a>` children, and the arrays are unrelated counts (`[200, 300, …]`), not foot lengths. Clicking the title does nothing useful.

## `click.js` selectors

`js/click.js` wires `.index_nav ul li`, `.tabs ul li`, `.middle_top_bot ul li`. The current `index.html` nav uses `<a>` tags inside `<ul>`, not `<li>`, and has no `.tabs` block. The file is harmless leftover behaviour.

## Theme script in `<head>`

`macarons.js` is loaded before ECharts. Depending on how that file registers the theme, order can matter. The dashboard IIFEs request `'dark'`, not `'macarons'`, so macarons is likely unused for the five live charts.

## Clock placeholder

The HTML includes a stamped time `2020年3月17-0时54分14秒` which the script replaces after 1 s. No timezone is shown; it is the browser’s local clock.

## Nav whitespace

The 畸形足 link is `" https://ytep-zhi.github.io/"` (leading space). Browsers usually still navigate. Examples / docs use trimmed URLs when they mention it.

## Age 12 radar arithmetic

```js
value: [84, 45, 55, 70, 77-6, 79-8, 79]
```

JSON stores the evaluated `71, 71`. If you copy the source literally into a JSON file you would need a different format.

## `draw2.js` difference units

Legend says `差值:um` while the other series are mm. The numeric differences do not match a millimetre-to-micrometre conversion. Caption it as “authored overlay”, not a physical residual.

## Scatter `markLine` x-values

Girls `xAxis: 115`, boys `xAxis: 110` — near each group’s mean height (116.9 / 111.8) but **not** computed at runtime. If the sample changes, those reference lines will drift unless updated.

## Language mix

Comments in `index.js` still say things like “学习进度柱状图模块” and “优秀作品” from the vis-board template this page was forked from. They do not describe foot data.

## Fonts

`css/index.css` `@font-face`s `液晶数字.TTF` which is **not** in `font/` (only `DS-DIGIT.TTF` is). The clock uses `electronicFont` → DS-DIGIT, so the missing file may not matter for the header.
