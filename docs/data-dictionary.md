# Data dictionary

All reusable series live under `examples/data/`. Homepage charts still embed the same numbers inside `js/index.js`. When you change a shared fact, edit both.

Units are recorded as the dashboard printed them. That is not the same as saying the unit is metrologically correct — see [measurement notes](measurement-notes.md).

## Files

| File | Records | Keys |
| --- | --- | --- |
| `height-shoe-female.json` | 199 | `height_cm`, `shoe_cm` |
| `height-shoe-male.json` | 199 | `height_cm`, `shoe_cm` |
| `age-foot-length.json` | 1 object | `ages`, `female_foot_length_cm`, `male_foot_length_cm`, `female_minus_male_cm` |
| `bmi-foot-shape.json` | 1 object | `bmi`, `female_length_width_ratio`, `male_length_width_ratio`, `notes` |
| `growth-radar.json` | 1 object | `indicators`, `series[]`, `scale` |
| `foot-symmetry.json` | 13 ages | `series[]` plus the generating `formula` |
| `plantar-pressure.json` | 7 sites | `sites`, `normal`, `diabetic_foot`, `unit`, `source_share` |
| `tissue-thickness.json` | 14 sites | `sites`, `normal_adult_mm`, `diabetic_adult_mm`, `difference_um` |

## Field notes

### `height_cm`

Stature in centimetres. Observed range in the extracted files is roughly 75–153 cm, which matches a mixed child sample rather than adults.

### `shoe_cm`

Printed as 鞋码 in the tooltip, formatted with a `cm` suffix. Treat it as a length-like score used by the scatter, not as a Mondopoint / EU / US size table.

### `ages` (6–14)

Integer years used by the foot-length bars. The symmetry timeline starts earlier (2–14) and is a different object.

### `female_foot_length_cm` / `male_foot_length_cm`

Mean foot length per age on the dashboard. One value per age, not a distribution.

### `female_minus_male_cm`

`female - male` at the same age. Stored explicitly so an example can plot the gap without depending on floating-point display.

### `bmi`

Integer body-mass-index bins from 12 to 24. No sample counts per bin are stored.

### `*_length_width_ratio`

Dashboard label: 脚长/脚宽. Values are ~23–30. A true length/width ratio for a child's foot is usually near 2.5, so these numbers are either a percentage-style scale (×10) or a different index that reused the label. Do not convert them to millimetres without a new measurement pass.

### Radar `indicators[].max`

Always 100. Values are already normalized to that ceiling.

### Radar `series[].values`

Seven numbers in indicator order. Age 12 uses 71, 71 for shoe and foot length (the original option wrote `77-6` and `79-8`).

### Symmetry `series[]`

| Key | Original slice |
| --- | --- |
| `same` | 双脚相同 |
| `left_10_20` | 左脚比右脚大 10–20% |
| `left_over_20` | 左脚比右脚大 20% 以上 |
| `right_over_20` | 右脚比左脚大 20% 以上 |
| `right_10_20` | 右脚比左脚大 10–20% |

These are illustration weights, not headcounts.

### Pressure `normal` / `diabetic_foot`

Seven Pascal-labeled points. Site anatomy is not named beyond 位点一…七.

### Thickness `difference_um`

Independent array. It is **not** `(diabetic - normal) * 1000`.

## Provenance

```
js/index.js          → height-shoe, age-foot-length, bmi, radar, symmetry
draw1.js             → plantar-pressure
draw2.js             → tissue-thickness
```

Extraction was a one-time parse (scatter arrays via regex, other series transcribed). Re-run is not automated; if you edit `js/index.js` by hand, copy the new arrays into JSON or the examples will drift.

## Encoding

UTF-8, 2-space JSON, `ensure_ascii=false` so Chinese keys and notes stay readable in git diffs.
