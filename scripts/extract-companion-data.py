#!/usr/bin/env python3
"""Extract the personal dashboard series into companion JSON/JS files.

This reads only the published personal GitHub Pages sources in this repo.
It does not invent new measurements: leftover draw sketches stay labeled as drafts.
"""

from __future__ import annotations

import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "companion"
EXAMPLES_JS = ROOT / "examples" / "js"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def first_number_block(text: str, after: str) -> str:
    idx = text.find(after)
    if idx < 0:
        raise ValueError(f"anchor not found: {after}")
    start = text.find("[", idx)
    depth = 0
    for i, ch in enumerate(text[start:], start):
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    raise ValueError(f"unbalanced array after {after}")


def parse_pairs(block: str) -> list[list[float]]:
    pairs = re.findall(r"\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]", block)
    return [[float(a), float(b)] for a, b in pairs]


def parse_number_list(block: str) -> list[float]:
    return [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", block)]


def mean(xs: list[float]) -> float:
    return sum(xs) / len(xs)


def variance(xs: list[float]) -> float:
    m = mean(xs)
    return sum((x - m) ** 2 for x in xs) / (len(xs) - 1)


def stdev(xs: list[float]) -> float:
    return math.sqrt(variance(xs))


def pearson(xs: list[float], ys: list[float]) -> float:
    mx, my = mean(xs), mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))
    return num / den


def ols(xs: list[float], ys: list[float]) -> dict:
    mx, my = mean(xs), mean(ys)
    slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
    intercept = my - slope * mx
    fitted = [intercept + slope * x for x in xs]
    resid = [y - f for y, f in zip(ys, fitted)]
    ss_res = sum(r * r for r in resid)
    ss_tot = sum((y - my) ** 2 for y in ys)
    return {
        "slope": slope,
        "intercept": intercept,
        "r_squared": 1 - ss_res / ss_tot,
        "residual_sd": math.sqrt(ss_res / (len(xs) - 2)),
    }


def summarize_pairs(pairs: list[list[float]], label: str) -> dict:
    xs = [p[0] for p in pairs]
    ys = [p[1] for p in pairs]
    fit = ols(xs, ys)
    return {
        "label": label,
        "n": len(pairs),
        "height_cm": {
            "min": min(xs),
            "max": max(xs),
            "mean": mean(xs),
            "sd": stdev(xs),
        },
        "shoe_cm": {
            "min": min(ys),
            "max": max(ys),
            "mean": mean(ys),
            "sd": stdev(ys),
        },
        "pearson_r": pearson(xs, ys),
        "ols_shoe_from_height": fit,
    }


def symmetry_row(age_index: int) -> dict:
    # Copied from the dashboard pie generator in js/index.js
    a = round(36 - 13 * math.log(age_index + 1))
    b = round(17 - 6 * math.log(age_index + 1))
    c = round(11 - 4 * math.log(age_index + 1))
    d = round(27 - 10 * math.log(age_index + 1))
    same = 63 + a + b + c + d
    total = same + a + b + c + d
    return {
        "left_10_20": a,
        "left_over_20": b,
        "right_over_20": c,
        "right_10_20": d,
        "same": same,
        "total": total,
        "same_pct": 100 * same / total,
    }


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def js_literal(payload) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2)


