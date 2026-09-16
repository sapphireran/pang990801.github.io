# Chart catalog

Technical map of every visualization that belongs to this personal dashboard: **live panels** on `index.html`, plus **unmounted sketches**. Units and series names match the scripts as they exist today.

## How to use this catalog

1. Find the panel by the Chinese title on the page.
2. Note the **host selector** — that is the `.chart` node `echarts.init` binds to.
3. Edit data only in the **source file** listed. There is no JSON/CSV feed.

All live charts live in `js/index.js`. Each chart is an IIFE that calls `echarts.init`, `setOption`, and `window.addEventListener("resize", …)`.

## Live charts (loaded by `index.html`)

### A. Height vs shoe size

| Field | Value |
| --- | --- |
| On-page title | 男童女童身高与鞋码的关系 |
| Host | `.bar .chart` |
| Theme | `dark` |
| Type | Scatter (`type: 'scatter'`) |
| Source | `js/index.js` — first IIFE |

**Axes**

| Axis | Name in option | Unit shown |
| --- | --- | --- |
| X | 身高 | cm |
| Y | 鞋码 | cm (tooltip also says 鞋码) |

**Series**

| `series.name` | Color (approx.) | Meaning |
| --- | --- | --- |
| 女性 | `#ff4f3b` | Girls: `[heightCm, shoeCm]` pairs |
| 男性 | `#ffe01f` | Boys: `[heightCm, shoeCm]` pairs |

**Decorations**

- `markArea`: dashed min–max box per sex (女性分布区间 / 男性分布区间)
- `markPoint`: max and min
- `markLine`: average, plus vertical `xAxis: 115` (girls) and `xAxis: 110` (boys)
- Toolbox: `dataZoom`, `brush` (rect / polygon / clear), `saveAsImage`

**Dead click handler:** `$(".bar h2").on("click", "a", …)` would replace `series[0].data` from `dataAll` years `2019` / `2020`. Those `<a>` tags are not in `index.html`, and `dataAll` is count-like `[200, 300, …]`, not scatter pairs — do not wire it without rewriting the data.

---

### B. Age vs foot length

| Field | Value |
| --- | --- |
| On-page title | 男童女童年龄与脚长的关系 |
| Host | `.line .chart` |
| Theme | `dark` |
| Types | `bar` + `pictorialBar` (diamond caps) + `line` |
| Source | `js/index.js` — second IIFE |

**Category X:** `6, 7, 8, 9, 10, 11, 12, 13, 14` (age in years)

**Series (values in cm except the difference line)**

| Age | 女生脚长（cm） | 男生脚长（cm） | 女生脚长与男生脚长之差 |
| ---: | ---: | ---: | ---: |
| 6 | 18.55 | 18.27 | 0.28 |
| 7 | 20.24 | 19.76 | 0.48 |
| 8 | 21.01 | 20.61 | 0.40 |
| 9 | 20.34 | 20.01 | 0.33 |
| 10 | 20.83 | 20.75 | 0.08 |
| 11 | 21.29 | 21.32 | −0.03 |
| 12 | 21.83 | 21.98 | −0.15 |
| 13 | 22.36 | 22.69 | −0.33 |
| 14 | 22.66 | 23.16 | −0.50 |

The difference series uses `yAxisIndex: 1` (second value axis). Diamond pictorial bars repeat the same length arrays as the solid bars; they are caps, not extra measurements.

---

### C. Age radar (center)

| Field | Value |
| --- | --- |
| On-page title | *(none — empty `.map` column)* |
| Host | `.map .chart` |
| Theme | default (no `'dark'` argument) |
| Type | Radar (`type: 'radar'`) |
| Source | `js/index.js` — last IIFE |

**Indicators** (each `max: 100` — **normalized scores**, not raw lab units)

1. 身高
2. 兜跟围长
3. 跗骨围长
4. 跖趾围长
5. 鞋码
6. 脚长
7. 体重

**Embedded scores**

| Age | 身高 | 兜跟围长 | 跗骨围长 | 跖趾围长 | 鞋码 | 脚长 | 体重 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 9岁 | 43 | 29 | 37 | 37 | 38 | 31 | 41 |
| 10岁 | 53 | 32 | 42 | 46 | 43 | 42 | 49 |
| 11岁 | 66 | 37 | 47 | 60 | 57 | 59 | 65 |
| 12岁 | 84 | 45 | 55 | 70 | 71 | 71 | 79 |

Note: the 12岁 shoe-size and foot-length entries are written as `77-6` and `79-8` in source (JavaScript arithmetic → 71 and 71).

Legend colors: 9岁 `#00c2ff`, 10岁 `#f9cf67`, 11岁 `#32CD32`, 12岁 `#e92b77`.

**Not used here:** `js/china.js` and `js/myMap.js` (commented out in `index.html`). CSS still has decorative `.map1` / `.map2` / `.map3` ring rules, but those nodes are not in the current HTML, so only the radar canvas shows.

