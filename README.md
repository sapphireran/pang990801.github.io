# Chinese Children's Foot-Shape Visualization

Personal GitHub Pages dashboard for browsing **children's foot-shape measurements** (儿童脚型). The live page is a static HTML / CSS / JavaScript screen: five ECharts panels, a live clock, and links to related personal pages.

This repository is **personal only**. It is not a company product, not a backend service, and not a dataset API. Chart numbers are **embedded in the page scripts** so the site can be opened with no build step and no database.

- **Published page (works today):** [https://sapphireran.github.io/pang990801.github.io/](https://sapphireran.github.io/pang990801.github.io/)
- **This repository:** [https://github.com/sapphireran/pang990801.github.io](https://github.com/sapphireran/pang990801.github.io)
- **On-page title:** 中国人群脚型数据可视化 (data visualization of foot shape in a Chinese population)
- **This page's topic:** 儿童脚型 (children's foot shape)

The header nav still points 儿童脚型 at [https://pang990801.github.io/](https://pang990801.github.io/) (the old user-site host). That host currently returns GitHub’s **Pages 404**. Use the `sapphireran.github.io/pang990801.github.io` URL, or open a local server from this repo.

GitHub Pages is configured for this repository (`has_pages: true`) with **source branch `gh-pages`**. That branch is **not** on the remote anymore (only `master` is). The published HTML is a leftover build (Last-Modified **2020-05-24**). Merging docs or chart edits into `master` does **not** refresh the live URL until Pages is pointed at `master` or `gh-pages` is restored. Details: [docs/MAINTENANCE.md](docs/MAINTENANCE.md#publish-on-github-pages).

## What you see on the page

The header shows the title and a **current-time** clock (`当前时间`), updated once per second.

A small nav row links out of this page:

| Label (as shown) | Destination |
| --- | --- |
| 首页 | Related personal home: [scuscientia.github.io](https://scuscientia.github.io/) |
| 儿童脚型 | Intended as this dashboard; href is still `https://pang990801.github.io/` and **404s**. Use the sapphireran project Pages URL instead. |
| 畸形足或病足 | Related personal page: [ytep-zhi.github.io](https://ytep-zhi.github.io/) |
| 联系我们 | Mail link `1127235750@qq.com` |

The main board is three columns:

1. **Left**
   - 男童女童身高与鞋码的关系 — scatter of height vs shoe size for girls and boys
   - 男童女童年龄与脚长的关系 — foot length by age (6–14) plus the girl–boy difference
2. **Center**
   - Radar of body / foot measures for ages 9, 10, 11, and 12
3. **Right**
   - 儿童BMI与脚的胖瘦度关系 — BMI vs foot plumpness (length / width), with share pies
   - 儿童双脚比例 — left/right foot-size categories by age, auto-playing timeline

For how to *use* each chart (hover, zoom, brush, timeline), see [docs/USAGE.md](docs/USAGE.md).  
For series names, units, and the file/selector that owns each panel, see [docs/CHARTS.md](docs/CHARTS.md).  
For local edits and GitHub Pages notes, see [docs/MAINTENANCE.md](docs/MAINTENANCE.md).

## Open it locally (no install)

The site is static. Do **not** open `index.html` as a `file://` URL if you later add modules or fetch(); a tiny local server is the reliable habit.

From the repository root:

```bash
python3 -m http.server 8080
```

Then visit [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

Any other static server in this folder works the same way (`npx serve`, Caddy, nginx). There is no `npm install`, no bundler, and no environment file.

**Layout note:** the dashboard is built for a **wide desktop** (about 1024px and up). `js/flexible.js` sets `1rem` from the viewport width. Narrow windows will look cramped; use a large window or zoom out.

## Repository layout

```
.
├── index.html          # Page shell: header, nav, five chart hosts
├── index_new.css       # Unused draft stylesheet (not linked)
├── draw1.js            # Standalone ECharts sketch (plantar pressure). Not loaded.
├── draw2.js            # Standalone ECharts sketch (plantar tissue thickness). Not loaded.
├── css/
│   ├── index.css       # Live stylesheet (linked from index.html)
│   └── index.less      # Source-style copy of the layout (not compiled at runtime)
├── js/
│   ├── index.js        # All five live charts and their embedded data
│   ├── click.js        # Nav / tab click helpers (mostly leftover selectors)
│   ├── flexible.js     # rem-based viewport scaling
│   ├── jquery.js       # Required by index.js and click.js
│   ├── echarts.js      # Full ECharts build
│   ├── echarts.min.js  # Minified ECharts (also loaded)
│   ├── macarons.js     # ECharts theme (loaded in <head>)
│   ├── china.js        # China geo map helper — commented out in index.html
│   └── myMap.js        # Geo flow-map sketch — commented out in index.html
├── images/             # Background, header, decorative map rings
├── font/               # Digital clock face (DS-DIGIT.TTF)
└── docs/               # Usage, chart catalog, maintenance notes
```

## Related personal pages

These are **separate personal sites**, linked from the nav. They are not folders in this repo.

- Home / 首页: https://scuscientia.github.io/
- Children's foot shape / 儿童脚型: https://sapphireran.github.io/pang990801.github.io/ (this project; the nav’s pang990801.github.io href currently 404s)
- Deformed or pathological foot / 畸形足或病足: https://ytep-zhi.github.io/

## License and data caution

There is no license file in this repository. Treat the page as a **personal visualization**, not as a clinical tool and not as a published dataset.

- Numbers in `js/index.js`, `draw1.js`, and `draw2.js` are **illustrative chart inputs** baked into the scripts.
- Do not use the dashboard for diagnosis, shoe prescription, or research citation without independently sourced measurements.
- Do not commit secrets; this project has none and needs none.

## Docs map

| Document | Use it when you want to… |
| --- | --- |
| [docs/USAGE.md](docs/USAGE.md) | View the live page, read the clock and nav, and operate each chart |
| [docs/CHARTS.md](docs/CHARTS.md) | Match a panel to its DOM selector, series, units, and source file |
| [docs/MAINTENANCE.md](docs/MAINTENANCE.md) | Serve locally, edit data, know which files are live vs leftover |
