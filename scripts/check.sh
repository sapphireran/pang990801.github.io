#!/bin/sh
set -e
cd "$(dirname "$0")/.."
python3 scripts/export-datasets.py
python3 scripts/build-example-pages.py
node tests/validate-data.js
node tests/validate-options.js
node tests/validate-pages.js
