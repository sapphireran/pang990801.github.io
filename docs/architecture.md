# Architecture

The 2020 site is a static GitHub Pages bundle: one HTML file, a
flexible-layout stylesheet, and a handful of IIFEs that each own one
ECharts instance. There is no build step, no package.json, and no
backend.

```
index.html          dashboard shell + clock + nav
css/index.css       rem-based dark HUD (compiled from index.less)
js/flexible.js      sets <html> font-size from viewport width
js/jquery.js        click handlers and a leftover year-toggle
js/echarts.js       full ECharts build (also echarts.min.js)
js/index.js         five chart IIFEs + inline arrays
js/click.js         tab helpers for markup that is no longer in index.html
js/china.js         unused geo helper (commented out in index.html)
js/myMap.js         unused flow-map draft (commented out)
draw1.js            unused plantar-pressure option
draw2.js            unused tissue-thickness option
```

The archive added later does not replace that bundle. It sits beside
it:

```
data/*.json         extracted arrays + summary stats
examples/           standalone pages, shared theme, datasets.js
scripts/            extract_data.py, validate_data.py
docs/               this write-up
```

## Page boot sequence

`index.html` loads scripts in this order:

1. `js/macarons.js` in `<head>` — a theme file; the charts actually
   pass `'dark'` to `echarts.init`, so macarons is unused.
2. `css/index.css` after a viewport meta tag.
3. A header clock that rewrites `.showTime` every second.
4. `flexible.js` — typical pattern: `font-size = clientWidth / 24` so
   `rem` units track a 1920px design (`80px` root at full HD). The
   stylesheet also clamps `<html>` to `42px` below 1024px.
5. jQuery, then **both** `echarts.js` and `echarts.min.js`. The min
   build overwrites the global. Shipping both is leftover from the
   original upload.
6. `js/index.js` — five IIFEs query `.bar .chart`, `.line .chart`,
   `.bar1 .chart`, `.line1 .chart`, and `.map .chart`.
7. `js/click.js` — binds `.index_nav ul li`, `.tabs`, and
   `.middle_top_bot`. The current nav is a list of `<a>` tags, not
   `<li>`, so those handlers no-op.

Every IIFE registers `window.resize → chart.resize()`. That is the
only shared runtime contract.

## Layout model

`.mainbox` is a three-column flex row (`3 / 4 / 3`) with a min-width
of 1024px. Each side column stacks two `.panel` blocks. The center
column is a taller `.map` block that now holds the radar, not a map.

Panels use a HUD chrome: 1px teal border, corner ticks via
`::before` / `::after`, and a repeating `images/line(1).png` fill on
a 4% white wash. Background art is `images/bg.jpg` plus a header
strip `images/head_bg.png`.

The nav row (`.index_nav`) is pulled up with a negative margin so it
sits on the header. Links point at sibling class-of-2020 Pages sites
and a QQ mailbox.

## Chart object ownership

Each IIFE:

1. Calls `echarts.init(dom, 'dark')` (radar omits the theme).
2. Builds a large `option` object with hardcoded arrays.
3. Calls `setOption`.
4. Optionally binds a jQuery click that is dead in the current HTML.

There is no shared store. Changing one chart cannot affect another
without editing `js/index.js`. The extract script is the only bridge
from those arrays to the example pages.

## Data lifetime

| Layer | Lifetime |
| --- | --- |
| Arrays inside `js/index.js` | Source the homepage still plots |
| `data/*.json` | Generated snapshot for docs / examples |
| `examples/js/datasets.js` | Same snapshot as `window.FOOT_DATA` so `file://` works |

`scripts/extract_data.py` parses JS array / object literals with a
small recursive reader (numbers, strings, arrays, objects). It does
not evaluate JavaScript. Re-run it after editing the dashboard
arrays; `scripts/validate_data.py` checks counts, ranges, and the
age-difference identity `female - male == female_minus_male`.

## Dead or half-wired code

- **Year toggle** in the first IIFE: `$(".bar h2").on("click", "a",
  …)` swaps the scatter for a 7-point bar series keyed 2019/2020.
  The `<h2>` has no `<a>` children, so the handler never fires. The
  2019/2020 arrays are unrelated to foot shape.
- **china.js / myMap.js** — a classic “flight-map” demo. `index.html`
  comments both out. The center DOM class remains `.map`.
- **draw1.js / draw2.js** — top-level `option = {…}` files. Nothing
  assigns them to a chart. Examples now do.
- **click.js** — leftover tab chrome.
- **macarons theme** — loaded, never selected.
- **index_new.css** — unused alternate sheet at the repo root.

## Why examples are separate pages

The dashboard CSS assumes a 1920-wide HUD and a `flexible.js` rem
base. Documentation and examples need readable type, a mobile
viewport, and JSON-driven charts. Forking the visual system would
fight the original page. The gallery uses its own sheet
(`examples/css/examples.css`) and the minified ECharts build already
in `js/`.

## Browser support (original)

The 2020 code uses `var`, IIFEs, and jQuery 1.x-style APIs. It does
not use modules. Examples add `const` / `let` and `addEventListener`.
Both layers are static files suitable for GitHub Pages.
