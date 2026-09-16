# Night Desk examples

Interactive personal workbenches that read `data/desk/payload.js`. They do not change the 2020 dashboard charts.

| Page | What it does |
| --- | --- |
| `scatter-fit.html` | Female/male OLS, residual scatter, residual histogram |
| `crossover.html` | Age 6–14 means and the 11-year crossing |
| `symmetry.html` | Formula pie shares by age, with the `ln` terms visible |
| `radar.html` | 9–12 year contours plus a decoded table |
| `clinic.html` | Seven misread cards wired to the matching panel |
| `leftovers.html` | First on-page mount of `draw1` / `draw2` series; optional fly-line map |
| `folio.html` | One-screen ledger of the computed anchors |

Serve from the repository root:

```bash
python3 -m http.server 4173
```
