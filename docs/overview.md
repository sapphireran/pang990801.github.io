# 项目说明

大屏标题是「中国人群脚型数据可视化」，实际主视图是**儿童脚型**。导航上的「儿童脚型」指向本站；「首页」「畸形足或病足」指向当时一起做的另外两个 GitHub Pages，不在这个仓库里。

## 这一页在干什么

把已经收进 `js/index.js` 的测量结果摊开，让身高、年龄、BMI、左右脚差异可以同时看。布局模仿常见数据大屏：顶栏时间、三列面板、中间一张更大的雷达图。

它适合：

- 看儿童期脚长、鞋码和围度是不是一起涨
- 对比男生、女生在同一年龄段的脚长差
- 把一张图单独拆到 `examples/` 里改配置

它不适合：

- 给某个孩子选鞋或做诊断
- 当作全国儿童脚型普查
- 和现行鞋号国标逐号对照（图里鞋码轴用的是厘米长度，不是欧码/US 码）

## 页面骨架

`index.html` 从上到下是：

1. **顶栏** — 标题 + 本地时钟（`setTimeout` 每秒刷新）
2. **导航** — 外链首页 / 本页 / 病足页 / mailto
3. **三列 `section.mainbox`**
   - 左：身高×鞋码散点，年龄×脚长柱线
   - 中：9–12 岁雷达
   - 右：BMI×胖瘦度，双脚比例时间轴饼图

图表容器都是 `.panel .chart` 或 `.map .chart`。`js/index.js` 用 `document.querySelector` 找到这些节点后 `echarts.init`。选择器写死了，新增面板要同时改 HTML 和对应 IIFE。

脚本加载顺序：

1. `flexible.js` — 按视口改 `html` 字号，大屏用 rem
2. `jquery.js` — 导航和高亮（`js/click.js`）
3. `echarts.js` 与 `echarts.min.js` — 历史原因两份都引入了；示例页只引 min 版
4. `index.js` — 五张图的 option
5. `click.js` — 导航 tab 行为（大屏目前主要是外链，这段基本闲置）

`draw1.js`、`draw2.js` 是足底压力和皮下厚度草图，没有挂到 `index.html`。示例馆里有一页把它们画出来，避免仓库里两份 option 没有着落。

## 和示例馆的关系

| 大屏选择器 | 示例页 |
| --- | --- |
| `.bar .chart` | `examples/scatter-height-shoe.html` |
| `.line .chart` | `examples/age-foot-length.html` |
| `.bar1 .chart` | `examples/bmi-foot-shape.html` |
| `.line1 .chart` | `examples/foot-symmetry.html` |
| `.map .chart` | `examples/radar-growth.html` |
| `draw1.js` / `draw2.js` | `examples/plantar-sketches.html` |
| （共享数据） | `examples/data-tables.html` |

示例页共用 `examples/js/example-data.js` 和 `examples/js/chart-helpers.js`。改数时优先改 `example-data.js`，大屏 `js/index.js` 仍是当时的内联数组；两边数字应对齐，不一致时以 `example-data.js` 的注释为准。
