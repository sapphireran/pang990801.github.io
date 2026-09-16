# Companion examples

Serve from the **repository root**:

```bash
python3 -m http.server 4173
```

| Path | Pages |
| --- | --- |
| `/examples/` | Hub |
| `/examples/encodings/` | Density, slope, parallel, stacked area, BMI path, leftover dumbbell |
| `/examples/workbook/` | Quiz + worked OLS / crossover / symmetry |
| `/examples/tour/` | Annotated walk through the five original panels |

All browser pages load `js/companion-data.js` (generated) and the local `js/echarts.min.js`. They do not call a network chart CDN.
