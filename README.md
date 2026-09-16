# Children's foot-shape dashboard

Personal GitHub Pages project: a dark, ECharts-based dashboard that plots
illustrative children's foot-shape series. The live page is
[pang990801.github.io](https://pang990801.github.io/).

This is a personal study visualization. The numbers on the charts are the
series already hardcoded in `js/index.js`, `draw1.js`, and `draw2.js`. They
are not a clinical dataset and they are not medical advice.

## What is on the dashboard

The home page (`index.html`) is a three-column layout:

| Region | Panel title | Chart |
| --- | --- | --- |
| Left | 男童女童身高与鞋码的关系 | Height vs shoe-length scatter |
| Left | 男童女童年龄与脚长的关系 | Age vs mean foot length |
| Center | (no title) | Age 9–12 radar of seven scaled measures |
| Right | 儿童BMI与脚的胖瘦度关系 | BMI vs a displayed plumpness index |
| Right | 儿童双脚比例 | Auto-playing left/right symmetry pies |

Two draft option files, `draw1.js` and `draw2.js`, are **not** mounted on
the live page. Working copies of those sketches live under `examples/`.

## Preview locally

The site is static. From the repository root:

```bash
python3 -m http.server 4173
```

Then open:

- Dashboard: <http://localhost:4173/>
- Example gallery: <http://localhost:4173/examples/>
- Personal notes: <http://localhost:4173/docs/>

More detail is in [docs/local-preview.md](docs/local-preview.md).

## Documentation and examples

| Path | What it is |
| --- | --- |
| [docs/](docs/) | Personal notes: layout, measurements, data caveats, unpublished sketches |
| [examples/](examples/) | Standalone chart pages plus JSON extracted from this repo |
| [examples/scripts/](examples/scripts/) | Extractor, stats checks, and a printed data summary |

Re-extract the JSON from the dashboard source (does not change the live page):

```bash
node examples/scripts/extract-dashboard-data.js
node examples/scripts/test-foot-stats.js
node examples/scripts/summarize-data.js
```

## Repository layout

```
index.html            Live dashboard shell
css/index.css         Dashboard layout (compiled feel; source-ish twin is index.less)
js/index.js           The five live ECharts option blocks
js/flexible.js        rem scaling (1rem = viewport width / 24)
js/click.js           Unused tab-highlight helpers
draw1.js / draw2.js   Unmounted plantar sketches
examples/             Isolated pages that load examples/data/*.json
docs/                 Written notes for this personal project
```

Vendor libraries (`js/echarts.js`, `js/echarts.min.js`, `js/jquery.js`,
`js/china.js`) are included as-is so the Pages site stays self-contained.
