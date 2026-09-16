# 中国人群脚型数据可视化

Personal GitHub Pages project by [Sapphire Ran](https://github.com/sapphireran).  
Live dashboard: [pang990801.github.io](https://pang990801.github.io/)

This repository is a **personal** visualization notebook. It is not a product, clinic tool, or company codebase. Charts reuse the original ECharts panels from the children's foot-shape dashboard and add a documentation hub plus standalone examples so the same series can be read, reused, and remixed without opening the full-screen cockpit.

## What the dashboard shows

The homepage (`index.html`) is a five-panel cockpit:

| Panel | Question it answers |
| --- | --- |
| Height × shoe size scatter | How boys' and girls' stature tracks with shoe length |
| Age × foot length bars + gap line | How mean foot length grows from age 6–14, and when the sex gap flips |
| Growth radar | Relative scores for height, three girths, shoe size, foot length, and weight at ages 9–12 |
| BMI × length/width ratio | How body mass index sits next to a simple “fat/thin foot” ratio |
| Left/right timeline pie | How often the two feet are treated as the same size across ages 2–14 |

Two extra drafts live at the repo root (`draw1.js`, `draw2.js`): plantar pressure traces and plantar soft-tissue thickness. Those drafts were never wired into the homepage. The new examples gallery turns them into pages you can open.

## Repository map

```
.
├── index.html              Dashboard shell
├── css/                    Dashboard styles (compiled CSS + Less source)
├── js/                     ECharts, jQuery, flexible rem scaler, chart options
├── images/                 Cockpit chrome (header, map ornaments, scanlines)
├── font/                   Digital clock face
├── draw1.js / draw2.js     Unused draft option objects
├── docs/                   Written notes: architecture, charts, data, styling
└── examples/               Standalone pages + JSON extracted from the charts
```

## Read the notes

- [Documentation hub](docs/index.html) — browseable on GitHub Pages
- [Architecture](docs/architecture.md)
- [Chart catalog](docs/charts.md)
- [Data dictionary](docs/data-dictionary.md)
- [Styling notes](docs/styling.md)
- [Measurement notes](docs/measurement-notes.md)
- [Examples guide](docs/examples-guide.md)

## Open the examples

Each example is a self-contained HTML page. They load `js/echarts.min.js` from this repo and fetch JSON from `examples/data/`.

| Page | Source series |
| --- | --- |
| [Examples gallery](examples/index.html) | Index of all seven demos |
| [Plantar pressure](examples/plantar-pressure.html) | `draw1.js` |
| [Tissue thickness](examples/tissue-thickness.html) | `draw2.js` |
| [Height × shoe size](examples/height-shoe.html) | Left-top scatter |
| [Age × foot length](examples/age-foot-length.html) | Left-bottom bars |
| [BMI × foot shape](examples/bmi-foot-shape.html) | Right-top combo |
| [Foot symmetry](examples/foot-symmetry.html) | Right-bottom timeline |
| [Growth radar](examples/growth-radar.html) | Center radar |

## Local preview

Any static server works. From the repo root:

```bash
python3 -m http.server 4173
```

Then open:

- http://127.0.0.1:4173/
- http://127.0.0.1:4173/docs/
- http://127.0.0.1:4173/examples/

The original dashboard expects a wide viewport (the CSS floor is 1024px). Example pages are written to stay readable on a laptop window.

## How a chart is built

Every homepage panel follows the same IIFE pattern in `js/index.js`:

1. `echarts.init(document.querySelector(".panel .chart"), "dark")`
2. Build an `option` object (series, axes, tooltip, visual extras)
3. `myChart.setOption(option)`
4. `window.addEventListener("resize", myChart.resize)`

Example pages keep that contract but load data with `fetch()` so the numbers live in JSON instead of being pasted into the option object.

## Data caution

Numbers on this site are **illustrative personal-study series**. They are useful for layout, interaction, and storytelling practice. They are not a substitute for a measured anthropometric survey, a shoe-last standard, or medical advice. See [measurement notes](docs/measurement-notes.md) for what each series is and is not.

## Stack

- Plain HTML / CSS / Less
- [ECharts](https://echarts.apache.org/) (vendored under `js/`)
- jQuery (nav helpers on the homepage only)
- `flexible.js` rem scaler for the cockpit header

No build step. No package manager. GitHub Pages serves the files as-is.
