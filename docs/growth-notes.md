# Growth reading notes

How to read the children's series without turning the dashboard into a growth chart for a real child.

## Stature versus last length

The scatter is the only child-level cloud on the site. Everything else is already aggregated.

What the current extract shows:

- 398 points, split evenly by sex.
- Girl cloud is shifted up and right relative to the boy cloud.
- Both clouds are wide. A 110 cm child in this file can sit anywhere from about 13 cm to 18 cm of last length.
- Bounding-box mark-areas make the clouds look rectangular. The real mass is a diagonal band.

A useful personal exercise is to pick one stature, say 120 cm, and list the shoe-last values near it. That spread is why a single "height → size" rule is not drawn on the chart.

## The age-9 dip

Mean foot length falls from age 8 to age 9 in both sexes, then climbs again. Possible mundane explanations, none of which can be proven from the file:

- Different children in each age bin (cross-section, not a cohort).
- A bin with fewer tall kids.
- A typing leftover from an early draft.

The example page keeps the dip and calls it out in the note under the table. If a later personal dataset replaces the means, rewrite that sentence instead of smoothing the line for cosmetics.

## Crossover after age 10

Girl minus boy is positive through age 10 and negative from age 11. The cyan area on the dashboard is there to make that sign change obvious. Magnitude stays under 0.5 cm, so the bars still overlap visually. Read the line, not just the bar tops.

## Radar growth from 9 to 12

Normalized scores all rise, but not in parallel.

| Spoke | 9 → 12 gain |
| --- | ---: |
| Stature | +41 |
| Weight | +38 |
| Foot length | +40 |
| Shoe last | +33 |
| Ball girth | +33 |
| Tarsal girth | +18 |
| Heel girth | +16 |

In this sketch, rearfoot girth is the slow spoke. The polygon therefore stretches upward (stature / weight) faster than it fattens toward 兜跟围长. That is a composition choice worth keeping if the radar is redrawn: one slow spoke stops the shape from looking like a simple scale-up.

## Slenderness versus BMI

Both sex lines trend upward as BMI goes from 12 to 24, with a lot of local noise (girl 14 → 26.51, girl 15 → 24.47). An upward slenderness score at higher BMI is not intuitive if 脚胖瘦度 is taken as "fatter feet." On this page the score is a length/width display scale. A higher number is a relatively longer outline, not a higher BMI.

Do not narrate the line as "heavier children have fatter feet." The series does not say that.

## Left / right classes over age

Because the counts are a log decay, the story is baked into the formula:

- Age 2 has the most unmatched pairs.
- The same-size slice grows every year.
- Left-larger slices stay a bit larger than right-larger slices, because `a` and `b` start higher than `d` and `c`.

That left-heavy bias is a formula artifact (`36` and `17` vs `27` and `11`), not a finding. The example page states that next to the pie.

## What a later personal dataset would need

If these notes are ever pointed at a new table, keep a minimum record per child:

1. Age in months, not just integer years
2. Sex
3. Stature
4. Weight
5. Left length, right length
6. Left width, right width
7. One girth set (heel, tarsal, ball) per foot
8. Date and a note that the row is personal / study-only

Until that table exists, every mean on this site is a sketch.
