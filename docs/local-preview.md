# Local preview

No install step is required beyond a working `python3` and `node`
(Node is only needed for the extract / test scripts).

## Serve the static files

GitHub Pages will host the same files. Locally:

```bash
cd /path/to/pang990801.github.io
python3 -m http.server 4173
```

| URL | Page |
| --- | --- |
| http://localhost:4173/ | Live dashboard |
| http://localhost:4173/examples/ | Example gallery |
| http://localhost:4173/examples/charts/height-shoe-scatter.html | Scatter example |
| http://localhost:4173/docs/ | HTML handbook |
| http://localhost:4173/docs/chart-catalog.md | Markdown (raw text in the browser) |

The example pages `fetch()` JSON. Opening a chart HTML file with
`file://` will fail that fetch. Use the HTTP server.

## Refresh extracted data

```bash
node examples/scripts/extract-dashboard-data.js
node examples/scripts/test-foot-stats.js
node examples/scripts/summarize-data.js
```

The extractor reads `js/index.js`, `draw1.js`, and `draw2.js` only.

## Dashboard assets the examples do not need

The isolated pages use `js/echarts.min.js` and their own stylesheet.
They do not load jQuery, `flexible.js`, or the video-wall background
images. The live dashboard still needs `css/index.css`, `images/`,
and `font/DS-DIGIT.TTF`.
