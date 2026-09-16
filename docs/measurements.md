# Measurement notes

Personal field notes for the quantities drawn on this Pages site. These are study reminders, not a lab protocol and not advice for fitting shoes.

## Stature and shoe last

The scatter panel plots standing height against a length the dashboard calls 鞋码. Both axes are formatted as centimetres.

Reading the cloud:

- Points run roughly from 75 cm to 155 cm of stature.
- Shoe-last length runs roughly from 10 cm to 24 cm.
- Girls in the current file sit a little taller and a little longer on average than boys (116.9 cm / 16.8 cm vs 111.8 cm / 16.0 cm). That is a property of this illustrative sample, not a population claim.
- Dashed mark-areas are the axis-aligned bounding boxes of each sex.
- Solid mark-lines are the mean of the Y series plus a vertical reference at 115 cm (girls) and 110 cm (boys).

When adding new points, keep the pair as `[stature_cm, shoe_length_cm]`. Do not mix EU sizes onto the same axis.

## Foot length by age

The left-lower panel is mean foot length for integer ages 6–14.

Observed shape in the current series:

| Age | Girls (cm) | Boys (cm) | Girl − boy (cm) |
| ---: | ---: | ---: | ---: |
| 6 | 18.55 | 18.27 | +0.28 |
| 7 | 20.24 | 19.76 | +0.48 |
| 8 | 21.01 | 20.61 | +0.40 |
| 9 | 20.34 | 20.01 | +0.33 |
| 10 | 20.83 | 20.75 | +0.08 |
| 11 | 21.29 | 21.32 | −0.03 |
| 12 | 21.83 | 21.98 | −0.15 |
| 13 | 22.36 | 22.69 | −0.33 |
| 14 | 22.66 | 23.16 | −0.50 |

The dip at age 9 is in the file. Leave it visible unless a later extract replaces the means. Diamond symbols are pictorial caps on the bars, not extra observations.

## Length / width ratio and BMI

脚胖瘦度 is the dashboard name for a slenderness score. The Y caption writes it as 脚长/脚宽. Stored values are an order of magnitude larger than a raw length/width ratio, so treat them as a display scale (about ratio × 10).

BMI on the X axis is a category list from 12 to 24, not a continuous calculated BMI for each child on the scatter. The line is a smoothed mean profile, not a child-level cloud.

Higher scores mean a relatively longer, narrower plan outline. Lower scores mean a wider outline for the same length. The two decorative rings on the right are independent placeholder fractions (thin ≈ 22%, wide ≈ 15%).

## Girth landmarks

The center radar uses three girths plus stature, shoe last, foot length, and body weight.

| Label | Where the tape sits | Why it is on the radar |
| --- | --- | --- |
| 兜跟围长 | Around the heel and rearfoot | Back-part volume, last heel width |
| 跗骨围长 | Around the tarsus / midfoot | Instep volume |
| 跖趾围长 | Around the metatarsal heads | Ball girth, toe-box width |

Those three tapes are the usual last-design trio. On this page they are normalized to 0–100 so a 12-year profile can be overlaid on a 9-year profile without a second unit system.

Normalized scores in the current file:

| Age | Stature | Heel | Tarsal | Ball | Shoe | Length | Weight |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 9 | 43 | 29 | 37 | 37 | 38 | 31 | 41 |
| 10 | 53 | 32 | 42 | 46 | 43 | 42 | 49 |
| 11 | 66 | 37 | 47 | 60 | 57 | 59 | 65 |
| 12 | 84 | 45 | 55 | 70 | 71 | 71 | 79 |

Heel girth grows more slowly than stature and weight in this sketch. That is why the 12-year polygon still looks pinched on the 兜跟围长 spoke.

## Left and right feet

The timeline pie does not store millimetre differences. It stores five count classes:

1. Feet close enough to call the same
2. Left 10–20% longer
3. Left more than 20% longer
4. Right more than 20% longer
5. Right 10–20% longer

Counts decay with `ln(age_index + 1)`, so the same-size slice grows as children get older. That is a teaching formula, not a fitted prevalence model.

## Adult sketches (pressure and thickness)

`draw1.js` and `draw2.js` are adult comparison sketches. They do not belong on the children's dashboard.

- Pressure is seven ordinal sites in pascals.
- Thickness is fourteen ordinal sites in millimetres, plus a third series labelled micrometres.

Do not join those landmarks to the children's girth tapes. The sketches never share a site map.

## What not to compute from these files

- Do not convert the Y axis of the scatter into EU, UK, or US shoe sizes. The file is centimetres.
- Do not treat radar scores as centimetres or kilograms.
- Do not treat the thin/wide rings as a prevalence study.
- Do not treat pressure or thickness sketches as paediatric data.
- Do not treat any series as a sizing recommendation.

## Refreshing derived tables

After a series changes in `js/index.js`, `draw1.js`, or `draw2.js`:

```bash
python3 scripts/extract_example_data.py
```

The script writes CSV, JSON, and `window.ExampleData` copies together so the example pages and the notes stay on the same numbers.
