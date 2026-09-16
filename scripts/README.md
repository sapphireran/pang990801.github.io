# Scripts

Python 3 only. No pip packages.

| Script | Role |
| --- | --- |
| `extract_data.py` | Parse chart JS → `data/*.json`, `examples/js/datasets.js`, `docs/generated-stats.md` |
| `validate_data.py` | Count / range / identity checks |

```bash
python3 scripts/extract_data.py
python3 scripts/validate_data.py
```

The extract parser is a tiny JS-literal reader: numbers, single- or
double-quoted strings, arrays, objects. It does not run JavaScript.
Radar values that were written as `77-6` are supplied in Python as
71 so the archive matches what ECharts evaluated.

If a check fails, fix the source array or the assertion — do not
weaken a range just to go green.
