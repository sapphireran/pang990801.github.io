# Measurement notes

This page records how to *read* the series, not how to run a clinic. The dashboard is a personal study piece. Numbers help the charts move; they are not a published anthropometric table.

## What a “site” is

`draw1.js` and `draw2.js` talk about 位点 (sites). The files never attach those indices to anatomy. A typical plantar map would name heel, lateral midfoot, five metatarsal heads, hallux, and lesser toes — but that mapping is **not** stored here. When an example says 位点三, it means “the third column in the array”, not “the third metatarsal”.

If you later bind sites to a foot diagram, add a `sites[].anatomy` field to the JSON and leave the original labels in place.

## Length, girth, and shoe

The cockpit mixes three different kinds of number:

1. **Centimetres** — height, foot length, the scatter's “鞋码” axis.
2. **Relative 0–100 scores** — radar spokes. Useful for overlaying ages, useless for a last maker.
3. **Unlabeled ratios** — BMI panel y-values in the mid-20s under a 脚长/脚宽 caption.

Do not dump all three into one CSV and call it a tidy dataset. The JSON files keep them in separate objects for that reason.

Chinese shoe sizing is often discussed as 脚长 + 10 mm or as Mondopoint (foot length in mm). The scatter's y-values (about 10–24) are in the same numeric neighborhood as foot length, which is why the tooltip says `cm`. They are still just the series the original option plotted.

## BMI panel

BMI bins are integers 12–24. That range is plausible for children. What is missing:

- n per bin
- how BMI was computed (measured vs. recalled height/weight)
- the rule that produced the two donut “over-thin / over-wide” percentages

The y-series cannot be a raw length/width ratio in natural units. A 24 cm × 8 cm foot has ratio 3.0, not 27. Possible readings:

- ratio × 10 (a 2.7 foot plotted as 27)
- a different plumpness index that reused the caption
- a leftover axis from an earlier draft

The example page plots the values as stored and prints this caveat in the sidebar.

## Pressure (Pa)

Plantars pressure maps are usually kPa, not Pa, and they are captured with a platform or in-shoe sensors at a known body weight. `draw1.js` labels the title `Pa` and uses values like 15–290. That is fine as a sparkline shape. It is not a calibrated peak-pressure study. The diabetic-foot line is a contrasting cartoon, not a patient cohort.

## Thickness (mm) and the micrometre line

Soft-tissue thickness under plantar sites is a real ultrasound / caliper topic. The bar series (10–16 mm) sit in a believable adult band. The line labeled `差值:um` does not match `(diabetic_mm - normal_mm) * 1000`. Until someone remeasures, treat the line as a third series that happens to use the same x-index.

## Left / right “percent larger”

A 20% length difference between feet would be extreme in a typically developing child. The timeline pie is an animation about *categories*, generated from `ln(ageIndex+1)`. It is a good demo of ECharts `timeline`. It is a bad source for a prevalence sentence.

If you want a real asymmetry study later, replace `foot-symmetry.json` with counted bins and delete the `formula` block so nobody thinks the log decay is a model of growth.

## Radar scores

The seven spokes are different physical things (mm of girth, cm of stature, kg of mass, shoe-ish length). Plotting them on one 0–100 ring is a storytelling choice. The JSON field `scale` exists so a future reader does not convert a 43 into 43 cm.

Age 12 shoe/foot scores were arithmetic in the original file (`77-6`, `79-8`). That looks like a last-minute visual tweak. The JSON stores 71 and 71 and this paragraph records why.

## What I would measure next (personal)

These are notes to myself, not a protocol:

1. Name the seven / fourteen plantar sites on a diagram.
2. Store n, mean, and sd — not only the mean.
3. Keep raw units in the JSON; do relative scoring in the chart option.
4. Split shoe size (mondopoint / EU) from foot length (mm).
5. Drop illustration-only pies or mark them `decorative: true` in the data file.

Until then, every example sidebar repeats a one-line limit so a screenshot cannot wander off as a “finding”.
