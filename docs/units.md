# Units

How to read every number that appears in the personal project, plus a small Mondopoint / EU / Chinese size pocket table for the lab converter.

## Dashboard units

| Quantity | Unit on the chart | Stored as | Convert? |
| --- | --- | --- | --- |
| Height | cm | float cm | — |
| Shoe length / 鞋码 | cm (tooltip) | float cm | Use the converter if you want EU / CN *codes* |
| Foot length | cm | float cm | — |
| Age | years | integer category | — |
| BMI | kg/m² (label “BMI”) | integer 12–24 | Already an index |
| 脚胖瘦度 | labeled 脚长/脚宽 | ~23–30 | Do not treat as L/W ≈ 2.5 |
| Radar axes | 0–100 | integers | Display scores |
| Symmetry slices | counts | integers from the log formula | Shares = count / total |
| `draw1.js` | Pa | integers | Sketch |
| `draw2.js` bars | mm | one-decimal mm | Sketch |
| `draw2.js` line | labeled um | integers | Not a conversion of the bars |

## BMI reminder

\[
\text{BMI} = \frac{\text{mass}_{kg}}{(\text{height}_{m})^2}
\]

The dashboard never stores mass or height for this panel — only the BMI tick labels 12…24 and the two stoutness series.

WHO-style child BMI is age- and sex-specific. The ticks here are just categories on an x-axis.

## Mondopoint, EU, and Chinese shoe codes

Mondopoint is foot length in millimetres. A 18.0 cm foot is Mondopoint 180.

A common **adult** EU approximation (not a children’s last, not a standard used by this dashboard) is:

\[
\text{EU} \approx \text{foot\_mm} / 6.67 + 2
\]

Chinese 码 is often quoted near EU for the same last. The lab converter shows three columns:

1. **Centimetres** — what the scatter actually plotted.
2. **Mondopoint** — `round(cm × 10)`.
3. **EU (rough)** — `round(cm × 10 / 6.67 + 2, 1)` labeled as an estimate.

There is no official size run in this repository. The converter exists so a centimetre from the scatter can be talked about as a size code without pretending the dashboard stored one.

### Pocket table (foot length → labels)

| Foot length (cm) | Mondopoint | EU (rough) |
| ---: | ---: | ---: |
| 12.0 | 120 | 20 |
| 14.0 | 140 | 23 |
| 16.0 | 160 | 26 |
| 18.0 | 180 | 29 |
| 20.0 | 200 | 32 |
| 22.0 | 220 | 35 |
| 24.0 | 240 | 38 |

Pooled scatter shoe lengths run 9.74–24.40 cm, so they span that whole pocket table.

## Radar scores are not centimetres

A `12岁` 身高 score of 84 does **not** mean 84 cm (the children in the scatter already reach ~150 cm). It means “84 on a 0–100 display axis.” Same for 鞋码 and 脚长 on that radar.

## Pressure and thickness leftovers

`draw1.js` / `draw2.js` compare an adult “typical” group with an adult “diabetic-foot” group. They are not attached to the children’s page. Keep their units inside those sketches:

- Pressure: Pascal as the title says, magnitudes look like a gallery demo.
- Thickness: millimetres on the bars; the line’s “um” label is unreliable (see [formulas](formulas.md#6-draw2js-delta-that-is-not-a-formula)).
