# 儿童脚型数据可视化（个人 GitHub Pages）

个人练习用的 ECharts 大屏，仓库是 [pang990801.github.io](https://pang990801.github.io/)。
首页仍是 2020 年的深色四宫格；现在补上了说明、可单独打开的示例，以及从原 option 里抽出来的 JSON。

这不是公司项目，也不是临床工具。

## 打开什么

| 地址 | 内容 |
| --- | --- |
| `/` | 原来的大屏 |
| [`/docs/`](docs/index.html) | 测量说明、数据字典、图目录 |
| [`/examples/`](examples/index.html) | 七张单图示例 |
| [`/data/`](data/README.md) | 共用数据集 |

本地预览：

```bash
python3 -m http.server 4173
```

然后打开 <http://127.0.0.1:4173/docs/> 和 <http://127.0.0.1:4173/examples/>。
直接用 `file://` 打开说明页时，依赖 `fetch` 的字典和示例会失败。

## 首页五张图

1. **身高 × 鞋长** 散点，男女各 199 人。
2. **年龄 × 平均脚长** 柱 + 差值折线，6–14 岁。
3. **BMI × 脚胖瘦指数** 折线。
4. **左右脚是否同码** 时间轴饼图，2–14 岁（公式生成）。
5. **9–12 岁雷达**：身高、三种围长、鞋码、脚长、体重（0–100 分）。

`draw1.js` / `draw2.js` 里的成人足底压力和皮下厚度没有挂在首页，示例里可以单独看。

## 校验抽出的数据

```bash
python3 scripts/export-datasets.py
python3 scripts/build-example-pages.py
node tests/validate-data.js
node tests/validate-options.js
```

`validate-data.js` 会对照 `js/index.js` 里的数组，确认 JSON 没有漂。
`js/stats.js` 提供均值、Pearson r、差值过零年龄等，给示例页顶部的摘要数字用。

## 目录

```
css/docs.css            说明 / 示例的共用样式
data/*.json             抽出的数据集
docs/                   说明站点
examples/               单图示例
js/charts/options.js    示例用的 ECharts option 工厂
js/stats.js             浏览器和 Node 都能用的摘要函数
scripts/                重新导出 JSON、生成示例 HTML
tests/                  不依赖浏览器的校验
```

首页的 `js/index.js` 先保持原样，避免 GitHub Pages 大屏视觉被顺手改掉。
