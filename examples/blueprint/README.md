# Blueprint examples

Interactive pages for the personal foot-shape dashboard. All of them read
`../../data/blueprint/payload.js` and share `js/blueprint.js`.

| Page | What it does that the dashboard does not |
| --- | --- |
| `converter.html` | Foot length + allowance → five size systems |
| `fitting.html` | Sex-specific OLS with ±1σ / ±2σ and neighbour points |
| `growth-atlas.html` | Age velocities + height-bin percentiles |
| `last-blueprint.html` | SVG last outline from radar *scores* |
| `field-kit.html` | Printable left/right recording sheet |
| `vignettes.html` | Eight real scatter points as reading drills |
| `leftover-fit.html` | Click a residual, see Mondopoint / EU / UK drift |

Serve from the repository root. Opening `file://` will fail on Pages that
also load `js/echarts.min.js` from a parent directory in some browsers; the
payload itself is a classic script tag and does not need fetch.
