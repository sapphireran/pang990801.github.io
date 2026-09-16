# Local preview

How to look at this personal Pages repo on a laptop without pushing to `master`.

## Why a static server

The dashboard itself is plain files and will open from `file://`. The example pages load `examples/data/*.js` the same way, so they also work from disk.

A local server is still the better path:

- Paths in the docs hub are site-root relative (`../examples/...`) and match GitHub Pages.
- Browser security warnings on ES modules or future `fetch()` calls stay out of the way.
- `flexible.js` sizes `rem` from `document.documentElement.clientWidth`. Some browsers report odd widths on `file://`.

## Python

From the repository root:

```bash
python3 -m http.server 4173
```

Then:

| Page | URL |
| --- | --- |
| Dashboard | http://127.0.0.1:4173/ |
| Docs hub | http://127.0.0.1:4173/docs/ |
| Examples hub | http://127.0.0.1:4173/examples/ |
| One example | http://127.0.0.1:4173/examples/height-shoe-size.html |
| A CSV | http://127.0.0.1:4173/examples/data/age-foot-length.csv |

Any free port works. 4173 is only a habit so it does not collide with 8000 / 5500 Live Server.

## Other static servers

```bash
npx --yes serve -l 4173
```

or, if `php` is around:

```bash
php -S 127.0.0.1:4173
```

Do not point the server at `docs/` or `examples/` as the root. Relative links to `js/echarts.min.js` assume the repository root is `/`.

## Refreshing datasets

Example tables are generated, not hand-copied.

```bash
python3 scripts/extract_example_data.py
```

The script reads:

- `js/index.js` for the girl/boy scatter
- hardcoded means that match the other four homepage series
- `draw1.js` / `draw2.js` comments plus the known landmark arrays

It writes CSV, JSON, and JS into `examples/data/`. Commit those outputs with the chart change so GitHub Pages stays consistent.

## Editing styles

Dashboard CSS lives in two places:

| File | Used by the browser? |
| --- | --- |
| `css/index.css` | Yes (`index.html` links it) |
| `css/index.less` | No, source sketch |
| `index_new.css` | No, unused experiment |

Change `css/index.css` for anything that should appear on the live dashboard. Example pages use `examples/css/examples.css` and do not inherit the rem/flexible layout.

## Fonts and images

`font/DS-DIGIT.TTF` is the clock-style face reserved for the unused `.no-hd` counters. The homepage clock is ordinary system text.

Background assets:

- `images/bg.jpg` — full-page backdrop
- `images/head_bg.png` — header bar
- `images/line(1).png` — panel texture
- `images/map.png`, `lbx.png`, `jt.png` — leftover rotating map decorations

Example pages do not load those images. They use a flat navy gradient so the notes stay readable.

## Checks before a push

1. Dashboard still shows five charts, no blank panels.
2. Clock in the header still ticks.
3. Docs hub links resolve.
4. Each example page draws a chart and a table.
5. `python3 scripts/extract_example_data.py` is a no-op if sources did not change.

No test runner is wired up. These pages are static.

## GitHub Pages

The site is a user Pages repo (`<user>.github.io`). Files at the repository root are published as `/`. A `docs/` folder is just another directory, not the Pages source root.

After merge to `master`, expect:

- `/` → dashboard
- `/docs/` → documentation hub
- `/examples/` → example hub
