#!/usr/bin/env python3
"""Extract chart datasets from the 2020 personal dashboard scripts.

The original pages bake arrays into ECharts option objects. This script
pulls those arrays out so docs and standalone examples can share one
source of truth without rewriting the live dashboard.
"""

from __future__ import annotations

import json
import math
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INDEX_JS = ROOT / "js" / "index.js"
DRAW1_JS = ROOT / "draw1.js"
DRAW2_JS = ROOT / "draw2.js"
DATA_DIR = ROOT / "data"
EXAMPLES_JS = ROOT / "examples" / "js" / "datasets.js"
STATS_MD = ROOT / "docs" / "generated-stats.md"


def extract_js_value(source: str, start: int) -> tuple[Any, int]:
    """Parse one JS literal (number, string, array, or object) at start."""
    n = len(source)
    while start < n and source[start] in " \t\r\n":
        start += 1
    if start >= n:
        raise ValueError("unexpected end of file")

    ch = source[start]
    if ch in "-0123456789.":
        m = re.match(r"-?\d+(?:\.\d+)?", source[start:])
        if not m:
            raise ValueError(f"bad number at {start}")
        token = m.group(0)
        return float(token) if "." in token else int(token), start + len(token)

    if ch in ("'", '"'):
        quote = ch
        i = start + 1
        buf: list[str] = []
        while i < n:
            c = source[i]
            if c == "\\":
                buf.append(source[i + 1])
                i += 2
                continue
            if c == quote:
                return "".join(buf), i + 1
            buf.append(c)
            i += 1
        raise ValueError("unterminated string")

    if ch == "[":
        items: list[Any] = []
        i = start + 1
        while True:
            while i < n and source[i] in " \t\r\n,":
                i += 1
            if i < n and source[i] == "]":
                return items, i + 1
            value, i = extract_js_value(source, i)
            items.append(value)

    if ch == "{":
        obj: dict[str, Any] = {}
        i = start + 1
        while True:
            while i < n and source[i] in " \t\r\n,":
                i += 1
            if i < n and source[i] == "}":
                return obj, i + 1
            key, i = extract_js_value(source, i)
            while i < n and source[i] in " \t\r\n:":
                i += 1
            value, i = extract_js_value(source, i)
            obj[str(key)] = value

    raise ValueError(f"unsupported token {source[start:start + 20]!r} at {start}")


def find_named_array(source: str, name: str, occurrence: int = 0) -> list[Any]:
    """Find an exact `name: 'X'` series, then the following `data: [` array."""
    pattern = re.compile(rf"""["']?name["']?\s*:\s*['"]{re.escape(name)}['"]""")
    matches = list(pattern.finditer(source))
    if occurrence >= len(matches):
        raise KeyError(f"series {name!r} occurrence {occurrence} not found")
    idx = matches[occurrence].end()
    data_idx = source.find("data:", idx)
    if data_idx < 0:
        raise KeyError(f"no data: after {name!r}")
    bracket = source.find("[", data_idx)
    value, _ = extract_js_value(source, bracket)
    if not isinstance(value, list):
        raise TypeError(f"{name} data is not an array")
    return value


def find_first_array_after(source: str, marker: str) -> list[Any]:
    idx = source.find(marker)
    if idx < 0:
        raise KeyError(marker)
    bracket = source.find("[", idx)
    value, _ = extract_js_value(source, bracket)
    if not isinstance(value, list):
        raise TypeError(f"value after {marker!r} is not an array")
    return value


def mean(values: list[float]) -> float:
    return sum(values) / len(values)


