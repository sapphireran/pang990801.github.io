# Children's foot-shape visualization

Personal 2020 GitHub Pages project. The live dashboard at the repo root
plots height, age, BMI, left/right proportion, and a growth radar from
chart arrays that originally lived only inside `js/index.js`.

This branch keeps that dashboard as-is and adds a **personal archive**
around it: extracted datasets, write-ups, and standalone examples —
including two option files (`draw1.js`, `draw2.js`) that were never
mounted on the homepage.

| Path | What it is |
| --- | --- |
| [`index.html`](index.html) | Original 2020 dashboard (ECharts + jQuery) |
| [`docs/`](docs/) | Architecture, chart notes, data dictionary |
| [`data/`](data/) | JSON extracted from the chart scripts |
| [`examples/`](examples/) | Standalone pages that reload those datasets |
| [`scripts/`](scripts/) | Extract / validate helpers (Python 3, no deps) |

Open locally with any static server so `fetch` and ECharts both work:

```bash
python3 -m http.server 8080
```

Then visit:

- http://127.0.0.1:8080/ — original dashboard
- http://127.0.0.1:8080/docs/ — documentation hub
- http://127.0.0.1:8080/examples/ — example gallery

Regenerate JSON after editing the dashboard arrays:

```bash
python3 scripts/extract_data.py
python3 scripts/validate_data.py
```

## What the homepage charts

1. **Height × shoe last** — 199 girls and 199 boys as a scatter, with
   brush / dataZoom from ECharts.
2. **Age × mean foot length** — pictorial bars for ages 6–14 plus the
   girl−boy difference as an area line.
3. **Growth radar** — 9–12 years on seven normalized axes (height,
   three girths, shoe last, foot length, weight). The DOM class is
   still `.map` from an earlier China-map draft.
4. **BMI × plumpness** — length/width ratio by BMI bin, plus two
   decorative rings for “thin” and “plump” feet.
5. **Left / right proportion** — an autoplay pie timeline. Shares are
   generated from decaying log terms, not a raw contingency table.

`draw1.js` (plantar pressure) and `draw2.js` (soft-tissue thickness)
shipped as unused option objects. The example gallery mounts them.

## Not medical advice

Numbers here are a personal visualization archive from 2020. They are
not a clinical protocol, not a sizing standard, and not a substitute
for measuring a foot.

## License / provenance

Personal project by Sapphire Ran (`pang990801`). Chart code is the
2020 ECharts dashboard plus later documentation and examples.
