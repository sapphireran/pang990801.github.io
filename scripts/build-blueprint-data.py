#!/usr/bin/env python3
"""Extract personal dashboard series and compute blueprint-workshop stats.

Reads js/index.js, draw1.js, and draw2.js from this personal GitHub Pages
repo. Writes JSON under data/blueprint/ plus a browser payload script.
Does not invent new survey rows — only rearranges numbers already on
the 2020 dashboard and derives summaries (OLS, bins, size tables).
"""

from __future__ import annotations

import ast
import json
import math
import re
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "blueprint"
OUT.mkdir(parents=True, exist_ok=True)


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def _parse_bracket_array(text: str, bracket: int) -> tuple[list, int]:
    depth = 0
    i = bracket
    in_str = False
    quote = ""
    escape = False
    while i < len(text):
        ch = text[i]
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == quote:
                in_str = False
        elif ch in ("'", '"'):
            in_str = True
            quote = ch
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                raw = text[bracket : i + 1]
                return ast.literal_eval(raw), i + 1
        i += 1
    raise ValueError("unclosed array")


def first_array_after(text: str, marker: str, start: int = 0) -> tuple[list, int]:
    pos = text.find(marker, start)
    if pos < 0:
        raise ValueError(f"marker not found: {marker!r}")
    data_pos = text.find("data:", pos + len(marker))
    if data_pos < 0:
        raise ValueError(f"no data: after {marker!r}")
    bracket = text.find("[", data_pos)
    if bracket < 0:
        raise ValueError(f"no array after {marker!r}")
    return _parse_bracket_array(text, bracket)


def series_xy(text: str, series_name: str) -> list[list[float]]:
    data, _ = first_array_after(text, f"name: '{series_name}'")
    if not data or not isinstance(data[0], (list, tuple)):
        raise ValueError(f"{series_name} data is not xy pairs")
    return [[float(a), float(b)] for a, b in data]


def mean(xs: list[float]) -> float:
    return sum(xs) / len(xs)


def quantile(xs: list[float], q: float) -> float:
    if not xs:
        raise ValueError("empty")
    ys = sorted(xs)
    if len(ys) == 1:
        return ys[0]
    pos = q * (len(ys) - 1)
    lo = int(math.floor(pos))
    hi = min(lo + 1, len(ys) - 1)
    t = pos - lo
    return ys[lo] * (1.0 - t) + ys[hi] * t


def pearson(xs: list[float], ys: list[float]) -> float:
    mx, my = mean(xs), mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    denx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    deny = math.sqrt(sum((y - my) ** 2 for y in ys))
    return num / (denx * deny)


def ols(xs: list[float], ys: list[float]) -> dict:
    n = len(xs)
    mx, my = mean(xs), mean(ys)
    sxx = sum((x - mx) ** 2 for x in xs)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    slope = sxy / sxx
    intercept = my - slope * mx
    fitted = [intercept + slope * x for x in xs]
    resid = [y - f for y, f in zip(ys, fitted)]
    sse = sum(r * r for r in resid)
    sst = sum((y - my) ** 2 for y in ys)
    r = pearson(xs, ys)
    r2 = 1.0 - sse / sst if sst else 0.0
    dof = max(n - 2, 1)
    resid_sd = math.sqrt(sse / dof)
    return {
        "n": n,
        "slope": round(slope, 6),
        "intercept": round(intercept, 6),
        "r": round(r, 6),
        "r2": round(r2, 6),
        "resid_sd": round(resid_sd, 6),
        "x_mean": round(mx, 4),
        "y_mean": round(my, 4),
        "x_min": round(min(xs), 4),
        "x_max": round(max(xs), 4),
        "y_min": round(min(ys), 4),
        "y_max": round(max(ys), 4),
        "equation": f"shoe_cm = {intercept:.4f} + {slope:.4f} * height_cm",
    }


