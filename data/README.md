# Datasets

These JSON files are extracted from the original dashboard charts so
documentation and example pages can reuse the same numbers without
copying arrays out of `js/index.js` or the unused `draw1.js` /
`draw2.js` drafts.

All values are **illustrative personal-project samples**, not a
published clinical study. Treat them as teaching material for reading
pediatric foot charts.

| File | Chart / example | Unit notes |
| --- | --- | --- |
| `height-shoe-size.json` | Height vs shoe length scatter | height cm, shoe length cm |
| `age-foot-length.json` | Age vs mean foot length | age years, length cm |
| `bmi-foot-plumpness.json` | BMI vs plumpness index | BMI kg/m², index as charted |
| `foot-symmetry.json` | Left / right size mix by age | percents of a 100-point mix |
| `age-radar-profiles.json` | 9–12 year radar | 0–100 scaled scores |
| `plantar-pressure.json` | Pressure draft (`draw1.js`) | site labels, pressure Pa |
| `tissue-thickness.json` | Thickness draft (`draw2.js`) | site 1–14, thickness mm |
| `catalog.json` | Machine-readable index of the files above | — |

## Conventions

- Sex labels stay `female` / `male` in JSON; the Chinese UI maps them
  to 女生 / 男生.
- Shoe size on this site is **foot length in centimetres** (Mondopoint
  style), not UK/US last numbers.
- Radar values are already normalized to 0–100 in the original chart.
  They are relative profiles, not raw centimetres.

See `docs/data-dictionary.html` for field-by-field definitions.
