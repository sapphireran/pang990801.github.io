#!/usr/bin/env python3
"""Generate standalone example HTML pages from the dataset catalog."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples"

PAGES = [
    {
        "id": "height-shoe-size",
        "file": "height-shoe-size.html",
        "toolbar": "",
    },
    {
        "id": "age-foot-length",
        "file": "age-foot-length.html",
        "toolbar": "",
    },
    {
        "id": "bmi-plumpness",
        "file": "bmi-plumpness.html",
        "toolbar": "",
    },
    {
        "id": "left-right-ratio",
        "file": "left-right-ratio.html",
        "toolbar": '<div id="age-toolbar" class="toolbar" aria-label="选择年龄"></div>',
    },
    {
        "id": "age-radar",
        "file": "age-radar.html",
        "toolbar": "",
    },
    {
        "id": "plantar-pressure",
        "file": "plantar-pressure.html",
        "toolbar": "",
    },
    {
        "id": "tissue-thickness",
        "file": "tissue-thickness.html",
        "toolbar": "",
    },
]


TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>示例 · {id}</title>
  <link rel="stylesheet" href="../css/docs.css" />
</head>
<body>
  <div id="site-nav"></div>
  <main class="wrap">
    <p class="page-lede"><a href="index.html">← 全部示例</a></p>
    <h1 class="page-title" id="chart-title">{id}</h1>
    <p class="page-lede" id="chart-lede">正在读取 JSON 数据集…</p>
    {toolbar}
    <div id="stats" class="stat-row"></div>
    <div class="chart-stage"><div id="chart" data-dataset="{id}"></div></div>
    <p class="callout" style="margin-top:20px">
      数据来自 <code>data/{id}.json</code>，图配置来自 <code>js/charts/options.js</code>。
      这是个人 GitHub Pages 示例，不是临床工具。
    </p>
  </main>
  <footer class="docs-foot">Personal notes for pang990801.github.io</footer>
  <script src="../js/docs-nav.js" data-root=".."></script>
  <script src="../js/echarts.min.js"></script>
  <script src="../js/stats.js"></script>
  <script src="../js/charts/options.js"></script>
  <script src="../js/data-loader.js"></script>
  <script src="boot.js"></script>
</body>
</html>
"""


def main() -> None:
    EXAMPLES.mkdir(parents=True, exist_ok=True)
    for page in PAGES:
        path = EXAMPLES / page["file"]
        path.write_text(TEMPLATE.format(**page), encoding="utf-8")
        print(f"wrote {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
