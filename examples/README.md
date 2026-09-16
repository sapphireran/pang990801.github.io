# Personal chart examples

Standalone pages for the series on this GitHub Pages dashboard. Each
chart loads JSON from `data/` and uses `../js/echarts.min.js` already
in the repo.

Serve the repository root (not this folder) over HTTP:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173/examples/>.

| Page | Dataset |
| --- | --- |
| [charts/height-shoe-scatter.html](charts/height-shoe-scatter.html) | `data/height-shoe-size.json` |
| [charts/age-foot-length.html](charts/age-foot-length.html) | `data/age-foot-length.json` |
| [charts/bmi-ratio.html](charts/bmi-ratio.html) | `data/bmi-foot-ratio.json` |
| [charts/symmetry-timeline.html](charts/symmetry-timeline.html) | `data/foot-symmetry-by-age.json` |
| [charts/age-radar.html](charts/age-radar.html) | `data/radar-age-profiles.json` |
| [charts/plantar-pressure.html](charts/plantar-pressure.html) | `data/plantar-pressure.json` |
| [charts/plantar-thickness.html](charts/plantar-thickness.html) | `data/plantar-thickness.json` |
| [charts/summary-stats.html](charts/summary-stats.html) | several of the files above |

`js/foot-stats.js` is the small helper used by the pages and by:

```bash
node examples/scripts/test-foot-stats.js
node examples/scripts/summarize-data.js
```

Re-copy arrays from the dashboard source with
`node examples/scripts/extract-dashboard-data.js`.
