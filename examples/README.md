# 图表示例

单页版本的个人大屏图，方便改一份 option 而不打开整张 `index.html`。

在仓库**根目录**开静态服务器后再访问这些路径：

| 页 | 图 |
| --- | --- |
| [index.html](index.html) | 目录 |
| [scatter-height-shoe.html](scatter-height-shoe.html) | 身高 × 鞋码 |
| [age-foot-length.html](age-foot-length.html) | 年龄 × 脚长 |
| [bmi-foot-shape.html](bmi-foot-shape.html) | BMI × 胖瘦度 |
| [foot-symmetry.html](foot-symmetry.html) | 双脚比例 |
| [radar-growth.html](radar-growth.html) | 生长雷达 |
| [plantar-sketches.html](plantar-sketches.html) | 足底草图 |
| [data-tables.html](data-tables.html) | 从共享数据生成的核对表 |

共享文件：

- `js/example-data.js` — 和大屏对齐的展示数组
- `js/chart-helpers.js` — init / resize / 备注
- `js/render-charts.js` — option 组装
- `css/examples.css` — 文档风布局

新加一页按 [docs/adding-an-example.md](../docs/adding-an-example.md) 做。