---

### D. BMI vs foot plumpness

| Field | Value |
| --- | --- |
| On-page title | 儿童BMI与脚的胖瘦度关系 |
| Host | `.bar1 .chart` |
| Theme | `dark` |
| Types | Smooth `line` + two donut `pie`s |
| Source | `js/index.js` — third IIFE |

**X:** BMI `12` … `24`  
**Y name:** 脚胖瘦度（脚长/脚宽） with `min: 20`

**Line series**

| BMI | 女生脚胖瘦度 | 男生脚胖瘦度 |
| ---: | ---: | ---: |
| 12 | 22.97 | 25.28 |
| 13 | 23.38 | 22.97 |
| 14 | 26.51 | 28.47 |
| 15 | 24.47 | 26.90 |
| 16 | 25.96 | 28.03 |
| 17 | 26.22 | 26.07 |
| 18 | 26.66 | 26.76 |
| 19 | 26.92 | 30.18 |
| 20 | 27.82 | 26.63 |
| 21 | 26.35 | 30.38 |
| 22 | 27.51 | 30.13 |
| 23 | 29.86 | 28.07 |
| 24 | 28.67 | 30.19 |

**Pies** (fixed; not filtered by BMI hover)

| Ring | Visible label | Values in source | Implied share |
| --- | --- | --- | --- |
| Upper (`center` 83%, 33%) | 过瘦脚占比 | 50 vs 180 placeholder | 50 / 230 ≈ 21.7% |
| Lower (`center` 83%, 72%) | 过胖脚占比 | 435 vs 2400 placeholder | 435 / 2835 ≈ 15.3% |

The pie slice name `用户来源分析` is leftover gallery text. Only the formatter labels (过瘦 / 过胖) are meant to be read.

---

### E. Bilateral foot proportion

| Field | Value |
| --- | --- |
| On-page title | 儿童双脚比例 |
| Host | `.line1 .chart` |
| Theme | `dark` |
| Type | Timeline pie (`baseOption` + `options`) |
| Source | `js/index.js` — fourth IIFE |

**Timeline:** `2岁` … `14岁`  
**Autoplay:** `true`, `playInterval: 2000` (ms)

For each age index `i` (0-based), the script sets:

```text
a = round(36 − 13·ln(i+1))   → 左脚比右脚大10-20%
b = round(17 − 6·ln(i+1))    → 左脚比右脚大20%以上
c = round(11 − 4·ln(i+1))    → 右脚比左脚大20%以上
d = round(27 − 10·ln(i+1))   → 右脚比左脚大10-20%
双脚相同 = 63 + a + b + c + d
```

`Math.log` in JavaScript is the natural log. These are **generated demo shares**, not a table imported from a spreadsheet.

---

## Unmounted sketches (not on the live page)

These files define a global `option` for the ECharts editor / copy-paste. `index.html` does **not** load them.

### `draw1.js` — plantar pressure

- Title: 足部压力数据图(单位: Pa)
- Types: two smooth lines + one donut
- X: 位点一 … 位点七
- Series: 正常人群 `[90, 50, 39, 50, 120, 82, 80]`, 糖尿病足人群 `[290, 200, 20, 132, 15, 200, 90]`
- Legend also lists `潍V` with no matching series
- Pie labels still say 用户来源分析 / 正常人群 (gallery leftovers)

### `draw2.js` — plantar subcutaneous thickness

- Title: 足底各位点皮下组织厚度数据图
- X: 位点1 … 位点14 (built by a loop)
- Bars: 正常人群(成年)数据:mm and 糖尿病足人群(成年)数据:mm
- Line: 差值:um (values look like tens, not micrometre-scale)
- Includes `dataZoom` sliders

To show either sketch, you would add a host `<div class="chart">`, load the file **after** ECharts, and `echarts.init(…).setOption(option)`. See [MAINTENANCE.md](MAINTENANCE.md).

## Script load order (`index.html`)

1. `js/macarons.js` (in `<head>`)
2. Inline clock script
3. `js/flexible.js`
4. `js/jquery.js`
5. `js/echarts.js`
6. `js/echarts.min.js` (second ECharts copy)
7. `js/index.js` — **creates all five live charts**
8. `js/click.js`

`china.js` and `myMap.js` stay commented. Loading **both** `echarts.js` and `echarts.min.js` is redundant; the second file wins if it replaces `window.echarts`.

## CSS hosts

| Panel class | Role |
| --- | --- |
| `.panel.bar` | Height / shoe scatter |
| `.panel.line` | Age / foot-length combo |
| `.map` | Center radar |
| `.panel.bar1` | BMI / plumpness + pies |
| `.panel.line1` | Bilateral timeline pie |
| `.chart` | Empty box each `echarts.init` fills |

Panel chrome (corners, `images/line(1).png`) is decorative and does not encode data.
