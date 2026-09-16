# Documentation hub

Personal notes for the children's foot-shape Pages site. These files explain the charts, the fields, and the leftover sketches. They are not a clinic manual.

## Start here

| Note | What it covers |
| --- | --- |
| [Data dictionary](data-dictionary.md) | Column names, units, sample sizes |
| [Measurement notes](measurements.md) | What stature, girth, and 脚胖瘦度 mean on this site |
| [Chart catalog](charts.md) | Every panel, selector, and ECharts type |
| [Growth reading notes](growth-notes.md) | How to read the age, radar, and scatter series |
| [Left / right timeline](left-right-asymmetry.md) | The log-decay pie, year by year |
| [Plantar sketches](plantar-pressure.md) | Unused `draw1.js` / `draw2.js` |
| [ECharts notes](echarts-notes.md) | Themes, pictorial bars, dual builds |
| [Local preview](local-preview.md) | `python3 -m http.server` and Pages paths |
| [Adding another example](adding-examples.md) | Extract script, page module, and smoke check |

A styled HTML index lives at [index.html](index.html) for browsing on GitHub Pages.

## Examples

Standalone pages that reuse the same series:

- [Examples hub](../examples/index.html)
- [Downloadable datasets](../examples/data/manifest.json)

## Regenerating tables

```bash
python3 scripts/extract_example_data.py
```

See [local-preview.md](local-preview.md) for the full loop.
