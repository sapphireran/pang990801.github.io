# Usage notes

How to **read and operate** this personal dashboard. For series names and file locations, use [CHARTS.md](CHARTS.md). For editing and publishing, use [MAINTENANCE.md](MAINTENANCE.md).

## 1. Open the dashboard

### Published copy

1. In a desktop browser, open [https://pang990801.github.io/](https://pang990801.github.io/).
2. Give the page a **wide window** (1024px or wider). The layout uses rem units from viewport width and is not a mobile app.
3. Wait until all five panels draw. Charts are created in `js/index.js` after jQuery and ECharts load.

If a panel is empty, do a hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`). Scripts are loaded from this same origin; there is no API to fail.

### Local copy

From the repository root:

```bash
python3 -m http.server 8080
```

Open [http://127.0.0.1:8080/](http://127.0.0.1:8080/). Stop the server with `Ctrl+C`.

You should see:

- Dark background (`images/bg.jpg`) and a header bar (`images/head_bg.png`)
- Title **中国人群脚型数据可视化**
- A clock on the right of the header
- Four nav links under the header
- Five charts in a three-column board

## 2. Header clock

The header script in `index.html` writes `当前时间：YYYY年M月D-H时M分S秒` every second.

- It uses the **browser's local timezone**, not a server clock.
- Reloading the page restarts the timer; there is no pause control.
- The font family `electronicFont` is `font/DS-DIGIT.TTF`. If that file is missing, the clock still updates; only the typeface falls back.

## 3. Navigation row

The four links are ordinary `<a>` tags. They do **not** swap charts inside this page.

| You click | What happens |
| --- | --- |
| 首页 | Opens the related personal home in the **same tab** (`target="_self"`) |
| 儿童脚型 | Reloads this dashboard |
| 畸形足或病足 | Opens the related personal page in the same tab |
| 联系我们 | Opens the default mail client to `1127235750@qq.com` |

`js/click.js` still listens for `.index_nav ul li` clicks and leftover tab selectors (`.tabs`, `.index_tabs`). The current `index.html` nav uses `<a>` elements, not those `<li>` tabs, so most of `click.js` is inactive. You can ignore it while viewing.

## 4. How to read each panel

### 4.1 Height vs shoe size (left top)

**Title:** 男童女童身高与鞋码的关系

- **X:** height in cm  
- **Y:** shoe size in cm (the tooltip also labels it 鞋码)  
- **Red points:** 女性 (girls)  
- **Yellow points:** 男性 (boys)

**What you can do:**

| Action | Result |
| --- | --- |
| Hover a point | Tooltip: series name, 身高, 鞋码 |
| Drag a box / use toolbox **dataZoom** | Zoom into a cluster |
| Toolbox **brush** (rect / polygon / clear) | Select a region of points |
| Toolbox **save as image** | Download the current view as a PNG |
| Hover the dashed box | The dashed rectangle is the min–max **distribution range** for that sex (markArea), not a click target |
| Look for max / min marks | ECharts markPoints on each series |
| Solid mark lines | Series average, plus a vertical line at 115 cm (girls) or 110 cm (boys) |

There is leftover jQuery that would swap series data if `<a>` year links existed inside the panel `<h2>`. Those links are **not** in the current HTML, so the scatter does not change year.

### 4.2 Age vs foot length (left bottom)

**Title:** 男童女童年龄与脚长的关系

- **X:** ages **6 through 14** (integer labels)
- **Left Y:** foot length in cm
- **Cyan / teal bars + diamond caps:** 女生脚长（cm）
- **Blue bars + diamond caps:** 男生脚长（cm）
- **Bright line + area:** 女生脚长与男生脚长之差 (girl length minus boy length)

**What you can do:**

- Hover a bar or line point for the exact value.
- Positive difference = girls longer on average at that age; negative = boys longer. In the embedded series the sign **flips around age 11**.
- Resize the window: the chart calls `resize()` on `window.resize`.

### 4.3 Radar (center)

There is **no panel title** in the HTML; the center column is a large `.map` host. The live chart is a **radar**, not a geographic map (`js/china.js` / `js/myMap.js` are commented out).

**Legend (bottom):** 9岁, 10岁, 11岁, 12岁 — click a name to hide or show that age.

**Axes (each scaled 0–100 in the chart, not raw cm/kg):**

1. 身高 (height)
2. 兜跟围长 (heel girth)
3. 跗骨围长 (tarsal girth)
4. 跖趾围长 (metatarsophalangeal girth)
5. 鞋码 (shoe size)
6. 脚长 (foot length)
7. 体重 (weight)

**What you can do:**

- Compare the four filled polygons. Values grow with age in the embedded series.
- Click legend items if the overlay is hard to read.
- These scores are **chart-normalized**, not laboratory units. Do not treat `43` on 身高 as 43 cm.

### 4.4 BMI vs foot plumpness (right top)

**Title:** 儿童BMI与脚的胖瘦度关系

- **X:** BMI categories **12 through 24**
- **Y:** 脚胖瘦度, documented in the axis name as 脚长/脚宽 (length / width)
- **Pink line + fill:** 女生脚胖瘦度
- **Cyan line + fill:** 男生脚胖瘦度
- **Upper ring:** share labeled 过瘦脚占比
- **Lower ring:** share labeled 过胖脚占比

**What you can do:**

- Hover the lines for BMI vs plumpness.
- Read the two rings as **share illustrations** (values are fixed in `js/index.js`), not as a live filter of the line chart.
- Hovering a ring shows ECharts pie tooltips; the leftover series name `用户来源分析` is an old template string and is not a second dataset.

### 4.5 Left / right foot proportion (right bottom)

**Title:** 儿童双脚比例

This is a **timeline pie**. Ages run **2岁 through 14岁**. The playhead advances about every **2 seconds** (`playInterval: 2000`) and **autoPlay is on**.

Slices (colors follow the series order in `js/index.js`):

| Slice name | Meaning |
| --- | --- |
| 双脚相同 | Left and right similar |
| 左脚比右脚大10-20% | Left 10–20% larger than right |
| 左脚比右脚大20%以上 | Left more than 20% larger |
| 右脚比左脚大20%以上 | Right more than 20% larger |
| 右脚比左脚大10-20% | Right 10–20% larger than left |

**What you can do:**

- Watch autoplay, or **click a year on the timeline** to jump.
- Hover a slice for its value.
- There is no pause button in the page chrome; use the ECharts timeline controls (click a year, or click the play state if the theme shows it).

The per-age slice sizes are generated in `js/index.js` from a small log formula, then offset so “双脚相同” stays the largest share. Treat them as **demo proportions**, not a published prevalence table.

## 5. Toolbox and theme

- Most live charts use ECharts **`dark`** theme via `echarts.init(..., 'dark')`.
- `js/macarons.js` is loaded in `<head>` but the live inits pass `'dark'`, so Macarons is not the active theme.
- Only the height–shoe scatter exposes the full toolbox (zoom, brush, save image). Other panels hide or omit it.

## 6. Keyboard, print, and accessibility

- There is **no search, login, or form**.
- Charts are canvas / SVG from ECharts; screen readers will not get a full data table. Use [CHARTS.md](CHARTS.md) and `js/index.js` if you need the numbers in text.
- Printing: use the browser print dialog. Dark backgrounds may waste ink; the scatter toolbox “save as image” is the intended export for that one panel.

## 7. Related pages from this dashboard

If you follow 首页 or 畸形足或病足, you leave this repository's site. Those URLs are other personal GitHub Pages projects. Coming back: open 儿童脚型 or this repo's Pages URL again.

## 8. What this page is not

- Not a shoe-size calculator
- Not a clinic intake form
- Not a live query of a measurement database
- Not the unused sketches in `draw1.js` (足部压力) or `draw2.js` (足底皮下组织厚度) — those files are **not** mounted on `index.html`

If you expected plantar-pressure or tissue-thickness charts, they exist only as standalone option objects in those two files. See [MAINTENANCE.md](MAINTENANCE.md) if you want to attach them later.
