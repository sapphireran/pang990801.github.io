# 再加一张示例页

按这个清单加，目录页、数据和说明会一起齐。

## 1. 数据

能复用就加到 `examples/js/example-data.js` 的 `exampleData` 上，不要在页面里再贴一份长数组。

```js
exampleData.mySeries = {
  title: "短标题",
  x: [/* 轴 */],
  values: [/* 数 */],
  notes: ["一句读法", "一句限制"]
};
```

单位、是原始点还是分箱均值，写在对象旁边的注释里。字段含义跟 [data-notes.md](data-notes.md) 对齐。

## 2. 页面

复制现有 `examples/scatter-height-shoe.html`：

- `title`、`h1`、说明段改成新图的问题
- `#chart` 高度保持 420–560px
- 底部链回 `index.html` 和对应文档

脚本顺序不变：`echarts.min.js` → `example-data.js` → `chart-helpers.js` → 本页内联或 `examples/js/xxx.js`。

## 3. 目录卡片

在 `examples/index.html` 的卡片列表里加一项：标题、一句话、链到新 HTML。卡片顺序尽量跟大屏从左到右、从上到下一致，草图放最后。

## 4. 文档交叉引用

- `docs/overview.md` 的对照表加一行
- `docs/chart-guide.md` 加一小节（类型、关键 option、改数入口）
- 若有新字段，先写 `data-notes.md`

## 5. 自检

本地根目录开服务器后：

1. 目录页能点进新图
2. 图有数据，不是空坐标系
3. 缩浏览器窗口，图会 `resize`
4. tooltip 单位和文档一致
5. 没有用到公司仓库或内网脚本

## 不要做的

- 不要在示例页再引一份完整 `echarts.js`（已经有 min）
- 不要把大屏 rem 高度复制过来
- 不要把雷达相对分和厘米散点塞进同一个直角坐标系
- 不要为了「看起来更科学」编造没写进仓库的样本量
