#!/usr/bin/env python3
"""Re-extract the Night Desk payload and check committed files plus pages."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DESK = ROOT / "data" / "desk"

REQUIRED_JSON = [
    "catalog.json",
    "height-shoe.json",
    "age-foot-length.json",
    "bmi-ratio.json",
    "symmetry.json",
    "radar.json",
    "plantar-pressure.json",
    "tissue-thickness.json",
    "stats.json",
    "clinic.json",
]

REQUIRED_PAGES = [
    "docs/desk/index.html",
    "docs/desk/origin.html",
    "docs/desk/stations.html",
    "docs/desk/reading.html",
    "docs/desk/clinic.html",
    "docs/desk/leftovers.html",
    "docs/desk/reprint.html",
    "docs/desk/hosting.html",
    "docs/desk/print-card.html",
    "examples/desk/index.html",
    "examples/desk/scatter-fit.html",
    "examples/desk/crossover.html",
    "examples/desk/symmetry.html",
    "examples/desk/radar.html",
    "examples/desk/clinic.html",
    "examples/desk/leftovers.html",
    "examples/desk/folio.html",
]


def load_json(name: str):
    return json.loads((DESK / name).read_text(encoding="utf-8"))


def main() -> int:
    errors: list[str] = []
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "extract-desk.py")])

    catalog = load_json("catalog.json")
    height = load_json("height-shoe.json")
    age = load_json("age-foot-length.json")
    stats = load_json("stats.json")
    clinic = load_json("clinic.json")
    radar = load_json("radar.json")

    if catalog["counts"]["female_scatter"] != 199:
        errors.append(f"female scatter {catalog['counts']['female_scatter']} != 199")
    if catalog["counts"]["male_scatter"] != 199:
        errors.append(f"male scatter {catalog['counts']['male_scatter']} != 199")
    if len(height["female"]) != 199 or len(height["male"]) != 199:
        errors.append("height-shoe clouds are not 199/199")
    if age["first_age_boys_longer"] != 11:
        errors.append(f"crossover age {age['first_age_boys_longer']} != 11")
    if stats["female_ols"]["n"] != 199 or stats["male_ols"]["n"] != 199:
        errors.append("OLS n mismatch")
    if not (0.7 <= stats["female_ols"]["r2"] <= 0.95):
        errors.append(f"female r2 looks off: {stats['female_ols']['r2']}")
    if not (0.7 <= stats["male_ols"]["r2"] <= 0.95):
        errors.append(f"male r2 looks off: {stats['male_ols']['r2']}")
    if radar["series"]["12岁"][4] != 71 or radar["series"]["12岁"][5] != 71:
        errors.append("radar 12-year cells should evaluate 77-6 and 79-8 to 71")
    if len(clinic) < 6:
        errors.append("clinic cards missing")

    payload_text = (DESK / "payload.js").read_text(encoding="utf-8")
    if not payload_text.startswith("window.DESK_DATA = "):
        errors.append("payload.js missing DESK_DATA assignment")
    try:
        json.loads(payload_text[len("window.DESK_DATA = ") :].rstrip().rstrip(";"))
    except json.JSONDecodeError as exc:
        errors.append(f"payload.js is not JSON: {exc}")

    for name in REQUIRED_JSON:
        if not (DESK / name).exists():
            errors.append(f"missing {name}")

    for rel in REQUIRED_PAGES:
        path = ROOT / rel
        if not path.exists():
            errors.append(f"missing page {rel}")
            continue
        html = path.read_text(encoding="utf-8")
        if "<html" not in html.lower():
            errors.append(f"{rel} is not HTML")

    index = (ROOT / "index.html").read_text(encoding="utf-8")
    if "docs/desk/index.html" not in index or "examples/desk/index.html" not in index:
        errors.append("dashboard nav is missing Night Desk links")

    if errors:
        print("verify-desk failed:")
        for item in errors:
            print(f"  - {item}")
        return 1
    print("verify-desk ok")
    print(f"  female OLS r2={stats['female_ols']['r2']} slope={stats['female_ols']['slope']}")
    print(f"  male OLS r2={stats['male_ols']['r2']} slope={stats['male_ols']['slope']}")
    print(f"  boys longer from age {age['first_age_boys_longer']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
