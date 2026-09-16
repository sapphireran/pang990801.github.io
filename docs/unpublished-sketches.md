# Unpublished sketches

`draw1.js` and `draw2.js` sit at the repository root. They assign a
global `option` the way the ECharts gallery examples do. Nothing in
`index.html` includes them, so visitors never see these plots unless
they open the example pages.

## Plantar pressure (`draw1.js`)

- Title: 足部压力数据图(单位: Pa)
- X: 位点一 … 位点七
- Series: 正常人群, 糖尿病足人群
- Extra: a decorative ring titled 统计数据来源 / 用户来源分析
- JSON: `examples/data/plantar-pressure.json`
- Example: `examples/charts/plantar-pressure.html`

Stored typical series: `[90, 50, 39, 50, 120, 82, 80]`

Stored diabetic-foot series: `[290, 200, 20, 132, 15, 200, 90]`

The legend also lists `潍V`, but no series uses that name.

## Plantar thickness (`draw2.js`)

- Title: 足底各位点皮下组织厚度数据图
- X: 位点1 … 位点14 (built by a small loop)
- Bars: typical adult mm, diabetic-foot adult mm
- Line: `差值:um` (see the unit note in [measurements.md](measurements.md))
- JSON: `examples/data/plantar-thickness.json`
- Example: `examples/charts/plantar-thickness.html`

Typical mm: `[11.6, 12.3, 12.1, 13.7, 12.6, 10.4, 12.2, 11.6, 13.2, 12.9, 11.4, 13.4, 10.2, 11.5]`

Diabetic-foot mm: `[13.2, 13.6, 12.9, 14.6, 14.9, 13, 15.7, 16.1, 14.2, 15.8, 15.9, 13.7, 12.9, 14.9]`

Difference (as stored): `[16, 13, 8, 9, 23, 26, 35, 45, 10, 29, 45, 3, 27, 34]`

The draft file enables `dataZoom` and stacks the first bar series as
`总量` even though the second bar is not stacked with it.

## Why keep them

They are the only plantar-site plots in the repo. The example pages
mount them with the same dark theme as the other isolated charts so
the drafts can be compared next to the live dashboard without pasting
the option objects back into `index.html`.
