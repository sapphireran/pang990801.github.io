#!/usr/bin/env python3
"""Extract chart series from the personal dashboard into downloadable datasets."""

from __future__ import annotations

import csv
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_JS = (ROOT / "js" / "index.js").read_text(encoding="utf-8")
DRAW1 = (ROOT / "draw1.js").read_text(encoding="utf-8")
DRAW2 = (ROOT / "draw2.js").read_text(encoding="utf-8")
OUT = ROOT / "examples" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def first_array_after(source: str, marker: str) -> list:
    start = source.index(marker)
    bracket = source.index("[", start)
    depth = 0
    for i, ch in enumerate(source[bracket:], start=bracket):
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                blob = source[bracket : i + 1]
                return json.loads(blob.replace("\n", " "))
    raise ValueError(f"Could not parse array after {marker!r}")


def write_csv(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_js(name: str, payload) -> None:
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    (OUT / f"{name}.js").write_text(
        "window.ExampleData = window.ExampleData || {};\n"
        f"window.ExampleData.{name} = {body};\n",
        encoding="utf-8",
    )


def extract_height_shoe() -> None:
    female = first_array_after(INDEX_JS, "name: '女性'")
    male = first_array_after(INDEX_JS, "name: '男性'")
    rows = []
    for height_cm, shoe_cm in female:
        rows.append(
            {
                "sex": "female",
                "sex_zh": "女童",
                "height_cm": height_cm,
                "shoe_length_cm": shoe_cm,
            }
        )
    for height_cm, shoe_cm in male:
        rows.append(
            {
                "sex": "male",
                "sex_zh": "男童",
                "height_cm": height_cm,
                "shoe_length_cm": shoe_cm,
            }
        )
    write_csv(
        OUT / "height-shoe-size.csv",
        rows,
        ["sex", "sex_zh", "height_cm", "shoe_length_cm"],
    )
    payload = {
        "description": "Child stature vs shoe last length from the personal dashboard scatter panel.",
        "units": {"height_cm": "cm", "shoe_length_cm": "cm"},
        "female": female,
        "male": male,
        "rows": rows,
        "summary": {
            "female_n": len(female),
            "male_n": len(male),
            "female_height_mean": round(sum(p[0] for p in female) / len(female), 2),
            "male_height_mean": round(sum(p[0] for p in male) / len(male), 2),
            "female_shoe_mean": round(sum(p[1] for p in female) / len(female), 2),
            "male_shoe_mean": round(sum(p[1] for p in male) / len(male), 2),
        },
    }
    write_json(OUT / "height-shoe-size.json", payload)
    write_js("heightShoe", payload)


def extract_age_length() -> None:
    ages = list(range(6, 15))
    girls = [18.55, 20.24, 21.01, 20.34, 20.83, 21.29, 21.83, 22.36, 22.66]
    boys = [18.27, 19.76, 20.61, 20.01, 20.75, 21.32, 21.98, 22.69, 23.16]
    diffs = [round(g - b, 2) for g, b in zip(girls, boys)]
    rows = [
        {
            "age_years": age,
            "girl_foot_length_cm": girl,
            "boy_foot_length_cm": boy,
            "girl_minus_boy_cm": diff,
        }
        for age, girl, boy, diff in zip(ages, girls, boys, diffs)
    ]
    write_csv(
        OUT / "age-foot-length.csv",
        rows,
        ["age_years", "girl_foot_length_cm", "boy_foot_length_cm", "girl_minus_boy_cm"],
    )
    payload = {
        "description": "Mean foot length by age for girls and boys, ages 6-14.",
        "ages": ages,
        "girls": girls,
        "boys": boys,
        "girl_minus_boy": diffs,
        "rows": rows,
        "notes": [
            "Girls are slightly longer on average before age 11.",
            "Boys overtake after age 11, matching the dashboard difference line.",
        ],
    }
    write_json(OUT / "age-foot-length.json", payload)
    write_js("ageFootLength", payload)


def extract_bmi() -> None:
    bmi = list(range(12, 25))
    girls = [22.97, 23.38, 26.51, 24.47, 25.96, 26.22, 26.66, 26.92, 27.82, 26.35, 27.51, 29.86, 28.67]
    boys = [25.28, 22.97, 28.47, 26.9, 28.03, 26.07, 26.76, 30.18, 26.63, 30.38, 30.13, 28.07, 30.19]
    rows = [
        {
            "bmi": value,
            "girl_length_width_ratio": girl,
            "boy_length_width_ratio": boy,
        }
        for value, girl, boy in zip(bmi, girls, boys)
    ]
    write_csv(
        OUT / "bmi-foot-ratio.csv",
        rows,
        ["bmi", "girl_length_width_ratio", "boy_length_width_ratio"],
    )
    payload = {
        "description": "BMI versus foot length/width ratio (dashboard '脚胖瘦度').",
        "bmi": bmi,
        "girls": girls,
        "boys": boys,
        "rows": rows,
        "thin_share_percent": round(50 / (50 + 180) * 100, 1),
        "wide_share_percent": round(435 / (435 + 2400) * 100, 1),
    }
    write_json(OUT / "bmi-foot-ratio.json", payload)
    write_js("bmiFootRatio", payload)


def extract_radar() -> None:
    axes = ["身高", "兜跟围长", "跗骨围长", "跖趾围长", "鞋码", "脚长", "体重"]
    axes_en = [
        "stature",
        "heel_girth",
        "tarsal_girth",
        "metatarsal_girth",
        "shoe_size",
        "foot_length",
        "body_weight",
    ]
    profiles = {
        9: [43, 29, 37, 37, 38, 31, 41],
        10: [53, 32, 42, 46, 43, 42, 49],
        11: [66, 37, 47, 60, 57, 59, 65],
        12: [84, 45, 55, 70, 71, 71, 79],
    }
    rows = []
    for age, values in profiles.items():
        row = {"age_years": age}
        for key, value in zip(axes_en, values):
            row[key] = value
        rows.append(row)
    write_csv(OUT / "radar-age-profiles.csv", rows, ["age_years", *axes_en])
    payload = {
        "description": "Normalized 0-100 growth radar for ages 9-12.",
        "axes_zh": axes,
        "axes_en": axes_en,
        "profiles": {str(age): values for age, values in profiles.items()},
        "rows": rows,
        "scale_note": "Values are dashboard-normalized scores, not raw centimetres.",
    }
    write_json(OUT / "radar-age-profiles.json", payload)
    write_js("radarProfiles", payload)


def extract_pressure() -> None:
    sites = [f"位点{i}" for i in range(1, 8)]
    sites_en = [f"site_{i}" for i in range(1, 8)]
    typical = [90, 50, 39, 50, 120, 82, 80]
    diabetic = [290, 200, 20, 132, 15, 200, 90]
    rows = [
        {
            "site_zh": zh,
            "site": en,
            "typical_pa": t,
            "diabetic_foot_pa": d,
            "difference_pa": d - t,
        }
        for zh, en, t, d in zip(sites, sites_en, typical, diabetic)
    ]
    write_csv(
        OUT / "plantar-pressure.csv",
        rows,
        ["site_zh", "site", "typical_pa", "diabetic_foot_pa", "difference_pa"],
    )
    payload = {
        "description": "Illustrative plantar pressure (Pa) at seven landmarks, from draw1.js.",
        "unit": "Pa",
        "sites_zh": sites,
        "typical": typical,
        "diabetic_foot": diabetic,
        "rows": rows,
        "source_file": "draw1.js",
    }
    write_json(OUT / "plantar-pressure.json", payload)
    write_js("plantarPressure", payload)


def extract_thickness() -> None:
    sites = [f"位点{i}" for i in range(1, 15)]
    typical = [11.6, 12.3, 12.1, 13.7, 12.6, 10.4, 12.2, 11.6, 13.2, 12.9, 11.4, 13.4, 10.2, 11.5]
    diabetic = [13.2, 13.6, 12.9, 14.6, 14.9, 13.0, 15.7, 16.1, 14.2, 15.8, 15.9, 13.7, 12.9, 14.9]
    delta_um = [16, 13, 8, 9, 23, 26, 35, 45, 10, 29, 45, 3, 27, 34]
    rows = [
        {
            "site_zh": site,
            "site_index": i + 1,
            "typical_mm": t,
            "diabetic_foot_mm": d,
            "difference_um": delta,
        }
        for i, (site, t, d, delta) in enumerate(zip(sites, typical, diabetic, delta_um))
    ]
    write_csv(
        OUT / "tissue-thickness.csv",
        rows,
        ["site_zh", "site_index", "typical_mm", "diabetic_foot_mm", "difference_um"],
    )
    payload = {
        "description": "Adult plantar soft-tissue thickness at 14 landmarks, from draw2.js.",
        "sites_zh": sites,
        "typical_mm": typical,
        "diabetic_foot_mm": diabetic,
        "difference_um": delta_um,
        "rows": rows,
        "source_file": "draw2.js",
    }
    write_json(OUT / "tissue-thickness.json", payload)
    write_js("tissueThickness", payload)


def extract_asymmetry() -> None:
    ages = [f"{age}岁" for age in range(2, 15)]
    rows = []
    series = {
        "same": [],
        "left_10_20": [],
        "left_over_20": [],
        "right_over_20": [],
        "right_10_20": [],
    }
    for i, label in enumerate(ages):
        left_10_20 = round(36 - 13 * math.log(i + 1))
        left_over_20 = round(17 - 6 * math.log(i + 1))
        right_over_20 = round(11 - 4 * math.log(i + 1))
        right_10_20 = round(27 - 10 * math.log(i + 1))
        same = 63 + left_10_20 + left_over_20 + right_over_20 + right_10_20
        row = {
            "age_label": label,
            "age_years": i + 2,
            "same_feet": same,
            "left_larger_10_20": left_10_20,
            "left_larger_over_20": left_over_20,
            "right_larger_over_20": right_over_20,
            "right_larger_10_20": right_10_20,
        }
        rows.append(row)
        series["same"].append(same)
        series["left_10_20"].append(left_10_20)
        series["left_over_20"].append(left_over_20)
        series["right_over_20"].append(right_over_20)
        series["right_10_20"].append(right_10_20)
    write_csv(
        OUT / "left-right-asymmetry.csv",
        rows,
        [
            "age_label",
            "age_years",
            "same_feet",
            "left_larger_10_20",
            "left_larger_over_20",
            "right_larger_over_20",
            "right_larger_10_20",
        ],
    )
    payload = {
        "description": "Left/right foot size categories by age, generated by the dashboard timeline formula.",
        "ages": ages,
        "series": series,
        "rows": rows,
        "formula": "counts use rounded log decay from js/index.js line1 pie timeline",
    }
    write_json(OUT / "left-right-asymmetry.json", payload)
    write_js("leftRightAsymmetry", payload)


def write_manifest() -> None:
    files = sorted(p.name for p in OUT.iterdir() if p.suffix in {".csv", ".json", ".js"})
    payload = {
        "generated_by": "scripts/extract_example_data.py",
        "files": files,
        "datasets": [
            "height-shoe-size",
            "age-foot-length",
            "bmi-foot-ratio",
            "radar-age-profiles",
            "plantar-pressure",
            "tissue-thickness",
            "left-right-asymmetry",
        ],
    }
    write_json(OUT / "manifest.json", payload)


def main() -> None:
    extract_height_shoe()
    extract_age_length()
    extract_bmi()
    extract_radar()
    extract_pressure()
    extract_thickness()
    extract_asymmetry()
    write_manifest()
    print(f"Wrote datasets to {OUT}")


if __name__ == "__main__":
    main()