def summarize_points(points: list[list[float]], sex: str) -> dict:
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    fit = ols(xs, ys)
    residuals = []
    for x, y in points:
        pred = fit["intercept"] + fit["slope"] * x
        residuals.append(
            {
                "height_cm": x,
                "shoe_cm": y,
                "predicted_cm": round(pred, 4),
                "residual_cm": round(y - pred, 4),
            }
        )
    return {
        "sex": sex,
        "count": len(points),
        "points": [{"height_cm": a, "shoe_cm": b} for a, b in points],
        "height_cm": {
            "min": min(xs),
            "max": max(xs),
            "mean": round(mean(xs), 4),
            "sd": round(statistics.pstdev(xs), 4),
            "p10": round(quantile(xs, 0.10), 4),
            "p50": round(quantile(xs, 0.50), 4),
            "p90": round(quantile(xs, 0.90), 4),
        },
        "shoe_cm": {
            "min": min(ys),
            "max": max(ys),
            "mean": round(mean(ys), 4),
            "sd": round(statistics.pstdev(ys), 4),
            "p10": round(quantile(ys, 0.10), 4),
            "p50": round(quantile(ys, 0.50), 4),
            "p90": round(quantile(ys, 0.90), 4),
        },
        "ols": fit,
        "residuals": residuals,
    }


def height_bins(girl_pts: list[list[float]], boy_pts: list[list[float]]) -> list[dict]:
    rows = []
    for lo in range(75, 155, 5):
        hi = lo + 5
        label = f"{lo}–{hi}"
        row = {"bin_cm": label, "lo": lo, "hi": hi, "groups": {}}
        for key, pts in (("girl", girl_pts), ("boy", boy_pts)):
            shoes = [y for x, y in pts if lo <= x < hi]
            if not shoes:
                row["groups"][key] = {"n": 0}
                continue
            row["groups"][key] = {
                "n": len(shoes),
                "p10": round(quantile(shoes, 0.10), 3),
                "p25": round(quantile(shoes, 0.25), 3),
                "p50": round(quantile(shoes, 0.50), 3),
                "p75": round(quantile(shoes, 0.75), 3),
                "p90": round(quantile(shoes, 0.90), 3),
                "mean": round(mean(shoes), 3),
            }
        if row["groups"]["girl"].get("n") or row["groups"]["boy"].get("n"):
            rows.append(row)
    return rows


def mondopoint_table(allowance_mm: float = 12.0) -> list[dict]:
    rows = []
    for foot_mm in range(140, 245, 5):
        rows.append(convert_sizes(foot_mm, allowance_mm))
    return rows


def convert_sizes(foot_mm: float, allowance_mm: float = 12.0) -> dict:
    """Educational conversions. Personal study notes, not a factory last table."""
    last_mm = foot_mm + allowance_mm
    # Mondopoint (ISO 9407): labelled by foot length in millimetres.
    mondo = int(round(foot_mm))
    # Chinese length number (号): foot length in centimetres.
    cn_hao = round(foot_mm / 10.0, 1)
    # Paris point: 2/3 cm. Retail EU size usually tracks last length.
    eu = round(last_mm / (20.0 / 3.0), 2)
    # English children's barleycorn: 1/3 inch from a 4-inch zero last.
    uk_kids = round((last_mm - 101.6) / 8.46, 2)
    us_kids = round(uk_kids + 1.0, 2)
    return {
        "foot_mm": foot_mm,
        "foot_cm": round(foot_mm / 10.0, 2),
        "allowance_mm": allowance_mm,
        "last_mm": round(last_mm, 2),
        "mondopoint": mondo,
        "cn_hao": cn_hao,
        "eu": eu,
        "uk_kids": uk_kids,
        "us_kids": us_kids,
    }


def pick_vignette(points: list[list[float]], fit: dict, rule) -> dict:
    scored = []
    for x, y in points:
        pred = fit["intercept"] + fit["slope"] * x
        resid = y - pred
        scored.append((rule(x, y, pred, resid), x, y, pred, resid))
    scored.sort(key=lambda t: t[0])
    _score, x, y, pred, resid = scored[0]
    return {
        "height_cm": x,
        "shoe_cm": y,
        "predicted_cm": round(pred, 3),
        "residual_cm": round(resid, 3),
        "sizes_12mm": convert_sizes(y * 10.0, 12.0),
    }


