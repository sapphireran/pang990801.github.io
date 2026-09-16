# How to read the personal dashboard

This note is the Markdown twin of `docs/methodology.html`. GitHub renders
it in the repository; the HTML copy is what GitHub Pages serves.

## Five questions, not five skins of one table

The live home page stacks five views because children's feet are not one
number. Height versus shoe length is allometry. Age versus mean foot
length is a growth curve plus a sex crossover. BMI versus plumpness asks
whether a heavier body also shows a broader foot on this dashboard's
index. The left/right pie is about pairing, not size. The radar squeezes
seven normalized scores for ages 9–12.

## Units that the original option objects leave implicit

- Scatter axes are centimeters, even though the panel title says 鞋码.
- Age-foot-length values are **group means**, not children.
- Plumpness is labeled 脚长/脚宽 but plotted on a 20–32 scale; treat it
  as a dashboard index.
- Radar values are 0–100 scores.
- Plantar pressure in `draw1.js` is pascals.
- Tissue thickness in `draw2.js` is millimeters; the extra line is
  micrometers.

## Generated series

The left/right timeline is a closed-form mix, not a survey microdata
file. Python `math.log` and JavaScript `Math.log` are both natural logs,
so `scripts/export-datasets.py` can reproduce the browser counts. Same
size feet stay the majority slice at every age because the formula adds
the four asymmetric buckets back into the `same` count.

The BMI ring charts keep placeholder remainders (`180`, `2400`) from the
2020 option. Example pages omit those rings on purpose.

## Regenerating the published JSON

```bash
python3 scripts/export-datasets.py
node tests/validate-data.js
```

If a number on the live dashboard changes, edit the arrays in the Python
exporter (or re-copy them from `js/index.js`) and run both commands.