def pstdev(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    mu = mean(values)
    return math.sqrt(sum((v - mu) ** 2 for v in values) / (len(values) - 1))


def pearson(xs: list[float], ys: list[float]) -> float:
    n = len(xs)
    mx, my = mean(xs), mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den_x = math.sqrt(sum((x - mx) ** 2 for x in xs))
    den_y = math.sqrt(sum((y - my) ** 2 for y in ys))
    return num / (den_x * den_y) if den_x and den_y else 0.0


def ols(xs: list[float], ys: list[float]) -> dict[str, float]:
    n = len(xs)
    mx, my = mean(xs), mean(ys)
    var_x = sum((x - mx) ** 2 for x in xs)
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    slope = cov / var_x if var_x else 0.0
    intercept = my - slope * mx
    residuals = [y - (slope * x + intercept) for x, y in zip(xs, ys)]
    sse = sum(r * r for r in residuals)
    sst = sum((y - my) ** 2 for y in ys)
    rmse = math.sqrt(sse / n)
    r2 = 1 - sse / sst if sst else 1.0
    return {
        "slope": slope,
        "intercept": intercept,
        "rmse": rmse,
        "r_squared": r2,
        "n": n,
    }


def summarize_pairs(pairs: list[list[float]], x_name: str, y_name: str) -> dict[str, Any]:
    xs = [p[0] for p in pairs]
    ys = [p[1] for p in pairs]
    fit = ols(xs, ys)
    return {
        "n": len(pairs),
        x_name: {"min": min(xs), "max": max(xs), "mean": mean(xs), "stdev": pstdev(xs)},
        y_name: {"min": min(ys), "max": max(ys), "mean": mean(ys), "stdev": pstdev(ys)},
        "pearson_r": pearson(xs, ys),
        "ols": fit,
    }


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def fmt(value: float, digits: int = 3) -> str:
    return f"{value:.{digits}f}"


def main() -> None:
    index_src = INDEX_JS.read_text(encoding="utf-8")
    draw1_src = DRAW1_JS.read_text(encoding="utf-8")
    draw2_src = DRAW2_JS.read_text(encoding="utf-8")

    female = find_named_array(index_src, "女性")
    male = find_named_array(index_src, "男性")
    girl_len = find_named_array(index_src, "女生脚长（cm）")
    boy_len = find_named_array(index_src, "男生脚长（cm）")
    length_diff = find_named_array(index_src, "女生脚长与男生脚长之差")
    ages = find_first_array_after(index_src, "data: [6, 7, 8, 9, 10")
    girl_ratio = find_named_array(index_src, "女生脚胖瘦度")
    boy_ratio = find_named_array(index_src, "男生脚胖瘦度")
    bmi = find_first_array_after(index_src, "data: [12, 13, 14, 15, 16")

    thin_values = re.findall(
        r"center: \['83%', '33%'\][\s\S]+?value: (\d+),[\s\S]+?value: (\d+),",
        index_src,
    )[0]
    fat_values = re.findall(
        r"center: \['83%', '72%'\][\s\S]+?value: (\d+),[\s\S]+?value: (\d+),",
        index_src,
    )[0]

    radar_age = {
        "9岁": [43, 29, 37, 37, 38, 31, 41],
        "10岁": [53, 32, 42, 46, 43, 42, 49],
        "11岁": [66, 37, 47, 60, 57, 59, 65],
        "12岁": [84, 45, 55, 70, 71, 71, 79],
    }

    pressure_sites = find_first_array_after(draw1_src, "boundaryGap: false")
    pressure_normal = find_named_array(draw1_src, "正常人群")
    pressure_diabetic = find_named_array(draw1_src, "糖尿病足人群")

    thickness_normal = find_named_array(draw2_src, "正常人群(成年)数据:mm")
    thickness_diabetic = find_named_array(draw2_src, "糖尿病足人群(成年)数据:mm")
    thickness_diff = find_named_array(draw2_src, "差值:um")

    female_pairs = [[float(a), float(b)] for a, b in female]
    male_pairs = [[float(a), float(b)] for a, b in male]
    female_stats = summarize_pairs(female_pairs, "height_cm", "shoe_last_cm")
    male_stats = summarize_pairs(male_pairs, "height_cm", "shoe_last_cm")

    catalog = {
        "project": "pang990801.github.io",
        "title": "中国人群脚型数据可视化 / Children's foot-shape visualization",
        "year": 2020,
        "note": (
            "Personal archive extracted from the 2020 GitHub Pages dashboard. "
            "Values are copied from the published chart scripts; they are not "
            "a newly collected clinical sample."
        ),
        "datasets": [
            "height-shoe-size.json",
            "age-foot-length.json",
            "bmi-foot-ratio.json",
            "growth-radar.json",
            "bilateral-symmetry.json",
            "plantar-pressure.json",
            "tissue-thickness.json",
        ],
    }

    height_shoe = {
        "id": "height-shoe-size",
        "title": "Height vs shoe last length",
        "title_zh": "男童女童身高与鞋码的关系",
        "source_file": "js/index.js",
        "fields": {
            "height_cm": "Standing height in centimetres",
            "shoe_last_cm": "Charted as 鞋码; stored as a centimetre last length, not a Mondopoint integer",
        },
        "series": {
            "female": {"label": "女性", "points": female_pairs, "stats": female_stats},
            "male": {"label": "男性", "points": male_pairs, "stats": male_stats},
        },
    }

    age_foot = {
        "id": "age-foot-length",
        "title": "Mean foot length by age",
        "title_zh": "男童女童年龄与脚长的关系",
        "source_file": "js/index.js",
        "ages": ages,
        "units": {"age": "years", "length": "cm"},
        "female_cm": girl_len,
        "male_cm": boy_len,
        "female_minus_male_cm": length_diff,
        "notes": [
            "Girls are slightly longer on average at ages 6–10.",
            "Boys overtake after age 11 in this series (difference becomes negative).",
            "Age 8 and 9 dip relative to age 7; treat the series as a charted mean, not a growth table.",
        ],
    }

    thin_share = int(thin_values[0]) / (int(thin_values[0]) + int(thin_values[1]))
    fat_share = int(fat_values[0]) / (int(fat_values[0]) + int(fat_values[1]))
    bmi_foot = {
        "id": "bmi-foot-ratio",
        "title": "BMI vs foot plumpness (length/width)",
        "title_zh": "儿童BMI与脚的胖瘦度关系",
        "source_file": "js/index.js",
        "bmi": bmi,
        "female_ratio": girl_ratio,
        "male_ratio": boy_ratio,
        "ratio_definition": "脚长 / 脚宽 as charted on the dashboard (larger = slimmer / longer relative to width)",
        "ring_charts": {
            "thin_feet": {
                "label_zh": "过瘦脚占比",
                "highlighted": int(thin_values[0]),
                "remainder": int(thin_values[1]),
                "highlighted_share": thin_share,
            },
            "plump_feet": {
                "label_zh": "过胖脚占比",
                "highlighted": int(fat_values[0]),
                "remainder": int(fat_values[1]),
                "highlighted_share": fat_share,
            },
        },
    }

    growth_radar = {
        "id": "growth-radar",
        "title": "Normalized growth radar by age",
        "title_zh": "9–12岁形态雷达图",
        "source_file": "js/index.js",
        "scale": "Each axis is a 0–100 dashboard index, not a raw millimetre measurement.",
        "axes": ["身高", "兜跟围长", "跗骨围长", "跖趾围长", "鞋码", "脚长", "体重"],
        "axes_en": [
            "height",
            "heel_girth",
            "tarsal_girth",
            "metatarsal_girth",
            "shoe_last",
            "foot_length",
            "weight",
        ],
        "series": radar_age,
        "notes": [
            "The live script writes 12-year shoe last as 77-6 and foot length as 79-8; stored here as 71 and 71.",
            "china.js / myMap.js were drafted as a map layer and are not used by the radar.",
        ],
    }

    bilateral = {
        "id": "bilateral-symmetry",
        "title": "Left/right foot proportion by age",
        "title_zh": "儿童双脚比例",
        "source_file": "js/index.js",
        "model": "Illustrative timeline, not a raw sample count. Shares are generated from decaying log terms.",
        "ages": [f"{age}岁" for age in range(2, 15)],
        "formula": {
            "a": "round(36 - 13 * log(i+1))",
            "b": "round(17 - 6 * log(i+1))",
            "c": "round(11 - 4 * log(i+1))",
            "d": "round(27 - 10 * log(i+1))",
            "same": "63 + a + b + c + d",
            "i": "0-based age index from 2岁 to 14岁",
        },
        "categories": [
            "双脚相同",
            "左脚比右脚大10-20%",
            "左脚比右脚大20%以上",
            "右脚比左脚大20%以上",
            "右脚比左脚大10-20%",
        ],
        "points": [],
    }
    for i, label in enumerate(bilateral["ages"]):
        a = round(36 - 13 * math.log(i + 1))
        b = round(17 - 6 * math.log(i + 1))
        c = round(11 - 4 * math.log(i + 1))
        d = round(27 - 10 * math.log(i + 1))
        same = 63 + a + b + c + d
        bilateral["points"].append(
            {
                "age": label,
                "same": same,
                "left_10_20": a,
                "left_over_20": b,
                "right_over_20": c,
                "right_10_20": d,
            }
        )

    plantar = {
        "id": "plantar-pressure",
        "title": "Plantar pressure by site",
        "title_zh": "足部压力数据图",
        "source_file": "draw1.js",
        "wired_in_dashboard": False,
        "units": "Pa as labelled in the unused option file",
        "sites": pressure_sites,
        "normal_pa": pressure_normal,
        "diabetic_foot_pa": pressure_diabetic,
        "notes": [
            "draw1.js was never mounted by index.html; this dataset only appears in the examples.",
            "A third legend entry 潍V has no series data in the source file.",
        ],
    }

    thickness = {
        "id": "tissue-thickness",
        "title": "Plantar soft-tissue thickness by site",
        "title_zh": "足底各位点皮下组织厚度数据图",
        "source_file": "draw2.js",
        "wired_in_dashboard": False,
        "sites": [f"位点{i}" for i in range(1, 15)],
        "normal_adult_mm": thickness_normal,
        "diabetic_foot_adult_mm": thickness_diabetic,
        "difference_labelled_um": thickness_diff,
        "notes": [
            "The line series is labelled 差值:um while the bars are millimetres.",
            "Numeric differences (diabetic - normal) * 10 roughly track the um series but do not match exactly.",
            "draw2.js was never mounted by index.html.",
        ],
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    write_json(DATA_DIR / "catalog.json", catalog)
    write_json(DATA_DIR / "height-shoe-size.json", height_shoe)
    write_json(DATA_DIR / "age-foot-length.json", age_foot)
    write_json(DATA_DIR / "bmi-foot-ratio.json", bmi_foot)
    write_json(DATA_DIR / "growth-radar.json", growth_radar)
    write_json(DATA_DIR / "bilateral-symmetry.json", bilateral)
    write_json(DATA_DIR / "plantar-pressure.json", plantar)
    write_json(DATA_DIR / "tissue-thickness.json", thickness)

    bundle = {
        "catalog": catalog,
        "heightShoe": height_shoe,
        "ageFoot": age_foot,
        "bmiFoot": bmi_foot,
        "growthRadar": growth_radar,
        "bilateral": bilateral,
        "plantar": plantar,
        "thickness": thickness,
    }
    EXAMPLES_JS.parent.mkdir(parents=True, exist_ok=True)
    examples_src = (
        "/* Generated by scripts/extract_data.py — do not edit by hand. */\n"
        "window.FOOT_DATA = "
        + json.dumps(bundle, ensure_ascii=False, indent=2)
        + ";\n"
    )
    EXAMPLES_JS.write_text(examples_src, encoding="utf-8")

    STATS_MD.parent.mkdir(parents=True, exist_ok=True)
    STATS_MD.write_text(
        "\n".join(
            [
                "# Generated stats",
                "",
                "Produced by `python3 scripts/extract_data.py`. Re-run that script after changing the dashboard arrays.",
                "",
                "## Height vs shoe last",
                "",
                f"- Female n = {female_stats['n']}, height {fmt(female_stats['height_cm']['mean'])} ± {fmt(female_stats['height_cm']['stdev'])} cm, shoe last {fmt(female_stats['shoe_last_cm']['mean'])} ± {fmt(female_stats['shoe_last_cm']['stdev'])} cm",
                f"- Female Pearson r = {fmt(female_stats['pearson_r'])}, OLS shoe_cm = {fmt(female_stats['ols']['slope'])} × height + {fmt(female_stats['ols']['intercept'])}, R² = {fmt(female_stats['ols']['r_squared'])}, RMSE = {fmt(female_stats['ols']['rmse'])} cm",
                f"- Male n = {male_stats['n']}, height {fmt(male_stats['height_cm']['mean'])} ± {fmt(male_stats['height_cm']['stdev'])} cm, shoe last {fmt(male_stats['shoe_last_cm']['mean'])} ± {fmt(male_stats['shoe_last_cm']['stdev'])} cm",
                f"- Male Pearson r = {fmt(male_stats['pearson_r'])}, OLS shoe_cm = {fmt(male_stats['ols']['slope'])} × height + {fmt(male_stats['ols']['intercept'])}, R² = {fmt(male_stats['ols']['r_squared'])}, RMSE = {fmt(male_stats['ols']['rmse'])} cm",
                "",
                "## Age vs mean foot length",
                "",
                f"- Ages {ages[0]}–{ages[-1]}",
                f"- Girl lengths: {', '.join(str(v) for v in girl_len)}",
                f"- Boy lengths: {', '.join(str(v) for v in boy_len)}",
                f"- Girl − boy: {', '.join(str(v) for v in length_diff)}",
                "",
                "## BMI vs plumpness rings",
                "",
                f"- Thin-feet ring highlight {thin_values[0]} / {int(thin_values[0]) + int(thin_values[1])} = {thin_share:.1%}",
                f"- Plump-feet ring highlight {fat_values[0]} / {int(fat_values[0]) + int(fat_values[1])} = {fat_share:.1%}",
                "",
                "## Unused option files",
                "",
                f"- Plantar pressure sites: {len(pressure_sites)}",
                f"- Tissue thickness sites: {len(thickness_normal)}",
                "",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"wrote {DATA_DIR}")
    print(f"female={len(female_pairs)} male={len(male_pairs)}")
    print(f"wrote {EXAMPLES_JS}")
    print(f"wrote {STATS_MD}")


if __name__ == "__main__":
    main()