def build_vignettes(girl: dict, boy: dict) -> list[dict]:
    gf, bf = girl["ols"], boy["ols"]
    gp = [[p["height_cm"], p["shoe_cm"]] for p in girl["points"]]
    bp = [[p["height_cm"], p["shoe_cm"]] for p in boy["points"]]
    cases = [
        {
            "id": "near-mean-girl",
            "title_zh": "接近女童身高均值",
            "title_en": "Girl near the height mean",
            "sex": "girl",
            "prompt_zh": "这个点的鞋长和回归线差多少？换算成 Mondopoint 是几号？",
            "prompt_en": "How far is shoe length from the girl OLS line? What Mondopoint does it map to?",
            **pick_vignette(gp, gf, lambda x, y, pred, r: abs(x - gf["x_mean"]) + 0.15 * abs(r)),
        },
        {
            "id": "near-mean-boy",
            "title_zh": "接近男童身高均值",
            "title_en": "Boy near the height mean",
            "sex": "boy",
            "prompt_zh": "同样身高，男童回归线给出的鞋长和女童线差几毫米？",
            "prompt_en": "At the same height, how many millimetres do the two sex-specific lines differ?",
            **pick_vignette(bp, bf, lambda x, y, pred, r: abs(x - bf["x_mean"]) + 0.15 * abs(r)),
        },
        {
            "id": "tall-girl",
            "title_zh": "身高偏高的女童",
            "title_en": "Taller girl in the cloud",
            "sex": "girl",
            "prompt_zh": "高身高端点还在散点带里吗，还是已经靠近上沿？",
            "prompt_en": "Is the tall end still inside the main cloud, or hugging the upper edge?",
            **pick_vignette(gp, gf, lambda x, y, pred, r: -x + 0.05 * abs(r)),
        },
        {
            "id": "short-boy",
            "title_zh": "身高偏低的男童",
            "title_en": "Shorter boy in the cloud",
            "sex": "boy",
            "prompt_zh": "矮身高端用厘米鞋长说话，还是不小心读成零售欧码？",
            "prompt_en": "At the short end, is the y-value still centimetres of length — not a retail EU mark?",
            **pick_vignette(bp, bf, lambda x, y, pred, r: x + 0.05 * abs(r)),
        },
        {
            "id": "long-residual-girl",
            "title_zh": "相对身高脚更长的女童",
            "title_en": "Girl with a long positive residual",
            "sex": "girl",
            "prompt_zh": "正残差 1cm 大约是半个巴黎点还是一个童鞋 UK 码？",
            "prompt_en": "Is a +1 cm residual closer to half a Paris point or a full UK kids size?",
            **pick_vignette(gp, gf, lambda x, y, pred, r: -r),
        },
        {
            "id": "short-residual-boy",
            "title_zh": "相对身高脚更短的男童",
            "title_en": "Boy with a short negative residual",
            "sex": "boy",
            "prompt_zh": "负残差时，放余量还要不要按 12mm 一刀切？",
            "prompt_en": "With a negative residual, should the 12 mm allowance still be applied blindly?",
            **pick_vignette(bp, bf, lambda x, y, pred, r: r),
        },
        {
            "id": "high-leverage-girl",
            "title_zh": "靠近女童鞋长上沿",
            "title_en": "Girl near the longest shoe values",
            "sex": "girl",
            "prompt_zh": "最大值标注和回归线，哪一个更不该直接拿去买鞋？",
            "prompt_en": "Which is less safe to shop from: the max marker or the regression line?",
            **pick_vignette(gp, gf, lambda x, y, pred, r: -y),
        },
        {
            "id": "compact-boy",
            "title_zh": "鞋长偏短的男童",
            "title_en": "Boy near the shortest shoe values",
            "sex": "boy",
            "prompt_zh": "短鞋长点换成中国号后，还会不会被误读成成年 10 号？",
            "prompt_en": "After converting to a Chinese length number, could someone still misread it as an adult size 10?",
            **pick_vignette(bp, bf, lambda x, y, pred, r: y),
        },
    ]
    return cases


def symmetry_from_formula() -> list[dict]:
    ages = list(range(2, 15))
    rows = []
    for i, age in enumerate(ages):
        a = round(36 - 13 * math.log(i + 1))
        b = round(17 - 6 * math.log(i + 1))
        c = round(11 - 4 * math.log(i + 1))
        d = round(27 - 10 * math.log(i + 1))
        same = 63 + a + b + c + d
        total = same + a + b + c + d
        rows.append(
            {
                "age": age,
                "label": f"{age}岁",
                "same": same,
                "left_10_20": a,
                "left_over_20": b,
                "right_over_20": c,
                "right_10_20": d,
                "total": total,
                "same_pct": round(100.0 * same / total, 2),
                "note": "Generated by the dashboard formula in js/index.js, not raw counts.",
            }
        )
    return rows


