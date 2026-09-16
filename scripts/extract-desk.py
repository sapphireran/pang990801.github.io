#!/usr/bin/env python3
"""Extract series already hardcoded in this personal 2020 dashboard.

The Night Desk pages read these JSON files. Nothing here is a new field
measurement, a clinical claim, or a factory last specification.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "desk"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def find_floats(text: str, needle: str) -> list[float]:
    idx = text.find(needle)
    if idx < 0:
        raise SystemExit(f"missing needle: {needle!r}")
    chunk = text[idx : idx + 2500]
    match = re.search(r"data:\s*\[([\d\s.,\-]+)\]", chunk)
    if not match:
        raise SystemExit(f"no data array after {needle!r}")
    return [float(x) for x in match.group(1).split(",") if x.strip()]


def find_int_list(text: str, needle: str) -> list[int]:
    idx = text.find(needle)
    if idx < 0:
        raise SystemExit(f"missing needle: {needle!r}")
    chunk = text[idx : idx + 400]
    match = re.search(r"data:\s*\[([\d\s,\-]+)\]", chunk)
    if not match:
        raise SystemExit(f"no int array after {needle!r}")
    return [int(x) for x in match.group(1).split(",") if x.strip()]


def extract_scatter_pairs(text: str) -> tuple[list[list[float]], list[list[float]]]:
    pairs = [
        [float(a), float(b)]
        for a, b in re.findall(r"\[(\d+\.\d+),\s*(\d+\.\d+)\]", text)
    ]
    if len(pairs) < 300:
        raise SystemExit(f"expected hundreds of scatter pairs, got {len(pairs)}")
    # First IIFE in js/index.js draws female then male. The only [x.y, x.y]
    # literals in that file are those two clouds.
    mid = len(pairs) // 2
    female, male = pairs[:mid], pairs[mid:]
    if len(female) != len(male):
        raise SystemExit(f"scatter split uneven: {len(female)} vs {len(male)}")
    return female, male


def ols(points: list[list[float]]) -> dict:
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    n = len(points)
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = sum((x - mx) ** 2 for x in xs)
    slope = num / den
    intercept = my - slope * mx
    ss_tot = sum((y - my) ** 2 for y in ys)
    ss_res = sum((y - (intercept + slope * x)) ** 2 for x, y in zip(xs, ys))
    r2 = 1 - ss_res / ss_tot if ss_tot else 0.0
    residuals = [round(y - (intercept + slope * x), 4) for x, y in zip(xs, ys)]
    return {
        "n": n,
        "mean_x": round(mx, 4),
        "mean_y": round(my, 4),
        "min_x": min(xs),
        "max_x": max(xs),
        "min_y": min(ys),
        "max_y": max(ys),
        "slope": round(slope, 6),
        "intercept": round(intercept, 6),
        "r2": round(r2, 6),
        "rmse": round(math.sqrt(ss_res / n), 4),
        "residual_min": min(residuals),
        "residual_max": max(residuals),
        "residual_abs_median": round(sorted(abs(r) for r in residuals)[n // 2], 4),
    }


def percentile(values: list[float], p: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    k = (len(ordered) - 1) * p
    lo = math.floor(k)
    hi = math.ceil(k)
    if lo == hi:
        return ordered[lo]
    return ordered[lo] * (hi - k) + ordered[hi] * (k - lo)


def residual_bins(points: list[list[float]], fit: dict) -> list[dict]:
    residuals = [
        y - (fit["intercept"] + fit["slope"] * x) for x, y in points
    ]
    width = 0.5
    lo = math.floor(min(residuals) / width) * width
    hi = math.ceil(max(residuals) / width) * width
    bins = []
    edge = lo
    while edge < hi - 1e-9:
        nxt = edge + width
        count = sum(1 for r in residuals if edge <= r < nxt)
        bins.append({"from": round(edge, 2), "to": round(nxt, 2), "count": count})
        edge = nxt
    return bins


def symmetry_from_formula(ages: list[str]) -> list[dict]:
    rows = []
    for i, label in enumerate(ages):
        a = round(36 - 13 * math.log(i + 1))
        b = round(17 - 6 * math.log(i + 1))
        c = round(11 - 4 * math.log(i + 1))
        d = round(27 - 10 * math.log(i + 1))
        same = 63 + a + b + c + d
        rows.append(
            {
                "age": label,
                "same": same,
                "left_10_20": a,
                "left_over_20": b,
                "right_over_20": c,
                "right_10_20": d,
                "total": same + a + b + c + d,
            }
        )
    return rows


def dump(name: str, payload: object) -> None:
    path = OUT / name
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {path.relative_to(ROOT)}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    index_js = read("js/index.js")
    draw1 = read("draw1.js")
    draw2 = read("draw2.js")

    female, male = extract_scatter_pairs(index_js)
    female_fit = ols(female)
    male_fit = ols(male)

    ages = list(range(6, 15))
    girls_len = find_floats(index_js, "name: '女生脚长（cm）'")
    boys_len = find_floats(index_js, "name: '男生脚长（cm）'")
    length_diff = find_floats(index_js, "name: '女生脚长与男生脚长之差'")
    if not (len(girls_len) == len(boys_len) == len(length_diff) == len(ages)):
        raise SystemExit("age-foot-length series length mismatch")

    bmi = list(range(12, 25))
    girls_ratio = find_floats(index_js, "name: '女生脚胖瘦度'")
    boys_ratio = find_floats(index_js, "name: '男生脚胖瘦度'")
    if not (len(girls_ratio) == len(boys_ratio) == len(bmi)):
        raise SystemExit("bmi-ratio series length mismatch")

    time_labels = [
        "2岁",
        "3岁",
        "4岁",
        "5岁",
        "6岁",
        "7岁",
        "8岁",
        "9岁",
        "10岁",
        "11岁",
        "12岁",
        "13岁",
        "14岁",
    ]
    symmetry = symmetry_from_formula(time_labels)

    radar = {
        "indicators": [
            "身高",
            "兜跟围长",
            "跗骨围长",
            "跖趾围长",
            "鞋码",
            "脚长",
            "体重",
        ],
        "series": {
            "9岁": [43, 29, 37, 37, 38, 31, 41],
            "10岁": [53, 32, 42, 46, 43, 42, 49],
            "11岁": [66, 37, 47, 60, 57, 59, 65],
            "12岁": [84, 45, 55, 70, 71, 71, 79],
        },
        "note": (
            "The 12-year 鞋码 and 脚长 cells are written in js/index.js as "
            "77-6 and 79-8. The desk stores the evaluated numbers 71 and 71."
        ),
    }

    pressure_sites = ["位点一", "位点二", "位点三", "位点四", "位点五", "位点六", "位点七"]
    pressure_normal = find_int_list(draw1, "name: '正常人群'")
    pressure_dfu = find_int_list(draw1, "name: '糖尿病足人群'")

    thickness_normal = [
        11.6,
        12.3,
        12.1,
        13.7,
        12.6,
        10.4,
        12.2,
        11.6,
        13.2,
        12.9,
        11.4,
        13.4,
        10.2,
        11.5,
    ]
    thickness_dfu = [13.2, 13.6, 12.9, 14.6, 14.9, 13, 15.7, 16.1, 14.2, 15.8, 15.9, 13.7, 12.9, 14.9]
    thickness_delta = [16, 13, 8, 9, 23, 26, 35, 45, 10, 29, 45, 3, 27, 34]
    for label in ("11.6,12.3,12.1,13.7", "13.2,13.6,12.9,14.6", "16,  13,   8,   9"):
        if label.replace(" ", "") not in draw2.replace(" ", ""):
            raise SystemExit(f"draw2.js no longer contains {label}")

    crossover_age = None
    for age, g, b in zip(ages, girls_len, boys_len):
        if b > g:
            crossover_age = age
            break

    clinic = [
        {
            "id": "shoe-cm-not-eu",
            "title": "鞋码轴不是欧码",
            "wrong": "把散点的 Y 轴当成 EU / UK / US 鞋码去对货架。",
            "desk": (
                "面板把 Y 轴标成「鞋码」但单位是 cm，数值大约 10–24 cm，"
                "和脚长同一量级。夜读按脚长/楦长厘米来读，不当成品尺码。"
            ),
            "panel": "height-shoe",
        },
        {
            "id": "ratio-times-ten",
            "title": "胖瘦度更像长宽比×10",
            "wrong": "把 23–30 读成脚长/脚宽的原始比值。",
            "desk": (
                "真人脚长大约是脚宽的 2.4–3.0 倍。面板数值落在 23–30，"
                "更像 (脚长/脚宽)×10。这是读图假设，不是新的测量定义。"
            ),
            "panel": "bmi-ratio",
        },
        {
            "id": "radar-is-normalized",
            "title": "雷达是 0–100 分数",
            "wrong": "把雷达上的 43、71 读成厘米。",
            "desk": (
                "七个轴共用 max: 100。身高和兜跟围不可能落在同一厘米标尺。"
                "只比较年龄之间的形状，不还原围度。"
            ),
            "panel": "radar",
        },
        {
            "id": "symmetry-is-formula",
            "title": "左右脚饼图是公式",
            "wrong": "把各年龄饼图当成实测百分比。",
            "desk": (
                "js/index.js 用 36-13·ln(i+1) 一类表达式生成五类份额。"
                "它演示时间轴，不报告调查样本。"
            ),
            "panel": "symmetry",
        },
        {
            "id": "leftover-adult-dfu",
            "title": "底稿不是儿童面板",
            "wrong": "把 draw1.js / draw2.js 的糖尿病足曲线并进儿童仪表盘。",
            "desk": (
                "两份底稿写的是成年正常人群对糖尿病足人群，从未挂到 index.html。"
                "夜读把它们放在附录，不和 6–14 岁系列混读。"
            ),
            "panel": "leftovers",
        },
        {
            "id": "pie-not-from-lines",
            "title": "过胖/过瘦环不是折线汇总",
            "wrong": "以为右侧双环能从 BMI 折线加总出来。",
            "desk": (
                "过瘦环是 50 / (50+180)，过胖环是 435 / (435+2400)。"
                "这两个分数不能从 12–24 的折线还原，按装饰环处理。"
            ),
            "panel": "bmi-ratio",
        },
        {
            "id": "no-causal-bmi",
            "title": "BMI 与长宽比不是因果",
            "wrong": "读成「BMI 升高导致脚变宽/变瘦」。",
            "desk": (
                "折线只是并排的年龄无关切片。夜读只写「同图出现」，"
                "不写机制，也不写选鞋规则。"
            ),
            "panel": "bmi-ratio",
        },
    ]

    height_shoe = {
        "source": "js/index.js",
        "panel": "男童女童身高与鞋码的关系",
        "units": {
            "x": "height_cm",
            "y": "labeled_shoe_size_cm_read_as_foot_or_last_length",
        },
        "female": female,
        "male": male,
    }
    age_foot = {
        "source": "js/index.js",
        "panel": "男童女童年龄与脚长的关系",
        "ages": ages,
        "girls_cm": girls_len,
        "boys_cm": boys_len,
        "girls_minus_boys_cm": length_diff,
        "first_age_boys_longer": crossover_age,
    }
    bmi_ratio = {
        "source": "js/index.js",
        "panel": "儿童BMI与脚的胖瘦度关系",
        "bmi": bmi,
        "girls": girls_ratio,
        "boys": boys_ratio,
        "thin_pie": {"value": 50, "placeholder": 180},
        "wide_pie": {"value": 435, "placeholder": 2400},
        "reading_hypothesis": "values_look_like_length_over_width_times_10",
    }
    symmetry_doc = {
        "source": "js/index.js",
        "panel": "儿童双脚比例",
        "kind": "formula_demo",
        "formula": {
            "a": "round(36 - 13 * ln(i+1))",
            "b": "round(17 - 6 * ln(i+1))",
            "c": "round(11 - 4 * ln(i+1))",
            "d": "round(27 - 10 * ln(i+1))",
            "same": "63 + a + b + c + d",
        },
        "rows": symmetry,
    }
    pressure = {
        "source": "draw1.js",
        "mounted_on_index": False,
        "title": "足部压力数据图(单位: Pa)",
        "sites": pressure_sites,
        "normal": pressure_normal,
        "diabetic_foot": pressure_dfu,
        "population_note": "adult contrast in the leftover file, not the child dashboard",
    }
    thickness = {
        "source": "draw2.js",
        "mounted_on_index": False,
        "title": "足底各位点皮下组织厚度数据图",
        "sites": [f"位点{i}" for i in range(1, 15)],
        "normal_mm": thickness_normal,
        "diabetic_foot_mm": thickness_dfu,
        "delta_um_as_written": thickness_delta,
        "delta_note": (
            "The series is labeled 差值:um but the numbers are small integers. "
            "The desk keeps the literals and does not convert units."
        ),
    }

    stats = {
        "female_ols": female_fit,
        "male_ols": male_fit,
        "female_residual_bins": residual_bins(female, female_fit),
        "male_residual_bins": residual_bins(male, male_fit),
        "age_crossover": {
            "first_age_boys_longer": crossover_age,
            "girl_at_that_age": girls_len[ages.index(crossover_age)],
            "boy_at_that_age": boys_len[ages.index(crossover_age)],
        },
        "height_percentiles": {
            "female_p10": round(percentile([p[0] for p in female], 0.10), 2),
            "female_p50": round(percentile([p[0] for p in female], 0.50), 2),
            "female_p90": round(percentile([p[0] for p in female], 0.90), 2),
            "male_p10": round(percentile([p[0] for p in male], 0.10), 2),
            "male_p50": round(percentile([p[0] for p in male], 0.50), 2),
            "male_p90": round(percentile([p[0] for p in male], 0.90), 2),
        },
        "pie_shares": {
            "thin_ring": round(50 / (50 + 180), 4),
            "wide_ring": round(435 / (435 + 2400), 4),
        },
    }

    catalog = {
        "name": "night-desk",
        "kind": "personal reprint of hardcoded 2020 dashboard series",
        "claims": "none-clinical none-factory",
        "sources": {
            "js/index.js": sha256(ROOT / "js" / "index.js"),
            "draw1.js": sha256(ROOT / "draw1.js"),
            "draw2.js": sha256(ROOT / "draw2.js"),
        },
        "files": [
            "height-shoe.json",
            "age-foot-length.json",
            "bmi-ratio.json",
            "symmetry.json",
            "radar.json",
            "plantar-pressure.json",
            "tissue-thickness.json",
            "stats.json",
            "clinic.json",
            "payload.js",
        ],
        "counts": {
            "female_scatter": len(female),
            "male_scatter": len(male),
            "age_rows": len(ages),
            "bmi_rows": len(bmi),
            "symmetry_rows": len(symmetry),
            "pressure_sites": len(pressure_sites),
            "thickness_sites": 14,
            "clinic_cards": len(clinic),
        },
    }

    payload = {
        "catalog": catalog,
        "heightShoe": height_shoe,
        "ageFoot": age_foot,
        "bmiRatio": bmi_ratio,
        "symmetry": symmetry_doc,
        "radar": radar,
        "pressure": pressure,
        "thickness": thickness,
        "stats": stats,
        "clinic": clinic,
    }

    dump("catalog.json", catalog)
    dump("height-shoe.json", height_shoe)
    dump("age-foot-length.json", age_foot)
    dump("bmi-ratio.json", bmi_ratio)
    dump("symmetry.json", symmetry_doc)
    dump("radar.json", radar)
    dump("plantar-pressure.json", pressure)
    dump("tissue-thickness.json", thickness)
    dump("stats.json", stats)
    dump("clinic.json", clinic)

    payload_js = OUT / "payload.js"
    payload_js.write_text(
        "window.DESK_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"wrote {payload_js.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
