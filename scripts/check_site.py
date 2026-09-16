#!/usr/bin/env python3
"""Check that the personal docs/examples archive is complete."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "README.md",
    "data/catalog.json",
    "docs/index.html",
    "docs/read.html",
    "docs/js/markdown-lite.js",
    "docs/architecture.md",
    "docs/charts.md",
    "docs/data-dictionary.md",
    "docs/study-notes.md",
    "docs/examples.md",
    "docs/extending.md",
    "docs/generated-stats.md",
    "examples/index.html",
    "examples/css/examples.css",
    "examples/js/datasets.js",
    "examples/js/theme.js",
    "examples/js/stats.js",
    "examples/height-shoe-scatter.html",
    "examples/age-foot-length.html",
    "examples/bmi-foot-ratio.html",
    "examples/growth-radar.html",
    "examples/bilateral-symmetry.html",
    "examples/plantar-pressure.html",
    "examples/tissue-thickness.html",
    "examples/shoe-size-estimator.html",
    "examples/data-explorer.html",
    "scripts/extract_data.py",
    "scripts/validate_data.py",
]


def main() -> None:
    missing = [path for path in REQUIRED if not (ROOT / path).exists()]
    if missing:
        print("FAIL: missing files:", file=sys.stderr)
        for path in missing:
            print(f"  {path}", file=sys.stderr)
        raise SystemExit(1)

    index = (ROOT / "index.html").read_text(encoding="utf-8")
    if 'href="docs/index.html"' not in index or 'href="examples/index.html"' not in index:
        raise SystemExit("FAIL: homepage nav is missing docs/examples links")

    datasets = (ROOT / "examples/js/datasets.js").read_text(encoding="utf-8")
    for key in (
        "heightShoe",
        "ageFoot",
        "bmiFoot",
        "growthRadar",
        "bilateral",
        "plantar",
        "thickness",
    ):
        if key not in datasets:
            raise SystemExit(f"FAIL: datasets.js missing {key}")

    print(f"ok: {len(REQUIRED)} archive files present")


if __name__ == "__main__":
    main()
