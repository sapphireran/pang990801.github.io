# 本地预览

仓库没有打包步骤。图表脚本按相对路径引本地文件，用静态服务器打开最稳妥。

## 推荐

在仓库根目录：

```bash
python3 -m http.server 4173
```

| 地址 | 内容 |
| --- | --- |
| http://127.0.0.1:4173/ | 儿童脚型大屏 |
| http://127.0.0.1:4173/docs/ | 文档首页（HTML） |
| http://127.0.0.1:4173/docs/overview.html | 项目说明 |
| http://127.0.0.1:4173/examples/ | 单图目录 |
| http://127.0.0.1:4173/examples/scatter-height-shoe.html | 身高 × 鞋码 |

`examples/*.html` 使用：

```html
<script src="../js/echarts.min.js"></script>
<script src="./js/example-data.js"></script>
<script src="./js/chart-helpers.js"></script>
```

所以**不要**只对 `examples/` 开服务器根目录，否则 `../js/echarts.min.js` 会 404，图是空白的。

## 直接双击 HTML

`file://` 在部分浏览器里能开大屏（脚本都是相对路径），但：

- 个别浏览器会拦本地模块或控制台报跨源
- 你不容易看出是路径错了还是 option 错了

有空白图时，先用静态服务器再判断。

## 空白图时看什么

1. 控制台是否有 `echarts is not defined` — 脚本路径错，或还没加载完就 init。
2. 容器高度是不是 0 — 大屏靠 rem 和 `.chart { height: 6rem }`；示例页必须给 `#chart` 明确像素高度。
3. 选择器是否还在用 `.bar .chart` — 示例页只有 `#chart`。
4. 是否只开了 `examples/` 当根路径。
5. `flexible.js` 只服务大屏。示例页不需要它；强行引入且没按大屏结构写 CSS，布局会乱。

## 改样式怎么预览

大屏正式样式是 `css/index.css`。`css/index.less` 是同一套的 Less 源。改完 Less 需要自己编译回 CSS；本仓库没有提交编译脚本。只改一处时优先改 `index.css`，避免两份长期分叉。

`index_new.css` 是另一版实验样式（固定 1200×1024），大屏没引用。不要以为改它首页会变。

## GitHub Pages

仓库名 `pang990801.github.io`，`master` 根目录即站点根。`docs/` 和 `examples/` 会变成：

- `https://pang990801.github.io/docs/`
- `https://pang990801.github.io/examples/`

新增 HTML 用相对路径，不要写死 `localhost` 或本机绝对路径。
