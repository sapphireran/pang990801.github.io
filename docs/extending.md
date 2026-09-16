# Extending the personal archive

Keep the 2020 dashboard runnable. Add data and examples beside it
instead of rewriting `js/index.js` unless you are fixing a live chart
bug.

## Add or edit a dataset

1. Change the arrays in `js/index.js`, `draw1.js`, or `draw2.js`
   (homepage still reads those files).
2. Run:

   ```bash
   python3 scripts/extract_data.py
   python3 scripts/validate_data.py
   ```

3. If you added a **new** series, teach the extract script how to
   find it (`find_named_array` / `find_first_array_after`) and add a
   check in `validate_data.py`.
4. Point a new example page at `window.FOOT_DATA.*`.

The extract reader only understands JS numbers, strings, arrays, and
object literals. It will not evaluate `77-6` unless you store the
evaluated value yourself (the radar path already does). Function
bodies and `new echarts.graphic.LinearGradient(…)` are skipped
because they are not in the arrays we copy.

## Add an example page

Copy an existing file in `examples/`:

1. Keep the shared head: theme CSS, `../js/echarts.min.js`,
   `js/datasets.js`, `js/theme.js`.
2. Give the chart a unique `id`.
3. Register the page in `examples/index.html` (card + href) and in
   `docs/examples.md`.
4. Use `FOOT_THEME.baseOption()` for dark-archive defaults, then
   override series.
5. Call `chart.resize()` on `window.resize`.

Pages must work from GitHub Pages **and** from
`python3 -m http.server`. They also work from `file://` because
datasets are inlined as `window.FOOT_DATA`.

Markdown under `docs/` is readable on GitHub and through
`docs/read.html?doc=architecture.md` (whitelist in that page). The
hub cards already use the reader so GitHub Pages does not serve raw
`.md` as the primary view.

## Do not do these

- Do not add a bundler unless you are ready to replace GitHub Pages'
  zero-build publish path.
- Do not load a second ECharts from a CDN on the homepage; examples
  reuse `js/echarts.min.js`.
- Do not invent sampling metadata to make the archive look like a
  paper.
- Do not treat the bilateral pie or the thin/plump rings as
  epidemiology.
- Do not commit `node_modules` or Python virtualenvs. `.gitignore`
  already lists them.

## Optional: serve without Python

Any static server is enough:

```bash
npx --yes serve -l 8080
```

GitHub Pages will serve `/docs/` and `/examples/` as ordinary paths
on `https://<user>.github.io/<repo>/` or on the user site
`https://pang990801.github.io/`.

## Changing the original HUD

If you must edit `css/index.less`, compile it to `css/index.css`
yourself (the 2020 repo does not include a Less toolchain). Keep
`flexible.js` in mind: `1rem` is a slice of the viewport, not 16px.

When adding a homepage nav link, use an `<a>` like the existing
items. `click.js` still looks for `<li>` and will not help.

## Validation you can run in one line

```bash
python3 scripts/extract_data.py && python3 scripts/validate_data.py
```

Expected last line: `ok: 7 datasets passed integrity checks`.
