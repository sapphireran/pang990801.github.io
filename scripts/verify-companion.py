#!/usr/bin/env python3
"""Static checks for the personal companion studio."""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "companion"
failures: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def expect(cond: bool, msg: str) -> None:
    if not cond:
        fail(msg)


def pearson(xs, ys) -> float:
    mx = sum(xs) / len(xs)
    my = sum(ys) / len(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))
    return num / den


def main() -> int:
    height = load("height-shoe.json")
    age = load("age-foot-length.json")
    bmi = load("bmi-shape.json")
    symmetry = load("symmetry.json")
    radar = load("radar.json")
    leftovers = load("leftovers.json")
    stats = load("stats.json")
    answers = load("workbook-answers.json")
    catalog = load("catalog.json")

    expect(len(height["female"]) == 199, "female scatter should have 199 points")
    expect(len(height["male"]) == 199, "male scatter should have 199 points")
    expect(len(age) == 9, "age series should have 9 rows")
    expect(len(bmi) == 13, "bmi series should have 13 rows")
    expect(len(symmetry) == 13, "symmetry should cover ages 2–14")
    expect(len(radar["rows"]) == 4, "radar should have 4 ages")
    expect(catalog["not_clinical"] is True, "catalog must stay marked not-clinical")

    xs = [p["height_cm"] for p in height["female"] + height["male"]]
    ys = [p["shoe_cm"] for p in height["female"] + height["male"]]
    r = pearson(xs, ys)
    expect(abs(r - stats["pooled"]["pearson_r"]) < 1e-9, "pooled r mismatch")
    expect(round(r, 3) == answers["pooled_r_3dp"], "workbook r key mismatch")

    first_boy = next(row["age"] for row in age if row["girl_minus_boy_cm"] < 0)
    expect(first_boy == 11, "crossover should be age 11")
    expect(answers["crossover_age"] == 11, "workbook crossover key mismatch")

    thin = stats["rings"]["thin"]
    thick = stats["rings"]["thick"]
    expect(round(thin["percent"], 1) == 21.7, "thin ring percent")
    expect(round(thick["percent"], 1) == 15.3, "thick ring percent")
    expect(round(symmetry[-1]["same_pct"], 1) == 90.9, "age-14 same-foot percent")
    expect(leftovers["thickness"]["claimed_um_mismatch_count"] == 14, "all 14 um claims mismatch")

    js_path = ROOT / "examples" / "js" / "companion-data.js"
    expect(js_path.exists(), "missing examples/js/companion-data.js")
    if js_path.exists():
        js = js_path.read_text(encoding="utf-8")
        expect("window.COMPANION_DATA" in js, "companion-data.js must export a global")
        expect(str(answers["ols_pooled_slope_4dp"]) in js, "companion JS missing OLS slope")

    pages_manifest = ROOT / "scripts" / "companion-pages.txt"
    if pages_manifest.exists():
        for rel in pages_manifest.read_text(encoding="utf-8").splitlines():
            rel = rel.strip()
            if rel and not rel.startswith("#") and not (ROOT / rel).exists():
                fail(f"missing {rel}")

    snippets = {
        "docs/landmarks.html": "兜跟围长",
        "docs/reading.html": "Math.log",
        "examples/encodings/density.html": "CompanionEncodings.density",
        "examples/workbook/quiz.html": "CompanionWorkbook.gradeQuiz",
        "examples/tour/index.html": "CompanionTour.start",
        "index.html": "docs/index.html",
    }
    for rel, needle in snippets.items():
        path = ROOT / rel
        if path.exists() and needle not in path.read_text(encoding="utf-8"):
            fail(f"{rel} missing expected snippet: {needle}")

    if failures:
        print("verify-companion: FAIL")
        for item in failures:
            print(" -", item)
        return 1
    print("verify-companion: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
