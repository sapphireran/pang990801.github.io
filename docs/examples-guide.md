# Examples guide

Standalone pages live in `../examples/`. Each page is one question, one chart, one JSON file (sometimes two). They exist so a chart can be opened without the cockpit's rem layout and so the series can be reused in another sketch.

The documentation hub cards open `read.html?f=…` so GitHub Pages renders these notes instead of serving raw Markdown. The `.md` sources stay next to that reader.

## Why not iframe the homepage?

The homepage is a 1920-class composition. Four of the five charts fight for height; the radar borrows a `.map` box. Iframes clip, `flexible.js` resizes the wrong root, and a reader cannot see the caveat next to the series. A dedicated page fixes that.

## File contract

```
examples/
  index.html              gallery
  css/examples.css        shared chrome
  js/chart-theme.js       palette + fetch helper + mount helper
  js/<name>.js            one chart
  <name>.html             shell + sidebar
  data/<name>.json        series
```

HTML does three things:

1. Shared header / nav / footer
2. A `.chart-well` div with a stable id
3. A sidebar of “what you are seeing” + the measurement caveat

JS does four things:

1. `FootTheme.fetchJson(path)`
2. Build an ECharts option from that object
3. `FootTheme.mount(id, option)`
4. Bind resize

No jQuery. No global `option =`.

## Theme helper (`js/chart-theme.js`)

`FootTheme.colors` is the palette copied from the cockpit so a screenshot of an example still matches the original panel.

`FootTheme.fetchJson` is a thin `fetch` + `json()` with an error banner if you opened the HTML as a `file://` URL. GitHub Pages and `python3 -m http.server` both satisfy CORS-same-origin for these files.

`FootTheme.mount(id, option)` inits ECharts with a dark background, sets the option, and stores the instance on the element so a later page can call `resize` or `setOption` again.

## Adding a page

1. Drop JSON in `data/`.
2. Write `js/my-chart.js` that exports nothing and calls `mount` on `DOMContentLoaded`.
3. Copy `height-shoe.html`, change the title, caveat, and script src.
4. Add a card on `index.html`.
5. Add a row to `docs/charts.md`.

Keep the caveat. If the series is decorative, say so in the first sentence of the sidebar.

## Paths

Examples use relative paths:

```html
<script src="../js/echarts.min.js"></script>
<script src="js/chart-theme.js"></script>
<script src="js/height-shoe.js"></script>
```

```js
FootTheme.fetchJson("data/height-shoe-female.json")
```

That works on GitHub Pages (`/examples/height-shoe.html`) and on a local static server. It does not work from `file://` because `fetch` is blocked.

## Homepage vs example differences

| Topic | Homepage | Example |
| --- | --- | --- |
| Theme | `echarts.init(el, "dark")` | explicit `backgroundColor` |
| Data | inline arrays | JSON |
| Layout | rem cockpit | flex document |
| Caveat | none | sidebar |
| jQuery | yes | no |
| Timeline autoplay | yes (symmetry) | yes, but pause control in the option toolbox when ECharts provides it |

The numeric series should stay aligned. Visual extras (diamond bar caps, leftover year toggles, map ornaments) are optional on the example side.

## Testing a change

```bash
python3 -m http.server 4173
```

Open `/examples/`, click every card, hover a point, resize the window, and confirm the caveat is still the first paragraph in the sidebar. Then open `/` and confirm the cockpit still mounts five charts — example CSS must not leak.
