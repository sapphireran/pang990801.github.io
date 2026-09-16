# Architecture

The site is a static GitHub Pages tree. There is no bundler, no router, and no backend. A visitor gets HTML, CSS, images, and a handful of JavaScript files.

## Page roles

| URL | Role |
| --- | --- |
| `/` (`index.html`) | Full-screen cockpit: header clock + five ECharts panels |
| `/docs/` | Written notes and a small HTML table of contents |
| `/examples/` | One chart per page, fed by JSON |

The original nav in `index.html` pointed at sibling class-project sites. The personal docs/examples links sit next to those entries and stay inside this repository.

## Homepage structure

```
header
  h1  中国人群脚型数据可视化
  .showTime   ticking clock (inline script)
.data_bodey > .index_nav
  sibling-site links + docs + examples
section.mainbox
  .column
    .panel.bar    height × shoe scatter
    .panel.line   age × foot length
  .column
    .map          growth radar (class name is leftover from a map draft)
  .column
    .panel.bar1   BMI × foot shape
    .panel.line1  left/right timeline pie
```

Each panel is an empty `.chart` div. `js/index.js` queries those class names and mounts an ECharts instance.

## Script load order

`index.html` loads files in this order on purpose:

1. `js/macarons.js` — theme registration (head)
2. `js/flexible.js` — sets `html` font-size from viewport width
3. `js/jquery.js` — used by `click.js` and one leftover year-toggle
4. `js/echarts.js` then `js/echarts.min.js` — both are present; the min build is enough
5. `js/index.js` — the five panel IIFEs
6. `js/click.js` — tab/nav helpers for markup that is no longer on the page

`js/china.js` and `js/myMap.js` are leftover from an earlier map-centered layout. The current center panel is a radar, not a geo series. They stay in the tree so the draft can be restored.

`draw1.js` and `draw2.js` at the repo root are gallery-style `option = { ... }` dumps. They do not run on the homepage. The examples gallery wraps them.

## Chart module pattern

Every IIFE in `js/index.js` is a closed miniature app:

```text
(function () {
  var myChart = echarts.init(el, "dark");
  var option = { /* axes, series, extras */ };
  myChart.setOption(option);
  window.addEventListener("resize", function () { myChart.resize(); });
})();
```

Why an IIFE: option variable names collide (`option` is reused five times). Why `"dark"`: the cockpit background is near-black; the theme supplies readable axis labels. Why resize: `flexible.js` and the browser both change the CSS pixel size of `.chart`.

Example pages keep the same four steps but:

- skip jQuery
- skip `flexible.js` (they use ordinary CSS `vh` / flex)
- load series from `examples/data/*.json`

## Layout engine

`css/index.css` is the runtime stylesheet. `css/index.less` is the nested source for the same look. They have drifted: Less still uses the shorter 3.875rem panel height; the compiled CSS uses 7rem so the scatter and combo charts have room.

`flexible.js` writes `document.documentElement.style.fontSize`. Most cockpit sizes are rem, so the whole dashboard scales with viewport width. The media queries at the bottom of `index.css` pin the root size at the 1024px and 1920px edges.

Example and docs pages do **not** use `flexible.js`. They are ordinary document layouts so a notes page can scroll.

## Assets

| Path | Used by |
| --- | --- |
| `images/bg.jpg` | cockpit body |
| `images/head_bg.png` | header bar |
| `images/line(1).png` | panel scanline texture |
| `images/map.png`, `lbx.png`, `jt.png` | unused map ornaments (CSS still defines them) |
| `font/DS-DIGIT.TTF` | electronic clock / number family |
| `js/echarts.min.js` | every live chart, including examples |

## What is intentionally not here

- No npm scripts, lockfile, or CI
- No anonymized raw 3D-scan dump (only the series already published on the dashboard)
- No authentication
- No company design system

If a chart needs new numbers, edit the JSON under `examples/data/` (for examples) or the `data:` arrays in `js/index.js` (for the cockpit). Keep the two in sync when the change is meant to be shared.
