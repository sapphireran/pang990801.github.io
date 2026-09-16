# Source atlas

A map of the personal dashboard: every script tag, every IIFE, and the leftover files that never mount.

## What the browser actually loads

From `index.html`, in order:

| # | Tag | Role |
| --- | --- | --- |
| 1 | `js/macarons.js` | ECharts theme registration. Loaded in `<head>`, never passed to `echarts.init`. |
| 2 | `css/index.css` | Layout, header, panel chrome, unused `.map1/.map2/.map3` decorations |
| 3 | inline clock | Writes `.showTime` once a second |
| 4 | `js/flexible.js` | `rem` scaling for the 1920-style layout |
| 5 | `js/jquery.js` | Used by `js/click.js` and a dead year-toggle in the first IIFE |
| 6 | `js/echarts.js` **and** `js/echarts.min.js` | Two full ECharts builds. Instances come from whichever `echarts` global wins |
| 7 | `js/index.js` | Five IIFEs → five live charts |
| 8 | `js/click.js` | Tab highlighters for selectors that do not exist in `index.html` |

Commented out, so they do **not** run:

```html
<!-- <script src="js/china.js"></script> -->
<!-- <script src="js/myMap.js"></script> -->
```

Never referenced:

| File | What it contains |
| --- | --- |
| `draw1.js` | Plantar pressure line + donut (`option = {…}` at global scope) |
| `draw2.js` | Soft-tissue thickness bars + “um” line |
| `index_new.css` | Alternate stylesheet |
| `js/macarons.json` | Theme as JSON; `macarons.js` is the one that executes |
| `font/液晶数字.TTF` | Named in CSS, **file is missing**. Only `font/DS-DIGIT.TTF` is present |

## Live IIFEs in `js/index.js`

| Order | Comment in source | DOM host | Chart | Dataset |
| --- | --- | --- | --- | --- |
| 1 | `柱状图1模块` | `.bar .chart` | Scatter, dark theme, `backgroundColor: rgba(27,116,163,0.3)` | `data/height-shoe.json` |
| 2 | `折线图定制` | `.line .chart` | Dual pictorial bars + gap line | `data/age-foot-length.json` |
| 3 | `学习进度柱状图模块` | `.bar1 .chart` | Dual area lines + two donuts | `data/bmi-shape.json` |
| 4 | `折线图 优秀作品` | `.line1 .chart` | Timeline pie, `autoPlay: 2000` | `data/foot-symmetry.json` |
| 5 | (uncommented) | `.map .chart` | Radar, **no** `'dark'` theme | `data/radar-growth.json` |

The first IIFE still binds `$(".bar h2").on("click", "a", …)` to swap in dummy `[200, 300, …]` year series. The panel heading has no `<a>` children, so that handler never fires. The 2019/2020 arrays are leftover from an earlier bar chart.

## Panel titles vs. series names

| Visible `<h2>` | Series names inside ECharts |
| --- | --- |
| 男童女童身高与鞋码的关系 | `女性`, `男性` (not 女童/男童) |
| 男童女童年龄与脚长的关系 | `女生脚长（cm）`, `男生脚长（cm）`, `女生脚长与男生脚长之差` |
| 儿童BMI与脚的胖瘦度关系 | `女生脚胖瘦度`, `男生脚胖瘦度` plus two unnamed pies |
| 儿童双脚比例 | `双脚相同`, `左脚比右脚大10-20%`, `左脚比右脚大20%以上`, `右脚比左脚大20%以上`, `右脚比左脚大10-20%` |
| (no heading; center column) | `9岁` … `12岁` on 身高 / 兜跟围长 / 跗骨围长 / 跖趾围长 / 鞋码 / 脚长 / 体重 |

## Files that look like a China map but are not on screen

`js/myMap.js` still starts with `echarts.init(document.querySelector(".map .chart"))` and a `geoCoordMap` of Chinese cities. The live fifth IIFE **reuses the same selector** for the radar. If `myMap.js` were uncommented after `index.js`, it would overwrite the radar. If it were loaded first, the radar would overwrite the map. Either way the current page is radar-only.

The CSS still defines `.map .map1`, `.map2`, `.map3` rotating overlays (`images/map.png`, `lbx.png`, `jt.png`). Those nodes are not in `index.html`, so the decorations never appear.

## Nav hrefs as committed on `master`

| Label | `href` | Note |
| --- | --- | --- |
| 首页 | `https://scuscientia.github.io/.` | External classmate/lab hub |
| 儿童脚型 | `https://pang990801.github.io/` | Apex user site; the working Pages URL for *this* repo is `/pang990801.github.io/` |
| 畸形足或病足 | `https://ytep-zhi.github.io/` | External |
| 联系我们 | `mailto:1127235750@qq.com` | Personal mailbox from the original upload |

This branch adds two local links (说明, 实验室) and points 儿童脚型 at `./` so the tab stays on the dashboard while previewing.

## Dead CSS / font notes

- `@font-face datamsg` points at `../font/液晶数字.TTF`, which is not in the repo.
- `electronicFont` → `DS-DIGIT.TTF` is present, but the dashboard headings do not use it.
- `index_new.css` is an unused restyle.

## Suggested reading order

1. This atlas — so you know which IIFE you are looking at.
2. [`formulas.md`](formulas.md) — for the generated pie and the OLS fit.
3. [`display-caveats.md`](display-caveats.md) — before trusting a label.
4. Then open a lab page and load the matching JSON.
