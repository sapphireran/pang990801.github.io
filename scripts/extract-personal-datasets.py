#!/usr/bin/env python3
"""Extract personal dashboard series from js/index.js, draw1.js, and draw2.js.

This is a local helper for the personal GitHub Pages project. It does not
talk to any company systems. Run from the repository root:

    python3 scripts/extract-personal-datasets.py
"""

from __future__ import annotations

import ast
import csv
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def pearson(xs: list[float], ys: list[float]) -> float:
    n = len(xs)
    if n < 2:
        return float("nan")
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    dy = math.sqrt(sum((y - my) ** 2 for y in ys))
    if dx == 0 or dy == 0:
        return float("nan")
    return num / (dx * dy)


def linear_fit(xs: list[float], ys: list[float]) -> tuple[float, float]:
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    den = sum((x - mx) ** 2 for x in xs)
    slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / den
    intercept = my - slope * mx
    return slope, intercept


def summarize_xy(points: list[list[float]]) -> dict:
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    slope, intercept = linear_fit(xs, ys)
    return {
        "n": len(points),
        "height_cm": {
            "min": min(xs),
            "max": max(xs),
            "mean": round(sum(xs) / len(xs), 3),
        },
        "shoe_length_cm": {
            "min": min(ys),
            "max": max(ys),
            "mean": round(sum(ys) / len(ys), 3),
        },
        "pearson_r": round(pearson(xs, ys), 4),
        "ols": {
            "slope_cm_per_cm": round(slope, 5),
            "intercept_cm": round(intercept, 4),
            "formula": f"shoe ≈ {slope:.4f} × height + {intercept:.3f}",
        },
    }


def extract_named_pairs(source: str, series_name: str) -> list[list[float]]:
    pattern = rf"name:\s*'{series_name}'[\s\S]*?data:\s*(\[[\s\S]*?\])\s*,\s*markArea"
    match = re.search(pattern, source)
    if not match:
        raise SystemExit(f"could not find series {series_name!r}")
    return ast.literal_eval(re.sub(r"\s+", " ", match.group(1)))


def write_json(name: str, payload: object) -> None:
    path = DATA / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def write_csv(name: str, rows: list[dict], fieldnames: list[str]) -> None:
    path = DATA / name
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"wrote {path.relative_to(ROOT)}")


def symmetry_row(age_index: int, label: str) -> dict:
    # js/index.js uses Math.log, which is the natural logarithm.
    i = age_index
    a = round(36 - 13 * math.log(i + 1))
    b = round(17 - 6 * math.log(i + 1))
    c = round(11 - 4 * math.log(i + 1))
    d = round(27 - 10 * math.log(i + 1))
    same = 63 + a + b + c + d
    total = same + a + b + c + d
    return {
        "age_label": label,
        "age_years": age_index + 2,
        "same": same,
        "left_10_20": a,
        "left_over_20": b,
        "right_over_20": c,
        "right_10_20": d,
        "total": total,
        "same_pct": round(100 * same / total, 2),
    }