def main() -> None:
    index_js = read(ROOT / "js" / "index.js")
    draw1 = read(ROOT / "draw1.js")
    draw2 = read(ROOT / "draw2.js")

    female_pairs = parse_pairs(first_number_block(index_js, "name: '女性'"))
    male_pairs = parse_pairs(first_number_block(index_js, "name: '男性'"))
    if len(female_pairs) != 199 or len(male_pairs) != 199:
        raise SystemExit(
            f"unexpected scatter lengths: female={len(female_pairs)} male={len(male_pairs)}"
        )

    ages = list(range(6, 15))
    girl_len = [18.55, 20.24, 21.01, 20.34, 20.83, 21.29, 21.83, 22.36, 22.66]
    boy_len = [18.27, 19.76, 20.61, 20.01, 20.75, 21.32, 21.98, 22.69, 23.16]
    length_diff = [round(g - b, 2) for g, b in zip(girl_len, boy_len)]
    crossover_age = next(
        age for age, diff in zip(ages, length_diff) if diff < 0
    )

    bmi = list(range(12, 25))
    girl_shape = [22.97, 23.38, 26.51, 24.47, 25.96, 26.22, 26.66, 26.92, 27.82, 26.35, 27.51, 29.86, 28.67]
    boy_shape = [25.28, 22.97, 28.47, 26.9, 28.03, 26.07, 26.76, 30.18, 26.63, 30.38, 30.13, 28.07, 30.19]

    thin_ring = {"highlighted": 50, "placeholder": 180}
    thick_ring = {"highlighted": 435, "placeholder": 2400}
    thin_ring["percent"] = 100 * thin_ring["highlighted"] / (
        thin_ring["highlighted"] + thin_ring["placeholder"]
    )
    thick_ring["percent"] = 100 * thick_ring["highlighted"] / (
        thick_ring["highlighted"] + thick_ring["placeholder"]
    )

    ages_full = list(range(2, 15))
    symmetry = [{"age": age, **symmetry_row(i)} for i, age in enumerate(ages_full)]

    radar_axes = ["身高", "兜跟围长", "跗骨围长", "跖趾围长", "鞋码", "脚长", "体重"]
    radar = [
        {"age": 9, "scores": [43, 29, 37, 37, 38, 31, 41]},
        {"age": 10, "scores": [53, 32, 42, 46, 43, 42, 49]},
        {"age": 11, "scores": [66, 37, 47, 60, 57, 59, 65]},
        {"age": 12, "scores": [84, 45, 55, 70, 71, 71, 79]},
    ]

    pressure_sites = [f"位点{n}" for n in range(1, 8)]
    pressure_normal = [90, 50, 39, 50, 120, 82, 80]
    pressure_dfu = [290, 200, 20, 132, 15, 200, 90]

    thickness_sites = [f"位点{n}" for n in range(1, 15)]
    thickness_normal = [11.6, 12.3, 12.1, 13.7, 12.6, 10.4, 12.2, 11.6, 13.2, 12.9, 11.4, 13.4, 10.2, 11.5]
    thickness_dfu = [13.2, 13.6, 12.9, 14.6, 14.9, 13, 15.7, 16.1, 14.2, 15.8, 15.9, 13.7, 12.9, 14.9]
    thickness_claimed_um = [16, 13, 8, 9, 23, 26, 35, 45, 10, 29, 45, 3, 27, 34]
    thickness_mm_diff = [round(d - n, 2) for n, d in zip(thickness_normal, thickness_dfu)]
    thickness_true_um = [round(x * 1000, 1) for x in thickness_mm_diff]
    thickness_mismatch = [
        claimed != true for claimed, true in zip(thickness_claimed_um, thickness_true_um)
    ]

    female_stats = summarize_pairs(female_pairs, "female")
    male_stats = summarize_pairs(male_pairs, "male")
    pooled_pairs = female_pairs + male_pairs
    pooled_stats = summarize_pairs(pooled_pairs, "pooled")

    catalog = {
        "project": "中国人群脚型数据可视化",
        "kind": "personal teaching samples from the 2020 GitHub Pages dashboard",
        "not_clinical": True,
        "sources": {
            "dashboard": "js/index.js",
            "unmounted_pressure_sketch": "draw1.js",
            "unmounted_thickness_sketch": "draw2.js",
        },
        "series": {
            "height_shoe": {
                "n_female": 199,
                "n_male": 199,
                "units": {"height": "cm", "shoe_length_label": "cm as plotted"},
            },
            "age_foot_length": {"ages": ages, "units": "cm"},
            "bmi_shape": {
                "bmi": bmi,
                "note": "y is labeled 脚长/脚宽 but plotted as a 20–30 index",
            },
            "symmetry": {
                "ages": ages_full,
                "note": "counts come from Math.log in the pie IIFE, not from raw pairs",
            },
            "radar": {
                "ages": [9, 10, 11, 12],
                "axes": radar_axes,
                "scale": "display scores 0–100, not raw centimetres",
            },
        },
    }

    height_shoe = {
        "female": [{"height_cm": a, "shoe_cm": b} for a, b in female_pairs],
        "male": [{"height_cm": a, "shoe_cm": b} for a, b in male_pairs],
    }
    age_foot = [
        {
            "age": age,
            "girl_cm": g,
            "boy_cm": b,
            "girl_minus_boy_cm": d,
        }
        for age, g, b, d in zip(ages, girl_len, boy_len, length_diff)
    ]
    bmi_shape = [
        {"bmi": x, "girl": g, "boy": b}
        for x, g, b in zip(bmi, girl_shape, boy_shape)
    ]
    leftovers = {
        "pressure": {
            "mounted": False,
            "source": "draw1.js",
            "sites": pressure_sites,
            "normal_pa_label": pressure_normal,
            "diabetic_foot_pa_label": pressure_dfu,
            "disclaimer": "Unmounted sketch. Not a clinical plantar-pressure study.",
        },
        "thickness": {
            "mounted": False,
            "source": "draw2.js",
            "sites": thickness_sites,
            "normal_mm": thickness_normal,
            "diabetic_foot_mm": thickness_dfu,
            "claimed_diff_um": thickness_claimed_um,
            "computed_diff_mm": thickness_mm_diff,
            "computed_diff_um": thickness_true_um,
            "claimed_um_mismatch_count": sum(thickness_mismatch),
            "disclaimer": "Every claimed 差值:um disagrees with (diabetic-normal)*1000.",
        },
    }

    stats = {
        "female": female_stats,
        "male": male_stats,
        "pooled": pooled_stats,
        "age_crossover": {
            "first_age_boys_longer": crossover_age,
            "series": age_foot,
        },
        "rings": {"thin": thin_ring, "thick": thick_ring},
        "symmetry_age_14": symmetry[-1],
        "leftover_thickness_mismatches": leftovers["thickness"]["claimed_um_mismatch_count"],
    }

    workbook_answers = {
        "crossover_age": crossover_age,
        "pooled_r_3dp": round(pooled_stats["pearson_r"], 3),
        "female_n": 199,
        "male_n": 199,
        "thin_ring_pct_1dp": round(thin_ring["percent"], 1),
        "thick_ring_pct_1dp": round(thick_ring["percent"], 1),
        "symmetry_same_pct_age_14_1dp": round(symmetry[-1]["same_pct"], 1),
        "thickness_mismatch_count": leftovers["thickness"]["claimed_um_mismatch_count"],
        "radar_age_12_height_score": 84,
        "ols_pooled_slope_4dp": round(pooled_stats["ols_shoe_from_height"]["slope"], 4),
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    write_json(DATA_DIR / "catalog.json", catalog)
    write_json(DATA_DIR / "height-shoe.json", height_shoe)
    write_json(DATA_DIR / "age-foot-length.json", age_foot)
    write_json(DATA_DIR / "bmi-shape.json", bmi_shape)
    write_json(DATA_DIR / "symmetry.json", symmetry)
    write_json(
        DATA_DIR / "radar.json",
        {"axes": radar_axes, "rows": radar},
    )
    write_json(DATA_DIR / "leftovers.json", leftovers)
    write_json(DATA_DIR / "stats.json", stats)
    write_json(DATA_DIR / "workbook-answers.json", workbook_answers)

    payload = {
        "catalog": catalog,
        "heightShoe": height_shoe,
        "ageFoot": age_foot,
        "bmiShape": bmi_shape,
        "symmetry": symmetry,
        "radar": {"axes": radar_axes, "rows": radar},
        "leftovers": leftovers,
        "stats": stats,
        "workbookAnswers": workbook_answers,
    }
    EXAMPLES_JS.mkdir(parents=True, exist_ok=True)
    (EXAMPLES_JS / "companion-data.js").write_text(
        "/* Generated by scripts/extract-companion-data.py — do not edit by hand. */\n"
        "window.COMPANION_DATA = "
        + js_literal(payload)
        + ";\n",
        encoding="utf-8",
    )

    print("wrote companion datasets")
    print(json.dumps(workbook_answers, indent=2))


if __name__ == "__main__":
    main()
