# Local preview

The site is static files. GitHub Pages serves the repo root. Anything you can open through a local HTTP server is what visitors get at `https://pang990801.github.io/`.

## Serve the repo root

From the repository root (the directory that contains `index.html`):

```bash
python3 -m http.server 4173
```

Then open:

| URL | What you should see |
| --- | --- |
| http://127.0.0.1:4173/ | Live dashboard (ECharts panels). |
| http://127.0.0.1:4173/examples/ | Example gallery. |
| http://127.0.0.1:4173/docs/index.html | HTML guide. |
| http://127.0.0.1:4173/examples/height-shoe-size.html | Scatter example that `fetch`es JSON. |

`file://` will load the dashboard scripts, but the example pages use `fetch()` for `examples/data/*.json` and browsers block that on local files. Always use the HTTP server for the gallery.

## Why rem sizes look tiny or huge

`js/flexible.js` sets

```js
document.documentElement.style.fontSize = document.documentElement.clientWidth / 24 + "px";
```

Panel heights in `css/index.css` are specified in `rem` (`7rem` panels, `0.475rem` title). On a 1440 px-wide window, `1rem ≈ 60px`. On a 400 px phone, `1rem ≈ 16.7px` and the three-column flex row will overflow (`min-width: 1024px` on `.mainbox`).

The example gallery does **not** use `flexible.js`. Example charts have explicit pixel heights so they stay readable on a laptop without the dashboard’s rem contract.

## Script load order on the dashboard

Do not reorder these without checking `js/index.js`:

1. `flexible.js` — must run before first layout paint you care about, or rem sizes jump.
2. `jquery.js` — `$` is used for the unused year-click handler and for `$.each` in the timeline pie.
3. `echarts.js` then `echarts.min.js` — the second file wins for the `echarts` global. One file is enough; both are kept only because that is what `index.html` already does.
4. `index.js` — inits five charts. If a `.chart` node is missing, that IIFE throws and later charts never start.

## Editing data

Prefer this loop:

1. Change the arrays in `js/index.js` (or `draw1.js` / `draw2.js`) if the live dashboard should change.
2. Re-run the extractor in [`examples/scripts/extract-data.js`](../examples/scripts/extract-data.js) so JSON and docs stay aligned.
3. Refresh the matching example page and confirm the table + chart both moved.

Or edit JSON first while sketching, then paste back into `js/index.js`. The dashboard does **not** read the JSON at runtime. That split is deliberate: the original board stays self-contained; examples stay inspectable.

## Checking JSON after a hand edit

```bash
node examples/scripts/validate-data.js
```

The script checks required keys, matching array lengths, and the known point counts (199 / 199 on the scatter).

## Fonts and images

| Path | Used by |
| --- | --- |
| `font/DS-DIGIT.TTF` | `electronicFont` in `css/index.css` (clock-style face). |
| `images/bg.jpg` | Dashboard body background. |
| `images/head_bg.png` | Header bar. |
| `images/line(1).png` | Panel texture. |
| `images/map.png` | Referenced by leftover map CSS if you turn `myMap.js` back on. |

`css/index.less` and `index_new.css` are unused by `index.html`. Safe to ignore while previewing.

## Pages vs Markdown

GitHub will render `README.md` and `docs/*.md` on the repo. GitHub Pages will **not** turn those Markdown files into styled site pages unless you add a generator. The browsable site copies are:

- `docs/index.html`
- `examples/index.html` and the per-chart HTML files

Keep both in sync when you change a number that a visitor might quote.
