# Examples

Standalone pages for every series on the personal children's foot-shape dashboard, plus the two unused adult sketches.

Open [index.html](index.html) on GitHub Pages, or run a static server from the repository root and visit `/examples/`.

## Pages

| Page | Series | Extra control |
| --- | --- | --- |
| [height-shoe-size.html](height-shoe-size.html) | 398-point scatter | Girl / boy filter |
| [age-foot-length.html](age-foot-length.html) | Age 6–14 means | Toggle difference line |
| [bmi-foot-ratio.html](bmi-foot-ratio.html) | BMI slenderness | Sex filter |
| [radar-growth.html](radar-growth.html) | Ages 9–12 radar | Per-age toggles |
| [left-right-asymmetry.html](left-right-asymmetry.html) | Timeline pie | Year select + pause |
| [plantar-pressure.html](plantar-pressure.html) | `draw1.js` | Typical / diabetic filter |
| [tissue-thickness.html](tissue-thickness.html) | `draw2.js` | Toggle display track |

## Data

`data/` holds CSV, JSON, and `window.ExampleData` copies. Recreate them with:

```bash
python3 scripts/extract_example_data.py
```

Chart modules live in `js/`. Shared helpers are `js/common.js`. Styles are `css/examples.css` (also used by `docs/index.html`).
