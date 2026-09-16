#!/usr/bin/env python3
"""Check the personal field-yearbook pack and pages."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "yearbook"
DOCS = ROOT / "docs" / "yearbook"
EXAMPLES = ROOT / "examples" / "yearbook"

REQUIRED_JSON = [
    "catalog.json",
    "stats.json",
    "files.json",
    "height-shoe.json",
    "age-foot-length.json",
    "bmi-shape.json",
    "foot-symmetry.json",
    "radar-growth.json",
    "plantar-pressure.json",
    "plantar-thickness.json",
]

DOC_PAGES = [
    "index.html",
    "stations.html",
    "reading.html",
    "provenance.html",
    "annex.html",
    "hosting.html",
    "glossary.html",
]

EXAMPLE_PAGES = [
    "index.html",
    "scatter-desk.html",
    "growth-folio.html",
    "bmi-bench.html",
    "symmetry-reel.html",
    "radar-portraits.html",
    "leftover-annex.html",
    "map-annex.html",
    "print-folio.html",
]


def fail(message: str) -> None:
    print("FAIL:", message)
    raise SystemExit(1)


def load_json(name: str) -> dict:
    path = DATA / name
    if not path.exists():
        fail(f"missing {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    catalog = load_json("catalog.json")
    if catalog.get("company_code") is not False or catalog.get("personal") is not True:
        fail("catalog must mark this pack as personal / not company code")

    height = load_json("height-shoe.json")
    if len(height["girls"]) != 199 or len(height["boys"]) != 199:
        fail("expected 199 girl points and 199 boy points")
    if height["fits"]["all"]["n"] != 398:
        fail("pooled n should be 398")

    age = load_json("age-foot-length.json")
    if age["crossover_age"] != 11:
        fail("crossover age should be 11")
    if age["difference_cm"] != age["difference_recomputed_cm"]:
        fail("stored difference does not match recomputed girl-minus-boy")

    symmetry = load_json("foot-symmetry.json")
    if [row["age"] for row in symmetry["rows"]] != list(range(2, 15)):
        fail("symmetry ages should be 2–14")

    radar = load_json("radar-growth.json")
    if radar["series"][-1]["values"][4] != 71 or radar["series"][-1]["values"][5] != 71:
        fail("age-12 shoe/length should follow 77-6 and 79-8")

    payload = (DATA / "payload.js").read_text(encoding="utf-8")
    if not payload.startswith("window.YEARBOOK = "):
        fail("payload.js should assign window.YEARBOOK")

    for name in REQUIRED_JSON:
        load_json(name)

    for name in DOC_PAGES:
        path = DOCS / name
        if not path.exists():
            fail(f"missing doc page {path}")
        text = path.read_text(encoding="utf-8")
        if "yearbook.css" not in text:
            fail(f"{path} should use yearbook.css")

    for name in EXAMPLE_PAGES:
        path = EXAMPLES / name
        if not path.exists():
            fail(f"missing example page {path}")
        text = path.read_text(encoding="utf-8")
        if "desk.css" not in text:
            fail(f"{path} should use desk.css")

    homepage = (ROOT / "index.html").read_text(encoding="utf-8")
    if "docs/yearbook/" not in homepage or "examples/yearbook/" not in homepage:
        fail("homepage should link to the yearbook docs and examples")

    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    if "田野年鉴" not in readme and "field yearbook" not in readme.lower():
        fail("README should mention the field yearbook")

    # Relative targets used by the yearbook HTML should resolve.
    html_files = list(DOCS.glob("*.html")) + list(EXAMPLES.glob("*.html"))
    hrefs = []
    for path in html_files:
        for href in re.findall(r'href="([^"]+)"', path.read_text(encoding="utf-8")):
            if href.startswith(("http://", "https://", "mailto:")):
                continue
            hrefs.append((path, href.split("#", 1)[0]))
    missing = []
    for path, href in hrefs:
        if not href:
            continue
        target = (path.parent / href).resolve()
        if not target.exists():
            missing.append(f"{path.name} -> {href}")
    if missing:
        fail("broken relative links:\n  " + "\n  ".join(missing))

    print("yearbook verification ok")
    print(f"  docs={len(DOC_PAGES)} examples={len(EXAMPLE_PAGES)} scatter={len(height['girls'])}+{len(height['boys'])}")


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        fail(str(exc))
        sys.exit(1)
