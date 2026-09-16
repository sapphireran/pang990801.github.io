# Study notes (personal, 2020 archive)

These notes describe **what the published charts imply**, not a
reconstructed methods section. The original repo never shipped a
paper, codebook, or consent form.

## What the scatter is good for

Height and the centimetre “鞋码” series are tightly linear in this
file (r ≈ 0.91 for both sexes). That is enough to demo a last-length
estimator and to show why a single height→size rule needs a residual
band: RMSE is still ~1.3 cm, which is more than a typical kids'
width fitting step.

The two OLS slopes are almost the same (~0.14 cm last per cm
height). Intercepts differ slightly; do not over-read a sex effect
from 199+199 anonymous points with no age control. Height already
collapses age, nutrition, and region.

Mark lines at 110 cm (boys) and 115 cm (girls) are visual anchors
only. They are not cut-points justified elsewhere in the repo.

## Age means

The age 6–14 means are plausible as **group averages** (roughly
18–23 cm). The girl-then-boy crossover near 11 years is a pattern
people often expect from mixed-longitudinal school samples, but this
file does not say how the means were computed (per-child last visit?
cross-section?).

The dip from age 7 to ages 8–9 is a reminder not to treat the series
as a smoothed growth chart. If you republish, plot the points and
say “charted means”.

## BMI and plumpness

The axis text says plumpness = 脚长 / 脚宽. A larger ratio is a
longer, narrower footprint. The lines trend up with BMI in the
stored bins, which is the opposite of a naive “higher BMI, wider
foot” slogan. Possible innocuous reasons: different bins have
different ages; the ratio definition; gallery-demo leftovers. The
archive does not choose among them.

Ring percentages (21.7% “thin”, 15.3% “plump”) use leftover slice
names from an ECharts user-source demo. There is no threshold
definition for 过瘦 / 过胖 in the script.

## Radar indices

9→12 year traces expand on every axis. That only says “the dashboard
index grows with age.” Without the 0–100 calibration, you cannot
back out millimetres. The 12-year `77-6` / `79-8` literals are
almost certainly edits that left a subtraction in place; the
examples document the evaluated 71 / 71.

## Bilateral pie

The log model drives left/right “imbalance” toward zero as age
increases. That is a design for the autoplay, not evidence that
asymmetry vanishes by 14. If you need a real prevalence chart,
replace `pieData` with a table and delete the formula.

## Unused adult comparison files

`draw1.js` and `draw2.js` switch the subject from children to
“normal vs diabetic-foot adults”. They look like gallery experiments
parked in the repo. Pressure site 1 is much higher for the diabetic
series (290 vs 90); site 3 is lower (20 vs 39). Thickness is higher
at every site for the diabetic series. None of that is wired to the
homepage, and none of it names a clinic or a paper.

## Sibling Pages from the header

The 2020 nav links out to:

- `https://scuscientia.github.io/` — 首页
- `https://pang990801.github.io/` — 儿童脚型 (this repo)
- `https://ytep-zhi.github.io/` — 畸形足或病足
- `mailto:1127235750@qq.com`

Those sites are outside this archive. Do not scrape them into
`data/`.

## Estimator example (later addition)

`examples/shoe-size-estimator.html` applies the in-sample OLS and
converts last length to a **Mondopoint-like millimetre**
(`round(last_cm * 10)`) plus a +5 mm allowance. That is a teaching
control, not a factory last. Chinese kids' boxed sizes are not
standardized enough in this repo to claim a brand conversion.
