# Local preview

GitHub Pages will serve this repo as a static site. For local work, use a tiny HTTP server so `fetch('../data/…')` on the example pages is allowed.

## From the repo root

Python 3:

```bash
python3 -m http.server 4173
```

Then open:

| Page | URL |
| --- | --- |
| Home dashboard | <http://127.0.0.1:4173/index.html> |
| HTML guide | <http://127.0.0.1:4173/docs/guide.html> |
| Docs index | <http://127.0.0.1:4173/docs/README.md> (raw markdown; prefer `guide.html`) |
| Example gallery | <http://127.0.0.1:4173/examples/index.html> |
| One chart | <http://127.0.0.1:4173/examples/height-shoe-size.html> |

`npx serve .` or any other static server is fine. The port number is not special.

## What to click when checking a change

1. **Home** — all five charts paint, the clock ticks, 文档 / 示例 nav links resolve.
2. **Guide** — sidebar jumps to each section; “Open example” links hit the matching HTML.
3. **Gallery** — each card opens a page whose chart matches the dashboard (or the `draw1` / `draw2` sketch).
4. **Resize** — drag the window; charts should refill their boxes (each page calls `echarts.resize`).
5. **Narrow window** — example pages should wrap; the home dashboard may sprout a horizontal scroll (it is a 1024px-min composition).

## file:// will disappoint you

If you double-click `examples/age-radar.html`, the browser may block `fetch('../data/age-radar.json')`. Use the static server. The home dashboard does not fetch JSON, so `file://index.html` can still show charts — that difference is easy to misread as “examples are broken.”

## No install

There is no `package.json` on purpose. ECharts and jQuery are vendored under `js/`. Do not add a bundler unless you are ready to change how Pages is published.
