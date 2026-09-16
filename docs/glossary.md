# Glossary

Terms that appear on the personal dashboard, with the English used in these notes and the lab pages.

| 中文 on the page | English in the notes | Where it lives | Meaning in *this* project |
| --- | --- | --- | --- |
| 脚型 | foot shape | site title | Outline and proportion of the foot, not a clinical diagnosis |
| 鞋码 | shoe size / shoe length | scatter, radar | Tooltip prints `鞋码：… cm`. Treat the number as a length in centimetres, not a Chinese, EU, or UK size code |
| 脚长 | foot length | age bars, radar | Heel-to-longest-toe length in centimetres |
| 脚宽 | foot width | BMI y-axis label | Mentioned only as the denominator of 脚长/脚宽 |
| 脚胖瘦度 | stoutness / slenderness | BMI panel | The stored series (~23–30). Not a standard anthropometric index |
| 双脚比例 | left/right mix | timeline pie | Share of generated counts in five buckets |
| 双脚相同 | same-size pair | pie slice | `63 + a + b + c + d` from the log formula |
| 兜跟围长 | heel / counter girth | radar axis | Display score 0–100 |
| 跗骨围长 | tarsal girth | radar axis | Display score 0–100 |
| 跖趾围长 | ball / MPJ girth | radar axis | Display score 0–100 |
| 位点 | plantar site | `draw1.js`, `draw2.js` | Numbered points on the sole. No coordinate map is stored |
| 正常人群 | typical group | leftover sketches | Adult comparison series in the unmounted files |
| 糖尿病足人群 | diabetic-foot group | leftover sketches | Adult comparison series; not used by the children’s dashboard |
| 过瘦脚 / 过胖脚 | thin / thick foot | BMI donuts | Ring percents from placeholder arithmetic, not from the line series |
| 男童 / 女童 | boy / girl | panel titles | Series inside the charts say 男生/女生 or 男性/女性 |
| 身高 | stature | scatter x, radar | Centimetres in the scatter; 0–100 score on the radar |
| 体重 | body mass | radar | 0–100 score, no kilogram table |

## Age labels

| Written | Numeric age used in JSON |
| --- | --- |
| `2岁` … `14岁` | 2 … 14 (`foot-symmetry.json`) |
| category `[6, 7, …, 14]` | 6 … 14 (`age-foot-length.json`) |
| legend `9岁` … `12岁` | 9 … 12 (`radar-growth.json`) |

There is no per-child age on the 398-point scatter. Those points are only `(height_cm, shoe_length_cm)`.

## Sex labels

The scatter legend is `女性` / `男性`. The age and BMI series use `女生` / `男生`. The `<h2>` titles say 男童 / 女童. Same two groups, three wordings.

## “Display score” vs. “measurement”

A **measurement** in these notes is a number whose unit is written next to a real dimension (cm, mm, Pa, kg/m²).

A **display score** is already scaled into a chart range. Radar values such as `43, 29, 37, …` are display scores. Do not convert them back to centimetres without a scale table — the repo does not ship one.
