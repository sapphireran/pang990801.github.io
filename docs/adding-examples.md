# Adding another example

Personal checklist for a sixth homepage panel or a new leftover sketch.

## 1. Keep the source of truth in a chart file

Put the series in `js/index.js` if it belongs on the children's dashboard. Put a gallery-style `option` in a root `drawN.js` file if it is only a sketch.

Do not hand-edit `examples/data/*.csv` as the first step. The extract script will overwrite those files.

## 2. Teach the extract script the new arrays

`scripts/extract_example_data.py` already knows seven datasets. For a new one:

1. Add an `extract_*` function that writes CSV, JSON, and a `window.ExampleData.<name>` JS file.
2. Call it from `main()`.
3. Append the slug to the `datasets` list in `write_manifest()`.
4. Run `python3 scripts/extract_example_data.py`.

Use English camelCase for the JS key (`heightShoe`, `ageFootLength`) and kebab-case for the CSV stem (`height-shoe-size`).

## 3. Add a page that can fail loudly

Copy an existing example HTML file. Keep this script order:

```html
<script src="../js/echarts.min.js"></script>
<script src="./data/yourKey.js"></script>
<script src="./js/common.js"></script>
<script src="./js/your-page.js"></script>
```

In the page module, start with:

```js
var data = ExampleCommon.requireData("yourKey");
```

That throws if the data script was forgotten, instead of drawing an empty canvas.

## 4. Reuse the shared chrome

- Styles: `examples/css/examples.css`
- Helpers: `ExampleCommon.fillTable`, `wireToggles`, `bindChartResize`
- Nav: Dashboard / Docs / All examples

Add one card to `examples/index.html` and one pill if there is a new CSV. Add a row to `docs/charts.md`.

## 5. Decide whether the homepage should change

Most new personal work should stay under `examples/` until the composition is settled. The children's dashboard is already five panels wide. Adult sketches (`draw1.js`, `draw2.js`) stay off `index.html`.

If the homepage does gain a panel:

1. Add a `.panel` + `.chart` node.
2. Append an IIFE that inits that exact selector.
3. Bind `resize`.
4. Click through the other four panels. Shared state here is only `window` and jQuery.

## 6. Personal-data rule

This repository is a personal Pages site. Do not import company tables, clinic exports, or anyone else's identifiable measurements. If a later personal study is added, strip names and write a new note under `docs/` that says where the rows came from.

## 7. Smoke check

```bash
python3 scripts/extract_example_data.py
python3 scripts/check_examples.py
python3 -m http.server 4173
```

Open `/examples/` and click every new card. Confirm the chart, the KPI strip, and the table all populate.
