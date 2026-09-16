# Children's foot-shape dashboard

Personal GitHub Pages project for browsing children's foot measurements as a dark-theme ECharts dashboard.

Live site: [pang990801.github.io](https://pang990801.github.io/)

This repository is a personal visualization notebook. It is not a product, clinic tool, or company codebase. The charts remix classroom / self-study sketches of stature, shoe last length, age, BMI, girth, and left–right symmetry.

## What the homepage shows

The landing page (`index.html`) is a five-panel dashboard:

| Panel | Selector | Chart | Question it answers |
| --- | --- | --- | --- |
| 男童女童身高与鞋码的关系 | `.bar .chart` | Scatter | How shoe last length tracks stature for girls and boys |
| 男童女童年龄与脚长的关系 | `.line .chart` | Diamond bars + difference line | How mean foot length changes from age 6 to 14 |
| Center radar | `.map .chart` | Radar | How seven normalized traits grow from 9 to 12 |
| 儿童BMI与脚的胖瘦度关系 | `.bar1 .chart` | Area line + rings | How length/width ratio moves with BMI |
| 儿童双脚比例 | `.line1 .chart` | Timeline pie | How left/right size classes shift with age |

Unused sketch files `draw1.js` and `draw2.js` hold adult plantar-pressure and soft-tissue-thickness options. Those sketches now have standalone example pages so they are visible without pasting into the ECharts gallery.

## Repository layout

```
index.html              dashboard shell
css/                    dashboard styles (compiled + less source)
js/index.js             five live chart modules
js/echarts*.js          chart library
draw1.js / draw2.js     unused option sketches
docs/                   notes, data dictionary, chart catalog
examples/               standalone pages + downloadable datasets
scripts/                dataset extractors
```

## Read the notes

- [Documentation hub](docs/index.html)
- [Data dictionary](docs/data-dictionary.md)
- [How the measurements are defined](docs/measurements.md)
- [Chart catalog](docs/charts.md)
- [Local preview](docs/local-preview.md)

## Open the examples

- [Examples hub](examples/index.html)
- [Height vs shoe last](examples/height-shoe-size.html)
- [Age vs foot length](examples/age-foot-length.html)
- [BMI vs length/width](examples/bmi-foot-ratio.html)
- [Growth radar](examples/radar-growth.html)
- [Left / right timeline](examples/left-right-asymmetry.html)
- [Plantar pressure sketch](examples/plantar-pressure.html)
- [Tissue thickness sketch](examples/tissue-thickness.html)

Each example page loads the same series the dashboard uses, plus a table and a short reading note. CSV and JSON copies live in [`examples/data/`](examples/data/).

## Preview locally

GitHub Pages serves the repo root. Any static server from the repository root works:

```bash
python3 -m http.server 4173
```

Then open:

- http://127.0.0.1:4173/
- http://127.0.0.1:4173/docs/
- http://127.0.0.1:4173/examples/

Refresh the downloadable datasets after editing `js/index.js`, `draw1.js`, or `draw2.js`:

```bash
python3 scripts/extract_example_data.py
```

## Personal scope

Keep this repository personal. Do not copy company datasets, private clinic records, or work dashboards into it. Numbers on the dashboard are illustrative series used to practice ECharts layout, tooltips, and dark-theme composition.
