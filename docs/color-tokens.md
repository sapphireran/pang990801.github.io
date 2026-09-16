# Color tokens

Copied from the personal dashboard so lab pages can stay in the same register without restyling `css/index.css`.

## Surfaces

| Token | Hex / rgba | Used for |
| --- | --- | --- |
| `--lab-bg` | `#061326` | Lab page background (dashboard uses `images/bg.jpg`) |
| `--lab-panel` | `rgba(33, 64, 112, 0.35)` | Cards; matches several chart `backgroundColor`s |
| `--lab-stroke` | `rgba(25, 186, 139, 0.35)` | Panel border, same family as `.panel` |
| `--lab-cyan` | `#02a6b5` | Corner brackets on `.panel::before` |
| `--lab-text` | `#e8f4ff` | Body copy |
| `--lab-muted` | `#8fb0c8` | Secondary copy |

## Series

| Token | Hex | Series |
| --- | --- | --- |
| `--female` | `#ff4f3b` | Scatter 女性 |
| `--male` | `#ffe01f` | Scatter 男性 |
| `--girl-bar` | `#28f0f5` → `#077175` | Age pictorial bar (girl) |
| `--boy-bar` | `#0172e2` → `#0f299a` | Age pictorial bar (boy) |
| `--gap-line` | `#3deaff` | Age Δ and male BMI area |
| `--girl-bmi` | `#ff69b4` | Female BMI area (`#FF69B4`) |
| `--ring-thin` | `#dc832c` | Thin-foot donut |
| `--ring-thick` | `#ff733f` | Thick-foot donut |
| `--same` | `#56c979` | 双脚相同 |
| `--left-mid` | `#5caff2` | Left 10–20% |
| `--left-high` | `#b6a2df` | Left >20% |
| `--right-high` | `#a96ec9` | Right >20% |
| `--right-mid` | `#2dc7c9` | Right 10–20% |
| `--radar-9` | `#00c2ff` | 9岁 |
| `--radar-10` | `#f9cf67` | 10岁 |
| `--radar-11` | `#32cd32` | 11岁 |
| `--radar-12` | `#e92b77` | 12岁 |
| `--pressure-typical` | `#a60bde` | `draw1.js` 正常人群 |
| `--pressure-diabetic` | `#ff733f` | `draw1.js` 糖尿病足人群 |
| `--thick-typical` | `#ff9080` | `draw2.js` typical bars |
| `--thick-diabetic` | `#00bfb7` | `draw2.js` diabetic bars |
| `--thick-line` | `#28ffb3` | `draw2.js` “um” line |

## Type

Dashboard headings are white 0.25 rem on a `flexible.js` scale. Lab pages use 16px body / 13px labels so they remain readable without the rem scaler.

The unused `@font-face electronicFont` (`DS-DIGIT.TTF`) is available if a lab heading wants the clock look. The missing `液晶数字.TTF` is not.
