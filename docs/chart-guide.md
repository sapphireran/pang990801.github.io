# 读图与复用

大屏五张图都在 `js/index.js` 的独立 IIFE 里。示例页把数据和 option 拆开，方便只开一张图。

## 共用约定

- 主题：大屏多数 `echarts.init(el, 'dark')`；中间雷达没写主题，靠自己的配色。
- 背景：面板用半透明蓝 `rgba(33,64,112,0.3)` 一类，叠在 `images/bg.jpg` 上。
- 缩放：每个 IIFE 都 `window.addEventListener('resize', chart.resize)`。示例里由 `bindChartResize(chart)` 做同一件事。
- 选择器：大屏写死 `.bar .chart` 这种 class。示例页用 `#chart`，避免和别的面板撞车。

`examples/js/chart-helpers.js` 提供：

| 函数 | 作用 |
| --- | --- |
| `createChart(elOrSelector, theme)` | `echarts.init`，缺节点就抛错 |
| `bindChartResize(chart)` | 监听 window resize |
| `mountNotes(el, lines)` | 把说明列表画到图下方 |
| `fmt(n, digits)` | 固定小数，给 tooltip 用 |
| `linearGradient(echarts, stops, dir)` | 少写一点 `graphic.LinearGradient` |

## 1. 身高 × 鞋码散点

大屏：`.bar`。示例：`examples/scatter-height-shoe.html`。

要点：

- `type: 'scatter'`，`symbolSize: 4`
- tooltip 用 `value.length > 1` 区分点和轴上的标线
- 女 `#ff4f3b`，男 `#ffe01f`
- `toolbox` 开了 `dataZoom`、`brush`、`saveAsImage`

改点：动 `exampleData.heightShoe.female` / `.male`，每项是 `[heightCm, shoeCm]`。

## 2. 年龄 × 脚长柱 + 差值线

大屏：`.line`（名字是 line，主体是 bar）。示例：`examples/age-foot-length.html`。

要点：

- 每个性别两层：`bar` + `pictorialBar` 菱形帽
- `barGap: 0`，两组并排
- 差值走 `yAxisIndex: 1`，可以过零
- 柱宽 25，菱形 `symbolOffset` 要和柱宽一起改，否则帽会歪

渐变停在 `exampleData.palette.cyanBar` / `.blueBar`，和大屏同一组色。

## 3. BMI × 胖瘦度 + 示意环

大屏：`.bar1`。示例：`examples/bmi-foot-shape.html`。

要点：

- 主图是 `grid` 里的双折线，`boundaryGap: false`
- 两个 `pie` 用 `center` 钉在图的右侧，不占 grid
- 环的「占位」扇区关掉 tooltip，只当底色

改环：`exampleData.bmiShape.rings.thin` / `.heavy`，字段是 `{ value, rest, label }`。

## 4. 双脚比例时间轴饼

大屏：`.line1`。示例：`examples/foot-symmetry.html`。

要点：

- `baseOption.timeline` + `options[]`，每岁一份 `series.data`
- `autoPlay: true`，`playInterval: 2000`
- 颜色顺序要和五类名称稳定对应，否则图例会错位

重算：`exampleData.buildSymmetryByAge(ages, coeffs)`。默认系数和大屏公式一致。

## 5. 生长雷达

大屏：`.map .chart`（历史名字是 map，实际不是地图）。示例：`examples/radar-growth.html`。

要点：

- `radar.indicator` 七项，`max: 100`
- `shape: 'circle'`，`radius` 在大屏里偏大（255），单页要按容器缩小，否则会裁切
- 每岁一条 `series.data`，带线性透明的 `areaStyle`

`js/myMap.js` + `js/china.js` 是另一套迁徙地图草稿，大屏里已注释掉。不要和这张雷达混在一个 option 里。

## 6. 足底草图

`draw1.js` / `draw2.js` 用的是全局 `option = {...}`，依赖 gallery 式环境。示例页 `examples/plantar-sketches.html` 改成 `setOption`，左右各一张。

复用时注意：

- `draw2` 的 `areaStyle` 用了 `echarts.graphic.LinearGradient`，必须在 ECharts 加载之后求值
- 差值单位标注和数组数量级对不上，见 [data-notes.md](data-notes.md)

## 从示例拷回大屏

1. 在示例页把 option 调到满意。
2. 把 `series.data` 写回 `js/index.js` 对应 IIFE，或改成读 `exampleData`（大屏目前还没这么改，避免一次动太多历史脚本）。
3. 核对选择器：`.bar` / `.line` / `.bar1` / `.line1` / `.map`。
4. 大屏依赖 `flexible.js` 的 rem；示例页用普通 px 高度（420–520），不要把 rem 高度直接贴进示例。

## 主题和字体

大屏 `css/index.css` 声明了 `electronicFont`（`font/DS-DIGIT.TTF`），用在数字条而不是 ECharts 轴。ECharts 轴字默认走系统字体。示例页用系统无衬线，保证文档页在没加载 TTF 时也可读。
