#!/usr/bin/env python3
"""Sanity-check extracted personal datasets before publishing examples."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def load(name: str) -> dict:
    path = DATA / name
    if not path.exists():
        fail(f"missing {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def expect(cond: bool, message: str) -> None:
    if not cond:
        fail(message)


def main() -> None:
    catalog = load("catalog.json")
    for name in catalog["datasets"]:
        load(name)

    height = load("height-shoe-size.json")
    female = height["series"]["female"]["points"]
    male = height["series"]["male"]["points"]
    expect(len(female) == 199, f"female points {len(female)} != 199")
    expect(len(male) == 199, f"male points {len(male)} != 199")
    for sex, points in (("female", female), ("male", male)):
        for i, pair in enumerate(points):
            expect(len(pair) == 2, f"{sex}[{i}] is not a pair")
            expect(70 < pair[0] < 170, f"{sex}[{i}] height {pair[0]} out of range")
            expect(8 < pair[1] < 30, f"{sex}[{i}] shoe last {pair[1]} out of range")
    expect(height["series"]["female"]["stats"]["pearson_r"] > 0.8, "female correlation too weak")
    expect(height["series"]["male"]["stats"]["pearson_r"] > 0.8, "male correlation too weak")

    age = load("age-foot-length.json")
    expect(len(age["ages"]) == 9, "expected 9 ages")
    expect(len(age["female_cm"]) == 9, "female length series length")
    expect(len(age["male_cm"]) == 9, "male length series length")
    for i, (g, b, d) in enumerate(zip(age["female_cm"], age["male_cm"], age["female_minus_male_cm"])):
        expect(abs((g - b) - d) < 1e-9, f"age diff mismatch at index {i}")

    bmi = load("bmi-foot-ratio.json")
    expect(len(bmi["bmi"]) == 13, "bmi bins")
    expect(len(bmi["female_ratio"]) == 13, "female ratio")
    expect(0 < bmi["ring_charts"]["thin_feet"]["highlighted_share"] < 1, "thin share")
    expect(0 < bmi["ring_charts"]["plump_feet"]["highlighted_share"] < 1, "plump share")

    radar = load("growth-radar.json")
    expect(len(radar["axes"]) == 7, "radar axes")
    expect(radar["series"]["12岁"][4] == 71, "12-year shoe last should be 77-6")
    expect(radar["series"]["12岁"][5] == 71, "12-year foot length should be 79-8")

    bilateral = load("bilateral-symmetry.json")
    expect(len(bilateral["points"]) == 13, "ages 2-14")
    expect(bilateral["points"][0]["age"] == "2岁", "first age label")

    plantar = load("plantar-pressure.json")
    expect(len(plantar["sites"]) == 7, "pressure sites")
    expect(len(plantar["normal_pa"]) == 7, "normal pressure")
    expect(len(plantar["diabetic_foot_pa"]) == 7, "diabetic pressure")

    thickness = load("tissue-thickness.json")
    expect(len(thickness["normal_adult_mm"]) == 14, "thickness sites")
    expect(len(thickness["diabetic_foot_adult_mm"]) == 14, "diabetic thickness")
    expect(len(thickness["difference_labelled_um"]) == 14, "um series")

    print("ok: 7 datasets passed integrity checks")


if __name__ == "__main__":
    main()