def main() -> None:
    DATA.mkdir(exist_ok=True)
    index_js = (ROOT / "js" / "index.js").read_text(encoding="utf-8")

    female = extract_named_pairs(index_js, "女性")
    male = extract_named_pairs(index_js, "男性")
    if len(female) != 199 or len(male) != 199:
        raise SystemExit(f"unexpected scatter sizes: female={len(female)} male={len(male)}")

    ages = [6, 7, 8, 9, 10, 11, 12, 13, 14]
    girl_len = [18.55, 20.24, 21.01, 20.34, 20.83, 21.29, 21.83, 22.36, 22.66]
    boy_len = [18.27, 19.76, 20.61, 20.01, 20.75, 21.32, 21.98, 22.69, 23.16]
    length_gap = [round(g - b, 2) for g, b in zip(girl_len, boy_len)]

    bmi = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    girl_ratio = [22.97, 23.38, 26.51, 24.47, 25.96, 26.22, 26.66, 26.92, 27.82, 26.35, 27.51, 29.86, 28.67]
    boy_ratio = [25.28, 22.97, 28.47, 26.9, 28.03, 26.07, 26.76, 30.18, 26.63, 30.38, 30.13, 28.07, 30.19]

    radar_axes = ["身高", "兜跟围长", "跗骨围长", "跖趾围长", "鞋码", "脚长", "体重"]
    radar = {
        "note": "Scores are already scaled 0–100 in js/index.js. They are display ranks, not raw cm/kg.",
        "axes": radar_axes,
        "series": [
            {"age": 9, "values": [43, 29, 37, 37, 38, 31, 41]},
            {"age": 10, "values": [53, 32, 42, 46, 43, 42, 49]},
            {"age": 11, "values": [66, 37, 47, 60, 57, 59, 65]},
            {"age": 12, "values": [84, 45, 55, 70, 71, 71, 79]},
        ],
    }

    time_labels = [f"{n}岁" for n in range(2, 15)]
    symmetry = [symmetry_row(i, label) for i, label in enumerate(time_labels)]

    pressure_sites = [f"位点{n}" for n in ["一", "二", "三", "四", "五", "六", "七"]]
    pressure_normal = [90, 50, 39, 50, 120, 82, 80]
    pressure_diabetic = [290, 200, 20, 132, 15, 200, 90]

    thick_normal = [11.6, 12.3, 12.1, 13.7, 12.6, 10.4, 12.2, 11.6, 13.2, 12.9, 11.4, 13.4, 10.2, 11.5]
    thick_diabetic = [13.2, 13.6, 12.9, 14.6, 14.9, 13, 15.7, 16.1, 14.2, 15.8, 15.9, 13.7, 12.9, 14.9]
    thick_delta_um = [16, 13, 8, 9, 23, 26, 35, 45, 10, 29, 45, 3, 27, 34]
    thick_delta_mm = [round(d - n, 2) for n, d in zip(thick_normal, thick_diabetic)]

    scatter_rows = [
        {"sex": "female", "sex_zh": "女性", "height_cm": h, "shoe_length_cm": s}
        for h, s in female
    ] + [
        {"sex": "male", "sex_zh": "男性", "height_cm": h, "shoe_length_cm": s}
        for h, s in male
    ]

    write_json(
        "height-shoe.json",
        {
            "title": "Height vs shoe length (children)",
            "source": "js/index.js first IIFE (.bar .chart)",
            "units": {"height": "cm", "shoe_length": "cm"},
            "female": female,
            "male": male,
            "summary": {
                "female": summarize_xy(female),
                "male": summarize_xy(male),
                "pooled": summarize_xy(female + male),
            },
        },
    )
    write_csv(
        "height-shoe.csv",
        scatter_rows,
        ["sex", "sex_zh", "height_cm", "shoe_length_cm"],
    )

    age_rows = [
        {
            "age_years": age,
            "girl_foot_length_cm": g,
            "boy_foot_length_cm": b,
            "girl_minus_boy_cm": gap,
        }
        for age, g, b, gap in zip(ages, girl_len, boy_len, length_gap)
    ]
    write_json(
        "age-foot-length.json",
        {
            "title": "Mean foot length by age",
            "source": "js/index.js second IIFE (.line .chart)",
            "crossover_note": "Girls are longer on average at ages 6–10; boys overtake from age 11.",
            "rows": age_rows,
        },
    )
    write_csv("age-foot-length.csv", age_rows, list(age_rows[0].keys()))

    bmi_rows = [
        {
            "bmi": x,
            "girl_length_width_ratio": g,
            "boy_length_width_ratio": b,
        }
        for x, g, b in zip(bmi, girl_ratio, boy_ratio)
    ]
    write_json(
        "bmi-shape.json",
        {
            "title": "BMI vs length/width ratio",
            "source": "js/index.js third IIFE (.bar1 .chart)",
            "axis_note": "Dashboard y-axis is labeled 脚长/脚宽 but values sit near 23–30, so they are not a unitless L/W ratio near 2.5. Treat them as the stored series, not a physical ratio.",
            "rings": {
                "thin_foot": {"value": 50, "placeholder": 180, "percent": round(100 * 50 / 230, 2)},
                "thick_foot": {"value": 435, "placeholder": 2400, "percent": round(100 * 435 / 2835, 2)},
            },
            "rows": bmi_rows,
        },
    )
    write_csv("bmi-shape.csv", bmi_rows, list(bmi_rows[0].keys()))

    write_json("radar-growth.json", radar)
    write_csv(
        "radar-growth.csv",
        [
            {"age": series["age"], **{axis: value for axis, value in zip(radar_axes, series["values"])}}
            for series in radar["series"]
        ],
        ["age", *radar_axes],
    )

    write_json(
        "foot-symmetry.json",
        {
            "title": "Left/right foot size mix by age",
            "source": "js/index.js fourth IIFE (.line1 .chart)",
            "formula": {
                "log": "natural log (JavaScript Math.log)",
                "a": "round(36 - 13 * ln(i+1))",
                "b": "round(17 - 6 * ln(i+1))",
                "c": "round(11 - 4 * ln(i+1))",
                "d": "round(27 - 10 * ln(i+1))",
                "same": "63 + a + b + c + d",
                "i": "0 for 2岁 through 12 for 14岁",
            },
            "note": "These counts are generated by the formula above. They are not a stored survey table.",
            "rows": symmetry,
        },
    )
    write_csv("foot-symmetry.csv", symmetry, list(symmetry[0].keys()))

    pressure_rows = [
        {
            "site": site,
            "site_index": i + 1,
            "typical_pa": n,
            "diabetic_pa": d,
            "delta_pa": d - n,
        }
        for i, (site, n, d) in enumerate(zip(pressure_sites, pressure_normal, pressure_diabetic))
    ]
    write_json(
        "plantar-pressure.json",
        {
            "title": "Plantar pressure sketch (unmounted)",
            "source": "draw1.js",
            "mounted": False,
            "units": "Pa as labeled; treat as demo magnitudes",
            "rows": pressure_rows,
            "ring": {"value": 335, "placeholder": 180, "percent": round(100 * 335 / 515, 2)},
        },
    )
    write_csv("plantar-pressure.csv", pressure_rows, list(pressure_rows[0].keys()))

    thickness_rows = [
        {
            "site_index": i + 1,
            "typical_adult_mm": n,
            "diabetic_adult_mm": d,
            "measured_delta_mm": dm,
            "chart_delta_um": du,
            "chart_delta_matches_mm": abs(dm * 1000 - du) < 0.5,
        }
        for i, (n, d, dm, du) in enumerate(
            zip(thick_normal, thick_diabetic, thick_delta_mm, thick_delta_um)
        )
    ]
    write_json(
        "plantar-thickness.json",
        {
            "title": "Plantar soft-tissue thickness sketch (unmounted)",
            "source": "draw2.js",
            "mounted": False,
            "warning": "The line series is labeled 差值:um but is not the millimetre bar difference × 1000.",
            "rows": thickness_rows,
        },
    )
    write_csv("plantar-thickness.csv", thickness_rows, list(thickness_rows[0].keys()))

    schema = {
        "project": "pang990801.github.io personal children's foot-shape dashboard",
        "generated_by": "scripts/extract-personal-datasets.py",
        "files": {
            "height-shoe": {
                "columns": ["sex", "height_cm", "shoe_length_cm"],
                "n": 398,
            },
            "age-foot-length": {
                "columns": ["age_years", "girl_foot_length_cm", "boy_foot_length_cm"],
                "n": 9,
            },
            "bmi-shape": {
                "columns": ["bmi", "girl_length_width_ratio", "boy_length_width_ratio"],
                "n": 13,
            },
            "radar-growth": {
                "columns": ["age", *radar_axes],
                "n": 4,
            },
            "foot-symmetry": {
                "columns": ["age_years", "same", "left_10_20", "left_over_20", "right_over_20", "right_10_20"],
                "n": 13,
            },
            "plantar-pressure": {
                "columns": ["site_index", "typical_pa", "diabetic_pa"],
                "n": 7,
            },
            "plantar-thickness": {
                "columns": ["site_index", "typical_adult_mm", "diabetic_adult_mm", "chart_delta_um"],
                "n": 14,
            },
        },
    }
    write_json("schema.json", schema)

    summary = {
        "scatter": {
            "female": summarize_xy(female),
            "male": summarize_xy(male),
            "pooled": summarize_xy(female + male),
        },
        "age_crossover": "Girls longer at 6–10, boys longer at 11–14.",
        "bmi_rings_percent": {
            "thin": round(100 * 50 / 230, 2),
            "thick": round(100 * 435 / 2835, 2),
        },
        "symmetry_same_pct_range": {
            "min": min(row["same_pct"] for row in symmetry),
            "max": max(row["same_pct"] for row in symmetry),
        },
        "thickness_delta_mismatch_count": sum(
            1 for row in thickness_rows if not row["chart_delta_matches_mm"]
        ),
    }
    write_json("summary.json", summary)


if __name__ == "__main__":
    main()
