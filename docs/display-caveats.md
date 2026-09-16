# Display caveats

Things that are easy to misread on the personal dashboard. None of these are production bugs to “fix” in this docs-only branch; they are notes so the lab pages do not repeat the confusion.

## 1. The page title is still `Document`

`index.html` ships `<title>Document</title>`. This branch sets it to the Chinese heading so a browser tab matches the header. The live Pages tab will keep saying `Document` until a title change is merged and Pages is pointed at this tree.

## 2. Two ECharts builds

Both `js/echarts.js` and `js/echarts.min.js` load. That is redundant and whichever file is last defines `window.echarts`. Lab pages load **only** `js/echarts.min.js`.

## 3. Theme file is unused

`js/macarons.js` runs in `<head>`. Every `echarts.init` call either passes `'dark'` or passes nothing. None pass `'macarons'`.

## 4. Scatter series names vs. panel title

The heading says 男童 / 女童. The legend says 女性 / 男性. Same colours (`#ff4f3b` female, `#ffe01f` male).

## 5. Shoe size printed as centimetres

Tooltip formatter:

```text
身高：{x}cm
鞋码：{y}cm
```

If you need a size *code*, use the [unit converter](../examples/lab/unit-converter.html), not the tooltip.

## 6. Dead year toggle

`dataAll` for 2019/2020 in the first IIFE belongs to an older bar chart. There is no year switcher in the heading.

## 7. BMI y-axis vs. the numbers

Axis name: `脚胖瘦度（脚长/脚宽）`, `min: 20`. A real length/width ratio for a child’s foot is typically near 2.3–2.8, not 26. Either the series is scaled, or the name is leftover. The lab explorer treats the values as a **named series**, not a physical ratio.

## 8. Donuts are not a histogram of the lines

Thin/thick percents come from four literals (50, 180, 435, 2400). You cannot recover them from the 13 BMI points.

## 9. Symmetry is generated

The pretty timeline is `Math.log` plus `Math.round`. Same-size share rises with age because the four leftover terms decay. See [formulas](formulas.md).

## 10. Radar overwrites the map slot

`.map .chart` is the radar. `js/myMap.js` + `js/china.js` would fight for that DOM node if they were enabled. CSS still describes rotating map decorations that are not in the HTML.

## 11. `12岁` radar cells use subtraction

`77-6` and `79-8` evaluate to 71 and 71. If someone later “corrects” those expressions, the polygon changes.

## 12. `click.js` has nothing to click

It looks for `.index_nav ul li`, `.index_tabs`, `.tabs`, `.middle_top_bot`. The nav is a row of `<a>` tags, not `<li>` tabs. The file is harmless.

## 13. Missing font

`css/index.css` declares `datamsg` → `../font/液晶数字.TTF`. That file is not in the repo. Browsers fall back.

## 14. Unmounted sketches use a different population

`draw1.js` / `draw2.js` talk about adults and diabetic-foot groups. Mixing them into the children’s story without a caption would be misleading. The leftover lab page keeps a warning banner.

## 15. Published URL vs. repo name

GitHub Pages for this user/repo is

`https://sapphireran.github.io/pang990801.github.io/`

The nav’s `https://pang990801.github.io/` is a different host. Repo Pages source on GitHub may still mention a missing `gh-pages` branch; merging docs to `master` does not by itself retarget Pages.

## 16. `index_new.css`

Not linked. Safe to ignore while reading the live layout.