def write_json(name: str, payload) -> None:
    path = OUT / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    index_js = read("js/index.js")
    draw1 = read("draw1.js")
    draw2 = read("draw2.js")

    girl_pts = series_xy(index_js, "女性")
    boy_pts = series_xy(index_js, "男性")
    girl = summarize_points(girl_pts, "girl")
    boy = summarize_points(boy_pts, "boy")

    ages = [6, 7, 8, 9, 10, 11, 12, 13, 14]
    girl_len, _ = first_array_after(index_js, "name: '女生脚长（cm）'")
    boy_len, _ = first_array_after(index_js, "name: '男生脚长（cm）'")
    # The pictorialBar series repeats the same arrays; take the first hit only.
    girl_len = [float(v) for v in girl_len]
    boy_len = [float(v) for v in boy_len]
    if len(girl_len) != 9 or len(boy_len) != 9:
        raise ValueError("unexpected age-length series length")
    age_rows = []
    for i, age in enumerate(ages):
        g, b = girl_len[i], boy_len[i]
        prev_g = girl_len[i - 1] if i else None
        prev_b = boy_len[i - 1] if i else None
        age_rows.append(
            {
                "age": age,
                "girl_cm": g,
                "boy_cm": b,
                "diff_girl_minus_boy_cm": round(g - b, 4),
                "girl_velocity_cm": None if prev_g is None else round(g - prev_g, 4),
                "boy_velocity_cm": None if prev_b is None else round(b - prev_b, 4),
            }
        )
    crossover = next(row["age"] for row in age_rows if row["diff_girl_minus_boy_cm"] < 0)

    bmi = list(range(12, 25))
    girl_shape, _ = first_array_after(index_js, "name: '女生脚胖瘦度'")
    boy_shape, _ = first_array_after(index_js, "name: '男生脚胖瘦度'")
    girl_shape = [float(v) for v in girl_shape]
    boy_shape = [float(v) for v in boy_shape]
    bmi_rows = [
        {"bmi": bmi[i], "girl_index": girl_shape[i], "boy_index": boy_shape[i]}
        for i in range(len(bmi))
    ]

    radar_names = ["身高", "兜跟围长", "跗骨围长", "跖趾围长", "鞋码", "脚长", "体重"]
    radar = [
        {"age": 9, "scores": [43, 29, 37, 37, 38, 31, 41]},
        {"age": 10, "scores": [53, 32, 42, 46, 43, 42, 49]},
        {"age": 11, "scores": [66, 37, 47, 60, 57, 59, 65]},
        {"age": 12, "scores": [84, 45, 55, 70, 71, 71, 79]},
    ]
    # 12-year shoe/foot scores in the source are written 77-6 and 79-8.
    radar_rows = []
    for item in radar:
        radar_rows.append(
            {
                "age": item["age"],
                "axes": [
                    {"name_zh": radar_names[i], "score": item["scores"][i]}
                    for i in range(7)
                ],
            }
        )

    pressure_sites = [f"位点{i}" for i in range(1, 8)]
    normal_p, _ = first_array_after(draw1, "name: '正常人群'")
    df_p, _ = first_array_after(draw1, "name: '糖尿病足人群'")
    pressure = [
        {
            "site": pressure_sites[i],
            "typical_pa": float(normal_p[i]),
            "diabetic_pa": float(df_p[i]),
            "delta_pa": float(df_p[i]) - float(normal_p[i]),
        }
        for i in range(7)
    ]

    thick_n, _ = first_array_after(draw2, '"name": "正常人群(成年)数据:mm"')
    thick_d, _ = first_array_after(draw2, '"name": "糖尿病足人群(成年)数据:mm"')
    thick_delta, _ = first_array_after(draw2, "name: '差值:um'")
    thickness = []
    for i in range(14):
        n_mm = float(thick_n[i])
        d_mm = float(thick_d[i])
        thickness.append(
            {
                "site": i + 1,
                "typical_mm": n_mm,
                "diabetic_mm": d_mm,
                "true_delta_mm": round(d_mm - n_mm, 3),
                "plotted_delta_label_um": float(thick_delta[i]),
                "plotted_vs_true_mm": round(float(thick_delta[i]) / 10.0, 3),
                "note": "The leftover chart labels the line as µm but the numbers track tenths of a millimetre.",
            }
        )

    bins = height_bins(girl_pts, boy_pts)
    size_table = mondopoint_table(12.0)
    vignettes = build_vignettes(girl, boy)
    symmetry = symmetry_from_formula()

    catalog = {
        "project": "pang990801.github.io",
        "kind": "personal-study-material",
        "disclaimer_zh": "个人可视化练习与读图工坊，不是流行病学报告，也不是购鞋或医疗建议。",
        "disclaimer_en": "Personal visualisation notes. Not a survey report, not a shop fitting, not medical advice.",
        "sources": {
            "dashboard": "js/index.js",
            "leftover_pressure": "draw1.js",
            "leftover_thickness": "draw2.js",
        },
        "counts": {
            "girl_scatter": girl["count"],
            "boy_scatter": boy["count"],
            "age_rows": len(age_rows),
            "bmi_rows": len(bmi_rows),
            "symmetry_ages": len(symmetry),
            "radar_ages": len(radar_rows),
            "pressure_sites": len(pressure),
            "thickness_sites": len(thickness),
            "vignettes": len(vignettes),
        },
    }

    stats = {
        "girl_ols": girl["ols"],
        "boy_ols": boy["ols"],
        "crossover_age": crossover,
        "age_velocity_notes": {
            "girl_max_step": max(
                (row["girl_velocity_cm"] for row in age_rows if row["girl_velocity_cm"] is not None),
            ),
            "boy_max_step": max(
                (row["boy_velocity_cm"] for row in age_rows if row["boy_velocity_cm"] is not None),
            ),
            "girl_min_step": min(
                (row["girl_velocity_cm"] for row in age_rows if row["girl_velocity_cm"] is not None),
            ),
            "boy_min_step": min(
                (row["boy_velocity_cm"] for row in age_rows if row["boy_velocity_cm"] is not None),
            ),
        },
        "bmi_index_r": {
            "girl": round(pearson(bmi, girl_shape), 6),
            "boy": round(pearson(bmi, boy_shape), 6),
            "n": len(bmi),
            "note": "Thirteen aggregated BMI ticks, not child-level pairs.",
        },
        "same_foot_pct_range": {
            "min": min(row["same_pct"] for row in symmetry),
            "max": max(row["same_pct"] for row in symmetry),
        },
        "default_allowance_mm": 12,
        "size_formulas": {
            "mondopoint": "round(foot_mm)",
            "cn_hao": "foot_mm / 10",
            "eu": "(foot_mm + allowance_mm) / (20/3)",
            "uk_kids": "(last_mm - 101.6) / 8.46",
            "us_kids": "uk_kids + 1",
        },
    }

    height_shoe = {
        "unit_note_zh": "原图 y 轴写「鞋码」但单位是厘米，表示鞋长/脚长，不是零售 28、29 码。",
        "unit_note_en": "The dashboard y-axis says 鞋码 but the unit is centimetres of length, not a retail pair size.",
        "girl": {k: girl[k] for k in ("sex", "count", "height_cm", "shoe_cm", "ols", "points")},
        "boy": {k: boy[k] for k in ("sex", "count", "height_cm", "shoe_cm", "ols", "points")},
    }

    residuals = {
        "girl": girl["residuals"],
        "boy": boy["residuals"],
    }

    payload = {
        "catalog": catalog,
        "stats": stats,
        "height_shoe": height_shoe,
        "residuals": residuals,
        "height_bins": bins,
        "age_foot_length": age_rows,
        "bmi_shape": bmi_rows,
        "symmetry": symmetry,
        "radar": radar_rows,
        "pressure": pressure,
        "thickness": thickness,
        "size_table_12mm": size_table,
        "vignettes": vignettes,
    }

    write_json("catalog.json", catalog)
    write_json("stats.json", stats)
    write_json("height-shoe.json", height_shoe)
    write_json("residuals.json", residuals)
    write_json("height-bins.json", bins)
    write_json("age-foot-length.json", age_rows)
    write_json("bmi-shape.json", bmi_rows)
    write_json("symmetry.json", symmetry)
    write_json("radar.json", radar_rows)
    write_json("plantar-pressure.json", pressure)
    write_json("tissue-thickness.json", thickness)
    write_json("size-table.json", size_table)
    write_json("vignettes.json", vignettes)
    write_json("payload.json", payload)

    js_path = OUT / "payload.js"
    js_path.write_text(
        "window.BLUEPRINT_PAYLOAD = "
        + json.dumps(payload, ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )

    print(f"wrote {len(list(OUT.iterdir()))} files to {OUT}")
    print("girl", girl["count"], "boy", boy["count"], "crossover", crossover)
    print("girl OLS", girl["ols"]["equation"], "r", girl["ols"]["r"])
    print("boy OLS", boy["ols"]["equation"], "r", boy["ols"]["r"])


if __name__ == "__main__":
    main()
