#!/usr/bin/env python3
"""Smoke-check that example pages, datasets, and docs links stay aligned."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples"
DOCS = ROOT / "docs"
DATA = EXAMPLES / "data"

EXPECTED_PAGES = [
    "index.html",
    "height-shoe-size.html",
    "age-foot-length.html",
    "bmi-foot-ratio.html",
    "radar-growth.html",
    "left-right-asymmetry.html",
    "plantar-pressure.html",
    "tissue-thickness.html",
]

EXPECTED_DATA_STEMS = [
    "height-shoe-size",
    "age-foot-length",
    "bmi-foot-ratio",
    "radar-age-profiles",
    "left-right-asymmetry",
    "plantar-pressure",
    "tissue-thickness",
]

EXPECTED_JS_KEYS = [
    "heightShoe",
    "ageFootLength",
    "bmiFootRatio",
    "radarProfiles",
    "leftRightAsymmetry",
    "plantarPressure",
    "tissueThickness",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def main() -> None:
    missing_pages = [name for name in EXPECTED_PAGES if not (EXAMPLES / name).is_file()]
    if missing_pages:
        fail(f"missing example pages: {missing_pages}")

    for stem in EXPECTED_DATA_STEMS:
        for suffix in (".csv", ".json"):
            path = DATA / f"{stem}{suffix}"
            if not path.is_file():
                fail(f"missing dataset {path.relative_to(ROOT)}")

    for key in EXPECTED_JS_KEYS:
        path = DATA / f"{key}.js"
        if not path.is_file():
            fail(f"missing data script {path.relative_to(ROOT)}")
        text = path.read_text(encoding="utf-8")
        if f"window.ExampleData.{key}" not in text:
            fail(f"{path.name} does not assign window.ExampleData.{key}")

    manifest = json.loads((DATA / "manifest.json").read_text(encoding="utf-8"))
    for stem in EXPECTED_DATA_STEMS:
        if stem not in manifest["datasets"]:
            fail(f"{stem} missing from manifest.json")

    hub = (EXAMPLES / "index.html").read_text(encoding="utf-8")
    for name in EXPECTED_PAGES:
        if name == "index.html":
            continue
        if name not in hub:
            fail(f"examples/index.html does not link to {name}")

    docs_hub = (DOCS / "index.html").read_text(encoding="utf-8")
    for name in EXPECTED_PAGES:
        if name == "index.html":
            continue
        if name not in docs_hub:
            fail(f"docs/index.html does not link to {name}")

    dashboard = (ROOT / "index.html").read_text(encoding="utf-8")
    if 'href="docs/index.html"' not in dashboard or 'href="examples/index.html"' not in dashboard:
        fail("dashboard is missing docs/examples navigation links")

    page_scripts = {
        "height-shoe-size.html": "heightShoe.js",
        "age-foot-length.html": "ageFootLength.js",
        "bmi-foot-ratio.html": "bmiFootRatio.js",
        "radar-growth.html": "radarProfiles.js",
        "left-right-asymmetry.html": "leftRightAsymmetry.js",
        "plantar-pressure.html": "plantarPressure.js",
        "tissue-thickness.html": "tissueThickness.js",
    }
    for page, script in page_scripts.items():
        html = (EXAMPLES / page).read_text(encoding="utf-8")
        if script not in html:
            fail(f"{page} does not load {script}")
        if "echarts.min.js" not in html:
            fail(f"{page} does not load echarts.min.js")

    assigned = []
    for path in DATA.glob("*.js"):
        assigned.extend(re.findall(r"window\.ExampleData\.(\w+)", path.read_text(encoding="utf-8")))
    extra = sorted(set(assigned) - set(EXPECTED_JS_KEYS))
    if extra:
        fail(f"unexpected ExampleData keys: {extra}")

    print("OK: example pages, datasets, and hub links line up.")
    print(f"checked {len(EXPECTED_PAGES)} pages and {len(EXPECTED_DATA_STEMS)} datasets")


if __name__ == "__main__":
    sys.exit(main())
