# Local preview

The site is static. You need a tiny HTTP server because the examples `fetch()` JSON.

## Python

From the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

| URL | Page |
| --- | --- |
| http://127.0.0.1:4173/ | dashboard |
| http://127.0.0.1:4173/docs/ | notes index |
| http://127.0.0.1:4173/examples/ | chart gallery |
| http://127.0.0.1:4173/examples/data/catalog.json | dataset index |

## npx (optional)

```bash
npx --yes serve -l 4173
```

## What will look wrong without a server

- Opening `examples/height-shoe-scatter.html` as `file://` → `fetch` fails, the chart body shows the error banner from `chart-helpers.js`.
- Missing `images/bg.jpg` / `font/DS-DIGIT.TTF` only affects the **dashboard**, not the example chrome (examples use a CSS gradient).

## Editing CSS

`css/index.less` exists beside `css/index.css`. There is no compile step in the repo. If you change Less, copy or compile into `index.css` yourself. The dashboard links **only** `index.css`.

`flexible.js` sets `document.documentElement.style.fontSize` from `innerWidth / 24`. Shrinking the window rem-shrinks the whole board, including ECharts containers. Examples **do not** load `flexible.js`; they use ordinary `vh`-based chart divs.

## Smoke checklist

After changing a JSON file:

1. Hard-refresh the matching example page.
2. Hover a point / bar and read the tooltip units.
3. Resize the window; the instance should call `resize()`.
4. Only then copy numbers back into `js/index.js` if the live dashboard should change.

After changing `js/index.js` without JSON:

1. Update the JSON (the examples will otherwise document stale data).
2. Recompute `height-shoe-summary.json` if the scatter arrays moved.

A tiny helper is documented in [`examples/README.md`](../examples/README.md).
