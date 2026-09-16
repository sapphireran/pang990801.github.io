# Project overview

This repository is the personal GitHub Pages site for **中国人群脚型数据可视化** (Chinese population foot-shape visualization), focused on **children’s** foot samples. The live page is a single-screen ECharts dashboard: four side panels plus a large center radar.

Personal URL: <https://pang990801.github.io/>

## Why the page exists

Children’s feet change quickly between toddler years and early teens. Height, shoe last length, girth, left/right symmetry, and BMI do not move on the same schedule. This site is a personal, visual notebook of those relationships:

- How **height** sits next to **shoe length** for girls and boys.
- How **mean foot length** by age compares across sexes, and when the difference line crosses zero.
- How a **BMI** category tracks a **length/width plumpness** index.
- How often **left and right feet** land in the same size band as age increases.
- How **normalized body and girth scores** look at ages 9, 10, 11, and 12.

Two extra personal sketches — plantar pressure and plantar soft-tissue thickness — lived as `draw1.js` / `draw2.js` and now have standalone example pages under [`../examples/`](../examples/).

## What this is not

- Not a hospital product, not a factory last CAD file, and not a peer-reviewed paper.
- Not advice for buying shoes, diagnosing deformity, or treating diabetic foot.
- Not a company codebase. Navigation links to classmate/personal sister pages (首页, 畸形足或病足) are kept as they were on the original header.

## How the live page is arranged

```
header          title + local clock
nav             首页 / 儿童脚型 / 畸形足或病足 / 联系我们 / 文档 / 示例
left column     height×shoe scatter, then age×foot-length bars
center column   7-axis radar for ages 9–12
right column    BMI×plumpness + slim/wide rings, then symmetry pie timeline
```

Layout, panel chrome, and rem scaling live in `css/index.css` (compiled notes in `css/index.less`). Chart option objects live in `js/index.js`. jQuery is only used for a leftover year-toggle hook and for building the symmetry timeline frames.

## Related personal pages

| Link on the original nav | Role |
| --- | --- |
| <https://scuscientia.github.io/.> | 首页 (personal/class hub) |
| <https://pang990801.github.io/> | This children’s foot-shape dashboard |
| <https://ytep-zhi.github.io/> | 畸形足或病足 sister page |
| `mailto:1127235750@qq.com` | Contact from the original header |

## Where to go next

- [`charts.md`](charts.md) — read each panel as a chart, not as a screenshot.
- [`measurements.md`](measurements.md) — Chinese measurement names and units.
- [`methodology.md`](methodology.md) — rem layout, ECharts themes, resize behavior.
- [`data-notes.md`](data-notes.md) — sample limits and honest caveats.
- [`local-preview.md`](local-preview.md) — serve the repo on localhost.
- [`guide.html`](guide.html) — the same material as a styled HTML page.
