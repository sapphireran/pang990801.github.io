# Plantar pressure and tissue-thickness sketches

`draw1.js` and `draw2.js` sat at the repository root without a page that loaded them. They are adult comparison sketches, not children's data, and they stay off the homepage.

The example pages mount cleaned options so the sketches can be opened in a browser instead of pasted into the ECharts gallery.

## Why they were left unused

Both files assign a top-level `option = { ... }`. That is the gallery convention. The homepage IIFEs instead call `echarts.init` and `setOption` themselves. Dropping `draw1.js` onto `index.html` would not draw anything unless some other script looked for a global `option`.

They also use a light mint / white background that fights `images/bg.jpg`.

## Pressure landmarks (`draw1.js`)

Seven ordinal sites, two lines, one decorative ring.

| Site | Typical (Pa) | Diabetic-foot (Pa) | Difference (Pa) |
| --- | ---: | ---: | ---: |
| 位点一 | 90 | 290 | +200 |
| 位点二 | 50 | 200 | +150 |
| 位点三 | 39 | 20 | −19 |
| 位点四 | 50 | 132 | +82 |
| 位点五 | 120 | 15 | −105 |
| 位点六 | 82 | 200 | +118 |
| 位点七 | 80 | 90 | +10 |

The typical line peaks at site 5. The diabetic-foot line peaks at site 1 and is almost empty at site 5. That inversion is the whole visual argument of the sketch: load moves off one landmark and onto others.

The ring on the right is labelled 正常人群 and is not derived from the seven values. Same decorative idea as the BMI rings on the homepage.

The original legend includes a leftover series name `潍V` with no series attached.

## Thickness landmarks (`draw2.js`)

Fourteen sites, two bar series, one area line.

Typical adults sit between 10.2 mm and 13.7 mm. Diabetic-foot adults sit between 12.9 mm and 16.1 mm. Every site is thicker in the second series.

The third series is labelled `差值:um` and does **not** equal `(diabetic_mm - typical_mm) * 1000`:

| Site | mm gap | Stored µm series |
| ---: | ---: | ---: |
| 1 | 1.6 | 16 |
| 6 | 2.6 | 26 |
| 8 | 4.5 | 45 |
| 12 | 0.3 | 3 |

The stored series is the millimetre gap × 10, plus a few rounding wiggles, not a true micrometre conversion. Keep the published label (µm) when cloning the sketch, and say in the caption that it is a display track.

`dataZoom` starts at 10–80, so the first and last sites are partly off-screen in the original option. The example page opens at 0–100 so all fourteen bars are visible, with the slider still available.

## How the example pages load them

The pages do not `eval` the gallery files. `scripts/extract_example_data.py` copies the arrays into `examples/data/*.js`, and the page modules build a dark-theme option around those arrays.

To compare with the raw gallery option, open the root files in an editor:

- [`../draw1.js`](../draw1.js)
- [`../draw2.js`](../draw2.js)

## What not to do with these sketches

- Do not add them to the children's dashboard as extra panels.
- Do not join site numbers to 兜跟 / 跗骨 / 跖趾. There is no shared map.
- Do not treat the pascal or millimetre values as measurements of a real person.
- Do not publish them as medical findings.

They exist here as personal chart-composition practice: combo line + ring, bar + zoom + area, and a second color story next to the children's navy dashboard.
