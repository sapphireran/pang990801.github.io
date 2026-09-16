# Example gallery

Standalone pages under [`examples/`](../examples/). Each reloads
`window.FOOT_DATA` from `examples/js/datasets.js` and the minified
ECharts already in this repo.

Open [`examples/index.html`](../examples/index.html) after
`python3 -m http.server`.

| Page | Dataset | What to try |
| --- | --- | --- |
| [Height × last scatter](../examples/height-shoe-scatter.html) | `heightShoe` | Brush a height band; compare to the HUD panel |
| [Age × foot length](../examples/age-foot-length.html) | `ageFoot` | Hover the girl−boy gap |
| [BMI × plumpness](../examples/bmi-foot-ratio.html) | `bmiFoot` | Read the two ring shares |
| [Growth radar](../examples/growth-radar.html) | `growthRadar` | Toggle ages in the legend |
| [Left / right timeline](../examples/bilateral-symmetry.html) | `bilateral` | Pause the timeline |
| [Plantar pressure](../examples/plantar-pressure.html) | `plantar` | First mount of `draw1.js` |
| [Tissue thickness](../examples/tissue-thickness.html) | `thickness` | First mount of `draw2.js` |
| [Last-length estimator](../examples/shoe-size-estimator.html) | `heightShoe` | Drag height; watch residual band |
| [Data explorer](../examples/data-explorer.html) | all | Filter tables, copy JSON |

## Shared files

- `examples/css/examples.css` — archive theme (ink / teal / coral)
- `examples/js/theme.js` — `FOOT_THEME.baseOption()` + helpers
- `examples/js/stats.js` — OLS / RMSE used by the estimator
- `examples/js/datasets.js` — generated; do not edit

## Estimator math

```
last_cm = slope * height_cm + intercept
mondopoint_mm = round(last_cm * 10)
allowance_mm = mondopoint_mm + 5
band = last_cm ± RMSE
```

Slopes come from the extracted stats, not from a new fit in the
browser. `stats.js` can recompute them if you want to show the
arithmetic.

## File URLs

Because `datasets.js` inlines JSON, opening an example via
`file://` still draws charts. Relative links back to `../docs/` also
work from a static server; they are rockier on `file://` depending
on the browser. Prefer `python3 -m http.server`.
