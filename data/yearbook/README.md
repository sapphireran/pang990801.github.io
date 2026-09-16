# Field yearbook data pack

Personal extract of the series already embedded in this GitHub Pages repo.
Nothing here comes from a company repository.

`scripts/build-yearbook.py` reads `js/index.js`, `draw1.js`, and `draw2.js`,
then writes the JSON files in this folder plus `payload.js` for the example
pages (so they work over `file://` without a fetch).

| File | What it holds |
| --- | --- |
| `catalog.json` | Bilingual index of live and leftover charts |
| `stats.json` | OLS fits, crossover age, symmetry endpoints |
| `files.json` | Live vs leftover source map |
| `height-shoe.json` | Scatter points and sex-specific fits |
| `age-foot-length.json` | Ages 6–14 mean foot lengths |
| `bmi-shape.json` | BMI vs length/width series |
| `foot-symmetry.json` | Log-decay left/right bins for ages 2–14 |
| `radar-growth.json` | Relative 7-spoke profiles, ages 9–12 |
| `plantar-pressure.json` | Leftover adult pressure sketch |
| `plantar-thickness.json` | Leftover adult tissue-thickness sketch |
| `payload.js` | Same objects as `window.YEARBOOK` |

Treat leftover plantar files as desk sketches, not as part of the children's
homepage. Radar values are relative scores capped at 100, not physical units.
