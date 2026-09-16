# Examples

Standalone ECharts pages that read JSON from `data/` instead of the 1 100-line dashboard script.

## Files

```
examples/
  index.html                 gallery
  css/examples.css           shared chrome
  js/chart-helpers.js        fetch + nav + resize
  data/*.json                series copied from the dashboard / sketches
  height-shoe-scatter.html
  age-foot-length.html
  bmi-foot-ratio.html
  bilateral-symmetry.html
  growth-radar.html
  plantar-pressure.html      from draw1.js (not on the live board)
  tissue-thickness.html      from draw2.js (not on the live board)
  data-browser.html          JSON catalogue + summary table
```

## Adding a chart

1. Put a JSON object in `data/` with `dataset_id`, `title`, `title_zh`, and the series.
2. Append it to `data/catalog.json`.
3. Copy an existing `examples/*.html`, change the `fetch` path and `option`.
4. Link it from `index.html`.
5. Add a row to `docs/charts.md`.

Keep dashboard colours when the chart already exists on `index.html` (`#ff4f3b` girls, `#ffe01f` boys, navy translucent panels).

## Regenerating the scatter summary

From the repo root, after editing `height-shoe.json`:

```bash
python3 - <<'PY'
import json, math
from pathlib import Path
d = json.loads(Path("examples/data/height-shoe.json").read_text())

def stats(vals):
    n = len(vals)
    mean = sum(vals)/n
    var = sum((v-mean)**2 for v in vals)/(n-1)
    s = sorted(vals)
    def pct(q):
        idx = (n - 1) * q
        lo = int(math.floor(idx))
        hi = int(math.ceil(idx))
        if lo == hi:
            return s[lo]
        return s[lo] * (hi - idx) + s[hi] * (idx - lo)
    return {
        "n": n,
        "min": round(min(vals), 3),
        "p25": round(pct(0.25), 3),
        "median": round(pct(0.5), 3),
        "p75": round(pct(0.75), 3),
        "max": round(max(vals), 3),
        "mean": round(mean, 3),
        "stdev": round(math.sqrt(var), 3),
    }

def pearson(xs, ys):
    mx, my = sum(xs)/len(xs), sum(ys)/len(ys)
    num = sum((x-mx)*(y-my) for x,y in zip(xs,ys))
    den = math.sqrt(sum((x-mx)**2 for x in xs)*sum((y-my)**2 for y in ys))
    return round(num/den, 4)

out = {"dataset_id": "height-shoe-summary", "groups": {}}
for key, series in d["series"].items():
    xs = [p[0] for p in series["points"]]
    ys = [p[1] for p in series["points"]]
    out["groups"][key] = {
        "height_cm": stats(xs),
        "shoe_size_cm": stats(ys),
        "pearson_r_height_shoe": pearson(xs, ys),
    }
Path("examples/data/height-shoe-summary.json").write_text(json.dumps(out, indent=2) + "\n")
print("wrote height-shoe-summary.json")
PY
```

Serve with `python3 -m http.server 4173` from the repo root; see `docs/local-preview.md`.
