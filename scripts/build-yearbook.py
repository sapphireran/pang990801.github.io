#!/usr/bin/env python3
"""Extract personal dashboard series into the field-yearbook data pack.

Reads only files already in this personal GitHub Pages repo
(js/index.js, draw1.js, draw2.js) and writes JSON plus a browser payload.
No company data is involved.
"""

from __future__ import annotations

import json
import math
import re
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "yearbook"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_number_list(block: str) -> list[float]:
    return [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", block)]


def parse_pair_list(block: str) -> list[list[float]]:
    pairs = re.findall(r"\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]", block)
    return [[float(a), float(b)] for a, b in pairs]


def extract_named_pairs(source: str, name: str) -> list[list[float]]:
    pattern = rf"name:\s*'{re.escape(name)}'[\s\S]*?data:\s*(\[[\s\S]*?\])\s*,\s*markArea"
    match = re.search(pattern, source)
    if not match:
        raise SystemExit(f"Could not find scatter series {name!r}")
    return parse_pair_list(match.group(1))


def extract_named_values(source: str, name: str) -> list[float]:
    pattern = (
        rf"(?:name:\s*'{re.escape(name)}'|\"name\":\s*\"{re.escape(name)}\")"
        rf"[\s\S]*?(?:data:\s*|\"data\":\s*)(\[[\s\S]*?\])"
    )
    match = re.search(pattern, source)
    if not match:
        raise SystemExit(f"Could not find series {name!r}")
    return parse_number_list(match.group(1))


def mean(values: list[float]) -> float:
    return statistics.fmean(values)


def pearson(xs: list[float], ys: list[float]) -> float:
    n = len(xs)
    if n < 2:
        return 0.0
    mx, my = mean(xs), mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den_x = math.sqrt(sum((x - mx) ** 2 for x in xs))
    den_y = math.sqrt(sum((y - my) ** 2 for y in ys))
    if den_x == 0 or den_y == 0:
        return 0.0
    return num / (den_x * den_y)


def ols(xs: list[float], ys: list[float]) -> dict[str, float]:
    n = len(xs)
    mx, my = mean(xs), mean(ys)
    var_x = sum((x - mx) ** 2 for x in xs)
    slope = 0.0 if var_x == 0 else sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / var_x
    intercept = my - slope * mx
    predicted = [slope * x + intercept for x in xs]
    ss_res = sum((y - y_hat) ** 2 for y, y_hat in zip(ys, predicted))
    ss_tot = sum((y - my) ** 2 for y in ys)
    r2 = 0.0 if ss_tot == 0 else 1 - ss_res / ss_tot
    return {
        "n": n,
        "slope": round(slope, 6),
        "intercept": round(intercept, 6),
        "r2": round(r2, 6),
        "r": round(pearson(xs, ys), 6),
        "mean_x": round(mx, 4),
        "mean_y": round(my, 4),
        "min_x": round(min(xs), 4),
        "max_x": round(max(xs), 4),
        "min_y": round(min(ys), 4),
        "max_y": round(max(ys), 4),
    }


def summarize_pairs(pairs: list[list[float]], sex: str) -> dict:
    xs = [p[0] for p in pairs]
    ys = [p[1] for p in pairs]
    fit = ols(xs, ys)
    fit["sex"] = sex
    fit["points"] = pairs
    return fit


def symmetry_from_formula() -> list[dict]:
    ages = list(range(2, 15))
    rows = []
    for i, age in enumerate(ages):
        left_10_20 = round(36 - 13 * math.log(i + 1))
        left_over_20 = round(17 - 6 * math.log(i + 1))
        right_over_20 = round(11 - 4 * math.log(i + 1))
        right_10_20 = round(27 - 10 * math.log(i + 1))
        same = 63 + left_10_20 + left_over_20 + right_over_20 + right_10_20
        total = same + left_10_20 + left_over_20 + right_over_20 + right_10_20
        rows.append(
            {
                "age": age,
                "label_zh": f"{age}岁",
                "label_en": f"age {age}",
                "same": same,
                "left_10_20": left_10_20,
                "left_over_20": left_over_20,
                "right_over_20": right_over_20,
                "right_10_20": right_10_20,
                "total": total,
                "same_pct": round(100 * same / total, 2),
                "asymmetric_pct": round(100 * (total - same) / total, 2),
            }
        )
    return rows


def write_json(name: str, payload: object) -> None:
    path = OUT / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    index_js = read(ROOT / "js" / "index.js")
    draw1 = read(ROOT / "draw1.js")
    draw2 = read(ROOT / "draw2.js")

    girls = extract_named_pairs(index_js, "女性")
    boys = extract_named_pairs(index_js, "男性")
    girl_fit = summarize_pairs(girls, "girl")
    boy_fit = summarize_pairs(boys, "boy")
    all_pairs = girls + boys
    combined_fit = summarize_pairs(all_pairs, "all")

    height_shoe = {
        "id": "height-shoe",
        "title_zh": "男童女童身高与鞋码的关系",
        "title_en": "Height and shoe length by sex",
        "source": "js/index.js (.bar .chart)",
        "units": {"x": "cm", "y": "cm", "x_name_zh": "身高", "y_name_zh": "鞋码"},
        "note_zh": "散点取自原仪表盘；鞋码轴在源码里按厘米标注。",
        "note_en": "Scatter points are copied from the original dashboard. The shoe axis is labeled in centimeters in the source.",
        "girls": girls,
        "boys": boys,
        "fits": {
            "girls": {k: v for k, v in girl_fit.items() if k != "points"},
            "boys": {k: v for k, v in boy_fit.items() if k != "points"},
            "all": {k: v for k, v in combined_fit.items() if k != "points"},
        },
    }

    ages = list(range(6, 15))
    girl_len = extract_named_values(index_js, "女生脚长（cm）")
    boy_len = extract_named_values(index_js, "男生脚长（cm）")
    # Source also stores the signed difference as its own series.
    diff_match = re.search(
        r"name:\s*'女生脚长与男生脚长之差'[\s\S]*?data:\s*(\[[\s\S]*?\])",
        index_js,
    )
    if not diff_match:
        raise SystemExit("Could not find foot-length difference series")
    stored_diff = parse_number_list(diff_match.group(1))
    computed_diff = [round(g - b, 2) for g, b in zip(girl_len, boy_len)]
    crossover_age = None
    for age, delta in zip(ages, computed_diff):
        if delta < 0:
            crossover_age = age
            break

    age_foot = {
        "id": "age-foot-length",
        "title_zh": "男童女童年龄与脚长的关系",
        "title_en": "Foot length by age and sex",
        "source": "js/index.js (.line .chart)",
        "units": {"x": "years", "y": "cm"},
        "ages": ages,
        "girls_cm": girl_len,
        "boys_cm": boy_len,
        "difference_cm": stored_diff,
        "difference_recomputed_cm": computed_diff,
        "crossover_age": crossover_age,
        "note_zh": "差值 = 女童脚长 − 男童脚长。源码在约 11 岁后转为负值。",
        "note_en": "Difference is girl minus boy. The source series turns negative after about age 11.",
    }

    bmi_axis = list(range(12, 25))
    girl_bmi = extract_named_values(index_js, "女生脚胖瘦度")
    boy_bmi = extract_named_values(index_js, "男生脚胖瘦度")
    pie_rows = [
        {
            "value": 50,
            "placeholder": 180,
            "percent": round(100 * 50 / (50 + 180), 2),
            "label_zh": "过瘦脚占比",
            "label_en": "narrow-foot share",
        },
        {
            "value": 435,
            "placeholder": 2400,
            "percent": round(100 * 435 / (435 + 2400), 2),
            "label_zh": "过胖脚占比",
            "label_en": "wide-foot share",
        },
    ]

    bmi_shape = {
        "id": "bmi-shape",
        "title_zh": "儿童BMI与脚的胖瘦度关系",
        "title_en": "BMI versus length-to-width ratio",
        "source": "js/index.js (.bar1 .chart)",
        "units": {"x": "BMI", "y": "source label: 脚长/脚宽"},
        "bmi": bmi_axis,
        "girls": girl_bmi,
        "boys": boy_bmi,
        "inset_pies": pie_rows,
        "note_zh": "纵轴在源码里写作“脚长/脚宽”，数值大约在 23–30。嵌套环图沿用原文件里的占位比例。",
        "note_en": "The y-axis is labeled length/width in the source, with values around 23–30. Inset rings reuse the original placeholder ratios.",
    }

    symmetry = {
        "id": "foot-symmetry",
        "title_zh": "儿童双脚比例",
        "title_en": "Left/right foot proportion by age",
        "source": "js/index.js (.line1 .chart)",
        "formula_zh": "源码用自然对数衰减生成 2–14 岁的五类比例，不是逐人实测。",
        "formula_en": "The source synthesizes five bins for ages 2–14 with a natural-log decay. These are not person-level measurements.",
        "rows": symmetry_from_formula(),
    }

    radar_dims = ["身高", "兜跟围长", "跗骨围长", "跖趾围长", "鞋码", "脚长", "体重"]
    radar_en = [
        "height",
        "heel girth",
        "tarsal girth",
        "ball girth",
        "shoe size",
        "foot length",
        "weight",
    ]
    radar_values = {
        9: [43, 29, 37, 37, 38, 31, 41],
        10: [53, 32, 42, 46, 43, 42, 49],
        11: [66, 37, 47, 60, 57, 59, 65],
        12: [84, 45, 55, 70, 77 - 6, 79 - 8, 79],
    }
    radar = {
        "id": "radar-growth",
        "title_zh": "9–12 岁七维轮廓",
        "title_en": "Seven-dimension profiles, ages 9–12",
        "source": "js/index.js (.map .chart)",
        "dimensions_zh": radar_dims,
        "dimensions_en": radar_en,
        "scale_note_zh": "源码把每维最大值设为 100，数值是相对刻度，不是厘米或千克。",
        "scale_note_en": "Each spoke is capped at 100 in the source. Values are relative scores, not cm or kg.",
        "series": [
            {
                "age": age,
                "values": values,
                "sum": sum(values),
                "max_dimension_zh": radar_dims[values.index(max(values))],
            }
            for age, values in radar_values.items()
        ],
    }

    pressure_sites = [f"位点{i}" for i in range(1, 8)]
    pressure_normal = [90, 50, 39, 50, 120, 82, 80]
    pressure_diabetic = [290, 200, 20, 132, 15, 200, 90]
    pressure = {
        "id": "plantar-pressure",
        "title_zh": "足部压力数据图",
        "title_en": "Plantar pressure sketch (leftover)",
        "source": "draw1.js (not mounted by index.html)",
        "units": "Pa",
        "sites": pressure_sites,
        "normal": pressure_normal,
        "diabetic_foot": pressure_diabetic,
        "delta": [d - n for d, n in zip(pressure_diabetic, pressure_normal)],
        "status": "leftover",
        "note_zh": "根目录遗稿，原首页没有挂载。仅作文档与示例对照。",
        "note_en": "Root leftover file. The live homepage does not load it. Kept for documentation and the annex example.",
    }

    thick_sites = [f"位点{i}" for i in range(1, 15)]
    thick_normal = extract_named_values(draw2, "正常人群(成年)数据:mm")
    thick_diabetic = extract_named_values(draw2, "糖尿病足人群(成年)数据:mm")
    thick_delta = extract_named_values(draw2, "差值:um")
    thickness = {
        "id": "plantar-thickness",
        "title_zh": "足底各位点皮下组织厚度数据图",
        "title_en": "Plantar tissue thickness sketch (leftover)",
        "source": "draw2.js (not mounted by index.html)",
        "sites": thick_sites,
        "normal_mm": thick_normal,
        "diabetic_mm": thick_diabetic,
        "delta_um": thick_delta,
        "status": "leftover",
        "note_zh": "成年对照遗稿，不是儿童仪表盘的一部分。",
        "note_en": "Adult comparison leftover, not part of the children's dashboard.",
    }

    files = {
        "live": [
            {"path": "index.html", "role_en": "homepage shell", "role_zh": "首页骨架"},
            {"path": "css/index.css", "role_en": "dashboard layout", "role_zh": "仪表盘样式"},
            {"path": "js/index.js", "role_en": "five live charts", "role_zh": "五个在线图表"},
            {"path": "js/flexible.js", "role_en": "rem scaling", "role_zh": "rem 适配"},
            {"path": "js/jquery.js", "role_en": "nav helpers", "role_zh": "导航辅助"},
            {"path": "js/echarts.js", "role_en": "chart library", "role_zh": "图表库"},
            {"path": "js/echarts.min.js", "role_en": "minified chart library", "role_zh": "压缩图表库"},
            {"path": "js/click.js", "role_en": "unused tab handlers", "role_zh": "未用到的页签脚本"},
            {"path": "js/macarons.js", "role_en": "theme file loaded in head", "role_zh": "页头载入的主题"},
        ],
        "leftover": [
            {"path": "draw1.js", "role_en": "plantar pressure option", "role_zh": "足压 option 遗稿"},
            {"path": "draw2.js", "role_en": "tissue thickness option", "role_zh": "组织厚度 option 遗稿"},
            {"path": "js/china.js", "role_en": "China geo JSON, commented out", "role_zh": "中国地图，首页已注释"},
            {"path": "js/myMap.js", "role_en": "flight-line map, commented out", "role_zh": "航线图，首页已注释"},
            {"path": "js/macarons.json", "role_en": "theme JSON duplicate", "role_zh": "主题 JSON 副本"},
            {"path": "index_new.css", "role_en": "unused stylesheet", "role_zh": "未引用样式"},
            {"path": "css/index.less", "role_en": "Less source for dashboard CSS", "role_zh": "仪表盘 Less 源"},
        ],
    }

    catalog = {
        "project_zh": "中国人群脚型数据可视化 · 田野年鉴",
        "project_en": "Chinese children's foot-shape visualization — field yearbook",
        "personal": True,
        "company_code": False,
        "live_charts": [
            height_shoe["id"],
            age_foot["id"],
            bmi_shape["id"],
            symmetry["id"],
            radar["id"],
        ],
        "leftover_charts": [pressure["id"], thickness["id"]],
        "datasets": [
            {
                "id": item["id"],
                "file": f"{item['id']}.json",
                "title_zh": item["title_zh"],
                "title_en": item["title_en"],
                "source": item["source"],
            }
            for item in (
                height_shoe,
                age_foot,
                bmi_shape,
                symmetry,
                radar,
                pressure,
                thickness,
            )
        ],
    }

    stats = {
        "height_shoe": {
            "girls": height_shoe["fits"]["girls"],
            "boys": height_shoe["fits"]["boys"],
            "all": height_shoe["fits"]["all"],
            "n_girls": len(girls),
            "n_boys": len(boys),
        },
        "age_foot_length": {
            "girl_gain_cm": round(girl_len[-1] - girl_len[0], 2),
            "boy_gain_cm": round(boy_len[-1] - boy_len[0], 2),
            "crossover_age": crossover_age,
            "max_girl_lead_cm": max(computed_diff),
            "max_boy_lead_cm": abs(min(computed_diff)),
        },
        "symmetry": {
            "age2_same_pct": symmetry["rows"][0]["same_pct"],
            "age14_same_pct": symmetry["rows"][-1]["same_pct"],
        },
        "radar": {
            "sum_by_age": {str(row["age"]): row["sum"] for row in radar["series"]}
        },
    }

    write_json("height-shoe.json", height_shoe)
    write_json("age-foot-length.json", age_foot)
    write_json("bmi-shape.json", bmi_shape)
    write_json("foot-symmetry.json", symmetry)
    write_json("radar-growth.json", radar)
    write_json("plantar-pressure.json", pressure)
    write_json("plantar-thickness.json", thickness)
    write_json("catalog.json", catalog)
    write_json("stats.json", stats)
    write_json("files.json", files)

    payload = {
        "catalog": catalog,
        "stats": stats,
        "files": files,
        "heightShoe": height_shoe,
        "ageFoot": age_foot,
        "bmiShape": bmi_shape,
        "symmetry": symmetry,
        "radar": radar,
        "pressure": pressure,
        "thickness": thickness,
    }
    (OUT / "payload.js").write_text(
        "window.YEARBOOK = "
        + json.dumps(payload, ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )

    print(f"Wrote yearbook pack to {OUT}")
    print(f"  girls={len(girls)} boys={len(boys)} crossover={crossover_age}")


if __name__ == "__main__":
    main()
