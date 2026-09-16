# How the dashboard is built

This is a personal, static GitHub Pages site. There is no build step, no bundler, and no backend. Open `index.html` (or any `examples/*.html`) through a local static server and the charts run in the browser.

## File map

```
index.html              shell: header clock, nav, five panel hooks
css/index.css           live layout (panel chrome, rem heights, header)
css/index.less          earlier nested source for the same layout
index_new.css           unused / older nav experiment, not linked
js/flexible.js          rem root font-size from viewport
js/jquery.js            click leftovers + symmetry frame loop
js/echarts.js           full ECharts build (also echarts.min.js)
js/macarons.js          theme file loaded in <head>, not passed to init()
js/index.js             five chart IIFEs
js/click.js             nav tab helpers for markup the home page no longer has
js/china.js / myMap.js  unused geo experiment (commented out in index.html)
draw1.js / draw2.js     personal extra option objects, now wrapped as examples
data/*.json             extracted samples for docs + examples
docs/                   this guide
examples/               standalone pages that load the JSON
```

## Boot order on the home page

1. Inline clock script — `setTimeout(time, 1000)` writes `当前时间：YYYY年M月D-H时M分S秒` into `.showTime`.
2. After the five `.chart` nodes: `flexible.js` → `jquery.js` → `echarts.min.js` → `macarons.js` → `index.js` → `click.js`.

`macarons.js` is loaded after ECharts so it can register its theme. The dashboard IIFEs still call `echarts.init(dom, 'dark')`, not `'macarons'`. The unused full `js/echarts.js` file stays in the tree but is no longer double-loaded. Example pages load only `../js/echarts.min.js` (v4.2.0).

## Rem layout

`js/flexible.js` sets `document.documentElement.style.fontSize` from `clientWidth / 10`, with a 540px cap before the ratio math. Panel heights are rem-based:

| Selector | Height in `css/index.css` |
| --- | --- |
| `header` | `1.25rem` |
| `.panel` | `7rem` (the Less file still says `3.875rem` — CSS is what the browser uses) |
| `.panel .chart` | `6rem` |
| `.map` / `.map .chart` | `10.125rem` |

`header` uses `images/head_bg.png`. `body` uses `images/bg.jpg` cover. Corner ticks are empty `::before` / `::after` boxes with 2px `#02a6b5` borders. The hatch on `.panel` is `images/line(1).png`.

The Less file is **not** the live stylesheet. If you change layout, edit `css/index.css` or recompile Less yourself. This repo does not ship a Less toolchain.

## Chart construction pattern

Each panel is an IIFE:

```js
(function () {
  var myChart = echarts.init(document.querySelector(".panel .chart"), "dark");
  var option = { /* ... */ };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();
```

Why IIFEs: the file reuses the names `myChart` and `option` five times. Without a scope wrapper the later charts would overwrite the earlier ones.

The center radar is the odd one out: `echarts.init(...)` with **no** `'dark'` theme string. It styles split lines and labels by hand.

## Data is inline, then mirrored

The production dashboard does **not** `fetch()` JSON. Arrays live inside `js/index.js`. The `data/*.json` files are a mirror so documentation and example pages can talk about the same numbers without scraping the IIFE.

If you change a live series, update:

1. the array in `js/index.js` (or `draw1.js` / `draw2.js`),
2. the matching `data/*.json`,
3. any prose in `docs/data-notes.md` that cites a specific number.

## jQuery usage (small)

- `$(".bar h2 ").on("click", "a", …)` — dead path; no year links in the heading.
- `$.each(pieData, …)` — builds `optionsData` for the symmetry timeline.
- `js/click.js` — looks for `.index_nav ul li`, `.index_tabs`, `.tabs`, `.middle_top_bot`. The home nav is plain `<a>` tags, so those handlers do nothing.

Example pages do not depend on jQuery.

## Themes and color

`echarts.init(dom, 'dark')` is what actually darkens four panels. `js/macarons.js` / `js/macarons.json` are unused on the home path. Example pages either pass `'dark'` or set `backgroundColor` on the option, matching the original files.

## Unused / commented experiments

| File | Status |
| --- | --- |
| `js/china.js` | Geo JSON / registerMap helper; script tag commented out |
| `js/myMap.js` | Xi’an / Xining / Lhasa flying-line map; script tag commented out |
| `css/index.less` | Nested source; not linked |
| `index_new.css` | Not linked |
| `draw1.js` / `draw2.js` | Option-only sketches; now also have HTML wrappers |

Keep them. They are personal history, not dead weight to delete in this docs pass.

## GitHub Pages

The site is a user/organization Pages repo (`pang990801.github.io`). Whatever is on `master` at the root is the public site. `docs/` and `examples/` are just more static files. After merge they will be reachable as:

- `https://pang990801.github.io/docs/guide.html`
- `https://pang990801.github.io/examples/index.html`

Locally, follow [`local-preview.md`](local-preview.md). Do not open `index.html` as a `file://` URL if you want the example pages’ `fetch('../data/…')` to succeed — browsers block that.

## Editing safely

1. Prefer adding series in `data/*.json` and teaching pages in `examples/` over stuffing more arrays into `js/index.js`.
2. Keep the home dashboard’s five selectors (`.bar`, `.line`, `.map`, `.bar1`, `.line1`) stable. `js/index.js` queries them by class, not by id.
3. After a CSS change, check both a wide desktop width and a ~1100px window. The home page is not a phone layout.
4. After a chart change, resize the window once — every instance must still call `resize()`.
