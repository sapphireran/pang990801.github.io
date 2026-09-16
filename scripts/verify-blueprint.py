#!/usr/bin/env python3
"""Check personal blueprint pages, links, and recomputed OLS."""

from __future__ import annotations

import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _load_build():
    path = ROOT / "scripts" / "build-blueprint-data.py"
    spec = importlib.util.spec_from_file_location("build_blueprint_data", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


build = _load_build()


def fail(msg: str) -> None:
    raise SystemExit(f"verify-blueprint: {msg}")


def expected_pages() -> list[Path]:
    docs = [
        "docs/blueprint/index.html",
        "docs/blueprint/systems.html",
        "docs/blueprint/allowance.html",
        "docs/blueprint/protocol.html",
        "docs/blueprint/fit-check.html",
        "docs/blueprint/terms.html",
        "docs/blueprint/appendix.html",
        "docs/blueprint/caveats.html",
    ]
    examples = [
        "examples/blueprint/index.html",
        "examples/blueprint/converter.html",
        "examples/blueprint/fitting.html",
        "examples/blueprint/growth-atlas.html",
        "examples/blueprint/last-blueprint.html",
        "examples/blueprint/field-kit.html",
        "examples/blueprint/vignettes.html",
        "examples/blueprint/leftover-fit.html",
    ]
    return [ROOT / p for p in docs + examples]


def check_files() -> None:
    for path in expected_pages():
        if not path.is_file():
            fail(f"missing {path.relative_to(ROOT)}")
        text = path.read_text(encoding="utf-8")
        if "<title>" not in text:
            fail(f"no title in {path.name}")
        if 'lang="' not in text:
            fail(f"no lang in {path.name}")


def check_links() -> None:
    refs = re.compile(r'''(?:href|src)="([^"]+)"''')
    skip_prefix = ("http://", "https://", "mailto:", "#")
    for path in expected_pages() + [ROOT / "index.html"]:
        text = path.read_text(encoding="utf-8")
        for raw in refs.findall(text):
            href = raw.strip()
            if href.startswith(skip_prefix):
                continue
            target = (path.parent / href).resolve()
            if not target.exists():
                fail(f"broken {raw} in {path.relative_to(ROOT)}")


def check_stats() -> None:
    payload = json.loads((ROOT / "data/blueprint/payload.json").read_text(encoding="utf-8"))
    index_js = (ROOT / "js/index.js").read_text(encoding="utf-8")
    girl = build.series_xy(index_js, "女性")
    boy = build.series_xy(index_js, "男性")
    if len(girl) != 199 or len(boy) != 199:
        fail(f"expected 199+199 points, got {len(girl)}+{len(boy)}")
    g = build.ols([p[0] for p in girl], [p[1] for p in girl])
    stored = payload["stats"]["girl_ols"]
    if abs(g["slope"] - stored["slope"]) > 1e-6:
        fail("girl OLS slope drifted")
    if payload["stats"]["crossover_age"] != 11:
        fail("crossover age should be 11")
    sizes = build.convert_sizes(180, 12)
    if sizes["mondopoint"] != 180 or abs(sizes["eu"] - 28.8) > 0.05:
        fail(f"unexpected 180 mm conversion: {sizes}")
    js = (ROOT / "data/blueprint/payload.js").read_text(encoding="utf-8")
    if not js.startswith("window.BLUEPRINT_PAYLOAD"):
        fail("payload.js missing global")
    if payload["catalog"]["counts"]["vignettes"] != 8:
        fail("expected 8 vignettes")


def check_scripts() -> None:
    needed = [
        "examples/blueprint/js/blueprint.js",
        "examples/blueprint/js/converter-page.js",
        "examples/blueprint/js/fitting-page.js",
        "examples/blueprint/js/atlas-page.js",
        "examples/blueprint/js/last-page.js",
        "examples/blueprint/js/vignettes-page.js",
        "examples/blueprint/js/leftover-page.js",
        "docs/blueprint/blueprint.css",
    ]
    for rel in needed:
        if not (ROOT / rel).is_file():
            fail(f"missing {rel}")


def main() -> None:
    check_files()
    check_links()
    check_scripts()
    check_stats()
    print("verify-blueprint: ok")


if __name__ == "__main__":
    main()
