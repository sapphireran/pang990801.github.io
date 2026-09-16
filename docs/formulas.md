# Formulas

Every expression the personal dashboard (or the extractor) actually uses. No extra epidemiology models.

## 1. Height → shoe length (ordinary least squares)

The live scatter does **not** draw a regression line. It only marks min / max / average and a vertical guide at `x = 115` (female) or `x = 110` (male).

The extractor fits OLS on the same points and writes it to `data/height-shoe.json`:

\[
\text{shoe\_cm} \approx a \cdot \text{height\_cm} + b
\]

| Group | n | *r* | *a* (cm/cm) | *b* (cm) |
| --- | ---: | ---: | ---: | ---: |
| Female | 199 | 0.9135 | 0.14088 | 0.2989 |
| Male | 199 | 0.9156 | 0.14334 | −0.0650 |
| Pooled | 398 | 0.9157 | 0.14235 | 0.0863 |

Pearson *r* is the usual product-moment coefficient. The lab correlation page also plots residuals \( y_i - (a x_i + b) \).

Rough check: a 120 cm child is predicted around 17.2 cm of shoe length on the pooled line.

## 2. Age-group gap

The third series on the age chart is already stored, but it is just subtraction:

\[
\Delta_t = \text{girl\_length}_t - \text{boy\_length}_t
\]

Values (cm): `0.28, 0.48, 0.40, 0.33, 0.08, −0.03, −0.15, −0.33, −0.50` for ages 6–14.

Sign change between 10 and 11 is the crossover called out in `data/age-foot-length.json`.

## 3. BMI panel rings

ECharts donuts use two values: the coloured slice and a “占位” placeholder. The printed `{d} %` is:

\[
p = \frac{v}{v + v_{\text{placeholder}}}
\]

| Ring | *v* | placeholder | *p* |
| --- | ---: | ---: | ---: |
| 过瘦脚 | 50 | 180 | 21.74% |
| 过胖脚 | 435 | 2400 | 15.34% |

Those four numbers are literals. They are not counts of points in the BMI line series.

## 4. Left / right mix (timeline pie)

`js/index.js` builds 13 frames with **natural** log (`Math.log`):

```text
i = 0 … 12          # 2岁 … 14岁
a = round(36 − 13 ln(i+1))   # left 10–20% larger
b = round(17 −  6 ln(i+1))   # left >20%
c = round(11 −  4 ln(i+1))   # right >20%
d = round(27 − 10 ln(i+1))   # right 10–20%
same = 63 + a + b + c + d
```

`round` here is JavaScript `Math.round` (half away from zero for these values; the Python extractor uses the same `round()` on these floats).

Worked frame for `2岁` (`i = 0`, `ln(1) = 0`):

- a = 36, b = 17, c = 11, d = 27
- same = 63 + 91 = 154
- total = 154 + 91 = 245
- same share = 62.86%

Worked frame for `14岁` (`i = 12`, `ln(13) ≈ 2.5649`):

- a = 3, b = 2, c = 1, d = 1
- same = 70
- total = 77
- same share = 90.91%

The pie therefore **tightens toward “same size”** as age increases because the four log terms shrink. It is a display generator, not a stored survey.

The lab symmetry page lets you type *i* and see the five slices.

## 5. Radar cell that is an expression

Most radar cells are literals. Two `12岁` cells are written as JS expressions:

```js
[84, 45, 55, 70, 77-6, 79-8, 79]
//                  71     71
```

`data/radar-growth.json` stores the evaluated `71, 71`.

## 6. `draw2.js` delta that is *not* a formula

If the “差值:um” line were derived, each point would be

\[
(\text{diabetic\_mm} - \text{typical\_mm}) \times 1000
\]

None of the 14 points match. Example, site 1: `(13.2 − 11.6) × 1000 = 1600`, but the line stores `16`. Site 6: `(13 − 10.4) × 1000 = 2600`, line stores `26`. It looks like the millimetre difference with a wrong unit label, **except** several sites still fail that reading too (site 4: 0.9 mm vs stored 9 — that one fits ×10; site 12: 0.3 mm vs stored 3). Do not recompute one series from the other.

## 7. Clock

The header clock is local wall time:

```text
当前时间：{year}年{month}月{day}-{hour}时{minute}分{second}秒
```

No timezone conversion. The sample string `2020年3月17-0时54分14秒` is only the HTML placeholder.

## 8. Flexible layout

`js/flexible.js` scales `html` font-size from viewport width so `rem` rules in `css/index.css` track a 1920-wide design. The lab pages do **not** use `flexible.js`; they use ordinary `px` / `clamp` so they stay readable on a laptop.
