# Project notes

The dashboard is a single static page. There is no build step, no backend,
and no runtime data fetch. Every series is an array literal inside
`js/index.js`.

## Page shell

`index.html` sets a Chinese title in the header (`中国人群脚型数据可视化`)
but leaves the document title as `Document`. A clock in the header
recomputes `Date` once a second with a recursive `setTimeout`.

The top nav is four plain links, not the jQuery tab widget in
`js/click.js`:

- 首页 → `https://scuscientia.github.io/`
- 儿童脚型 → this site
- 畸形足或病足 → `https://ytep-zhi.github.io/`
- 联系我们 → `mailto:1127235750@qq.com`

Those neighboring pages are other personal GitHub Pages sites. They are
not loaded or built from this repository.

Scripts load in this order: `flexible.js`, `jquery.js`, `echarts.js`,
`echarts.min.js`, `index.js`, `click.js`. Both ECharts bundles are
requested; the second assignment of `window.echarts` wins. `china.js` and
`myMap.js` stay commented out, which is why the center column is a radar
and not a China map.

`macarons.js` is referenced in `<head>` but the live charts pass `'dark'`
into `echarts.init`, so the macarons theme is unused.

## Layout and scaling

`js/flexible.js` sets `html { font-size: viewportWidth / 24 }`. Most
dashboard sizes in `css/index.css` are rem-based, so the panels grow with
the window. The stylesheet also pins a minimum width of 1024px on
`.mainbox`.

The visual system is a dark photo background (`images/bg.jpg`), a header
strip (`images/head_bg.png`), and framed `.panel` blocks with cyan corner
brackets. `index_new.css` at the repo root is a leftover stylesheet and
is not linked from `index.html`.

`css/index.less` is a close sibling of `css/index.css`. The live page
loads the CSS file only.

## How a live chart boots

Each panel in `js/index.js` is an IIFE that:

1. Selects a child `.chart` node (`'.bar .chart'`, `'.line .chart'`,
   `'.bar1 .chart'`, `'.line1 .chart'`, `'.map .chart'`).
2. Calls `echarts.init(node, 'dark')`.
3. Builds a large `option` object in place.
4. Calls `setOption`.
5. Listens for `window.resize` and calls `chart.resize()`.

The first IIFE still contains a dead 2019/2020 year toggle
(`$(".bar h2").on("click", "a", ...)`) but the heading has no `<a>`
tags, so that handler never fires.

## Files that look live but are not

| File | Why it is easy to misread |
| --- | --- |
| `draw1.js` / `draw2.js` | Valid ECharts `option` objects, never included by `index.html` |
| `js/myMap.js` + `js/china.js` | China-map helper; script tags are commented out |
| `js/click.js` | Binds `.index_nav ul li` and `.tabs`; the nav uses `<a>` tags instead |
| `js/macarons.js` | Theme file loaded, then overridden by `'dark'` |
| `index_new.css` | Alternate stylesheet, not linked |
| `font` face `液晶数字.TTF` | Referenced in CSS; the folder only has `DS-DIGIT.TTF` |

The example gallery turns the two unmounted option files into pages that
actually render. See [unpublished-sketches.md](unpublished-sketches.md).

## What this repo is for

The original page is a personal visualization homework / study board:
Chinese labels, a video-wall layout, and several related personal sites
in the nav. The `docs/` and `examples/` trees exist so those charts can
be opened one at a time, the arrays can be read as JSON, and the axis
names have a written glossary.
