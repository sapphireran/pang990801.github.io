#!/usr/bin/env python3
"""Static checks for the personal docs/lab tree. Run from the repo root."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def ok(cond: bool, msg: str) -> None:
    if not cond:
        errors.append(msg)


def main() -> None:
    summary = json.loads((ROOT / "data" / "summary.json").read_text(encoding="utf-8"))
    pack = json.loads((ROOT / "data" / "height-shoe.json").read_text(encoding="utf-8"))
    ok(len(pack["female"]) == 199, "female scatter should have 199 points")
    ok(len(pack["male"]) == 199, "male scatter should have 199 points")
    ok(abs(summary["scatter"]["pooled"]["pearson_r"] - 0.9157) < 1e-4, "pooled r mismatch")
    ok(summary["thickness_delta_mismatch_count"] == 14, "expected 14 um mismatches")

    required = [
        "README.md",
        "docs/index.html",
        "docs/source-atlas.md",
        "docs/formulas.md",
        "examples/lab/index.html",
        "examples/lab/explorer.html",
        "examples/lab/correlation.html",
        "examples/lab/growth-story.html",
        "examples/lab/symmetry-lab.html",
        "examples/lab/leftover-compare.html",
        "examples/lab/unit-converter.html",
        "examples/lab/js/lab.js",
        "scripts/extract-personal-datasets.py",
    ]
    for rel in required:
        ok((ROOT / rel).is_file(), f"missing {rel}")

    explorer = (ROOT / "examples/lab/explorer.html").read_text(encoding="utf-8")
    ok("height-shoe.json" in explorer, "explorer should load height-shoe.json")
    ok("Lab.loadData" in explorer, "explorer should use Lab.loadData")
    ok("URLSearchParams" in explorer, "explorer should accept ?sex= query params")
    correlation = (ROOT / "examples/lab/correlation.html").read_text(encoding="utf-8")
    ok("group=" in correlation, "correlation should accept ?group=")

    index = (ROOT / "index.html").read_text(encoding="utf-8")
    ok("中国人群脚型数据可视化" in index, "dashboard title should match the header")
    ok("examples/lab/index.html" in index, "dashboard should link to the lab")
    ok("docs/index.html" in index, "dashboard should link to docs")

    if errors:
        raise SystemExit("verify failed:\n- " + "\n- ".join(errors))
    print("verify-personal-docs: ok")


if __name__ == "__main__":
    main()
