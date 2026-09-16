# Architecture

How the personal dashboard is put together. Nothing here is a framework — it is a handful of static files and immediately-invoked functions.

## Runtime

`index.html` loads, in order:

1. `js/macarons.js` (ECharts theme; also referenced before the page stylesheet)
2. `css/index.css`
3. inline clock in `<header>`
4. `js/flexible.js` — rem scaling from screen width (`html` font-size = `width / 24`)
5. `js/jquery.js`
6. `js/echarts.js` **and** `js/echarts.min.js` (full then minified; the second assignment wins on `window.echarts`)
7. `js/index.js` — five chart IIFEs
8. `js/click.js` — leftover tab handlers for selectors the dashboard HTML does not currently render

Commented out: `js/china.js` and `js/myMap.js` (geo flow map). The centre panel is a **radar** chart, not a choropleth.

## Chart mount points

| CSS selector | Chart | Source |
| --- | --- | --- |
| `.bar .chart` | scatter, height × shoe size | first IIFE in `js/index.js` |
| `.line .chart` | pictorial bars + difference line, ages 6–14 | second IIFE |
| `.bar1 .chart` | BMI lines + two ring pies | third IIFE |
| `.line1 .chart` | timeline pie, ages 2–14 | fourth IIFE |
| `.map .chart` | radar, ages 9–12 | fifth IIFE |

Each IIFE calls `echarts.init(..., 'dark')` except the radar, which uses the default theme and paints its own colours.

Resize: every instance registers `window.addEventListener("resize", () => chart.resize())`.

## Layout

`css/index.css` is a 24-rem-wide dark board:

- `header` (~1.25 rem) with title and DS-DIGIT clock
- `.index_nav` overlay with four outbound links
- `.mainbox` → three `.column` flex children
  - left / right columns: stacked `.panel` cards with a decorative `.panel-footer`
  - centre column: `.map` sized for the radar

Background art lives in `images/` (`bg.jpg`, `head_bg.png`, `map.png`, …). Digital clock font: `font/DS-DIGIT.TTF`.

`index_new.css` looks like an earlier nav-only stylesheet and is **not** linked from `index.html`.

## Examples vs dashboard

The dashboard keeps data **inline** in `js/index.js` (large scatter arrays, hard-coded means).

The `examples/` gallery **does not import `js/index.js`**. Each page:

1. Loads vendored `js/echarts.min.js` from the repo root
2. Loads `examples/js/chart-helpers.js` (chrome + `fetch` helper)
3. Reads a JSON file from `examples/data/`
4. Builds a fresh `option` object

That split is intentional: you can change an example without touching the live dashboard, and you can read the numbers without scrolling a 1 100-line options file.

## Standalone sketches

| File | Loaded by dashboard? | Example page |
| --- | --- | --- |
| `draw1.js` | no | `examples/plantar-pressure.html` |
| `draw2.js` | no | `examples/tissue-thickness.html` |
| `js/myMap.js` | no (commented) | documented only; depends on `china.js` geo |

`draw1.js` / `draw2.js` assign a global `option` the way the ECharts gallery editor does. They are not functions. The example pages re-express the same series in JSON instead of `eval`ing those files.

## GitHub Pages

This is a **user site** (`<user>.github.io`), so the repo root of `master` is the web root. Paths in the new pages are root-relative or `../` from `docs/` and `examples/`. Do not assume a project-pages subpath.
