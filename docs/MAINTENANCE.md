# Maintenance notes (personal)

How to **serve, edit, and publish** this personal GitHub Pages dashboard. Viewer steps stay in [USAGE.md](USAGE.md). Chart numbers stay in [CHARTS.md](CHARTS.md).

## Prerequisites

- A current desktop browser (Chrome, Firefox, Safari, or Edge)
- Optional: Python 3 (only for `python3 -m http.server`)
- Optional: `git`, if you will commit
- **No** Node toolchain is required to *view* the site
- **No** API keys, `.env`, or login

This repo is static files. If you add a bundler later, update this document; nothing here assumes `npm run build`.

## Serve a local copy

Always run the server from the **repository root** so `/css/`, `/js/`, `/images/`, and `/font/` resolve the way `index.html` expects.

```bash
cd /path/to/pang990801.github.io
python3 -m http.server 8080
```

Checks after you open [http://127.0.0.1:8080/](http://127.0.0.1:8080/):

1. Title and clock appear.
2. Five charts paint (scatter, bars+line, radar, BMI lines+pies, timeline pie).
3. Browser devtools **Network** tab: `css/index.css`, `js/jquery.js`, `js/echarts.js` / `js/echarts.min.js`, `js/index.js` return **200**.
4. `images/bg.jpg` and `images/head_bg.png` return 200. A missing background is a black page, not an empty chart.

Port 8080 is arbitrary. If it is busy:

```bash
python3 -m http.server 8765
```

### Why not `file://`

Today most scripts are classic `<script src>` tags, so `file://` may still render. A local HTTP server is still the right habit:

- Some browsers restrict fonts or workers on `file://`
- Relative paths are easier to debug against a real origin
- You match GitHub Pages (`https://…`) more closely

## Edit chart data

**Rule:** change the arrays inside `js/index.js`. Reload the browser. There is no rebuild.

| You want to change | Search in `js/index.js` for | Notes |
| --- | --- | --- |
| Height / shoe points | `name: '女性'` / `name: '男性'` and the `[x, y]` lists | Keep pairs as `[heightCm, shoeCm]` |
| Foot length by age | `女生脚长（cm）` / `男生脚长（cm）` | Also update the matching `pictorialBar` arrays and the difference line |
| Radar scores | `name: '9岁'` … `name: '12岁'` | Stay within 0–100 unless you change each indicator `max` |
| BMI lines | `女生脚胖瘦度` / `男生脚胖瘦度` | X categories are 12–24; keep one Y per category |
| Thin / fat pies | `formatter: '\n过瘦脚占比'` / `过胖脚占比` | First `value` vs placeholder `value` sets the ring percent |
| Bilateral pie | `pieData` / `Math.log` constants | Or replace `pieData` with a fixed table per age |

After edits:

1. Save the file.
2. Hard-refresh the local page.
3. Hover a few points and confirm tooltips still make sense.
4. Resize the window once — every live chart registers a `resize` listener.

### Keep series lengths aligned

ECharts will draw mismatched lengths, but tooltips and the difference line will be wrong.

- Age chart: 9 ages → 9 girl lengths, 9 boy lengths, 9 differences, 9 diamond caps × 2
- BMI chart: 13 BMI labels → 13 girl values, 13 boy values
- Scatter: each point is a two-number array, not a single number

The leftover `$(".bar h2").on("click", "a", …)` `dataAll` block is **not** scatter-shaped. Do not connect it until those arrays are rewritten.

## Edit copy and layout

| File | When to touch it |
| --- | --- |
| `index.html` | Title, nav URLs, panel headings, script tags, clock format |
| `css/index.css` | What the browser actually loads |
| `css/index.less` | Only if you still treat Less as the handwritten source — **nothing compiles it** on Pages. If you edit `.less`, copy the matching rules into `index.css` or the live site will not change. |
| `index_new.css` | Draft / unused. **Not linked.** Safe to ignore. |
| `js/flexible.js` | rem rule: `clientWidth / 24`. Change only if you retune the whole layout. |
| `js/click.js` | Only if you restore `<li>` nav / tab markup |

Clock markup is inline in `index.html` (`function time()`). Changing the sentence is a string edit there, not in `js/index.js`.

## Files that are not on the live path

Do not assume every file in the tree affects the published dashboard.

| File | Status |
| --- | --- |
| `draw1.js` | Unmounted plantar-pressure `option` |
| `draw2.js` | Unmounted tissue-thickness `option` |
| `js/china.js` | Commented out in `index.html` |
| `js/myMap.js` | Commented out in `index.html` |
| `js/macarons.js` / `macarons.json` | Theme is loaded; live inits use `'dark'` instead |
| `js/echarts.js` **and** `js/echarts.min.js` | Both tagged; redundant |
| `index_new.css` | Not linked; still mentions missing `images/bg.png` and `font/液晶数字.TTF` |
| `css/index.css` `@font-face` `液晶数字.TTF` | File is **not** in `font/` (only `DS-DIGIT.TTF` is). Harmless extra face. |

### Attach `draw1.js` or `draw2.js` (optional)

1. Add a panel in `index.html`, e.g. `<div class="panel"><h2>…</h2><div class="chart draw-pressure"></div></div>`.
2. Include the sketch **after** ECharts:

   ```html
   <script src="draw1.js"></script>
   <script>
     echarts.init(document.querySelector(".draw-pressure")).setOption(option);
   </script>
   ```

3. Remember `draw1.js` / `draw2.js` assign a **global** `option`. Loading both without wrapping will overwrite the first. Prefer one file per `<script>` block, or wrap each file in an IIFE that calls `setOption` itself.

## Responsive and display quirks

- `css/index.css` sets `.mainbox` `min-width: 1024px` and `max-width: 1920px`.
- Below 1024px, `html { font-size: 42px !important; }` kicks in; the board still feels like a scaled desktop, not a phone UI.
- The media query `min-width: 1920` is missing `px` (`1920` as a number). Browsers may ignore it. If you need a 1920+ rem cap, write `1920px`.
- `index_new.css` pins `.mainbox` to `1200px × 1024px`; that file is unused, so the live page follows `index.css` instead.

## Publish on GitHub Pages

Checked against this repository (personal notes — re-check **Settings → Pages** if you change hosting):

| Fact | Value as of this writing |
| --- | --- |
| Working public URL | [https://sapphireran.github.io/pang990801.github.io/](https://sapphireran.github.io/pang990801.github.io/) |
| Nav href 儿童脚型 | [https://pang990801.github.io/](https://pang990801.github.io/) — **404** (no user-site on that host) |
| Pages `html_url` | `https://sapphireran.github.io/pang990801.github.io/` |
| Pages source | Branch **`gh-pages`**, path `/` |
| `gh-pages` on `origin`? | **No** — remotes are `master` plus topic branches |
| Live HTML `Last-Modified` | 2020-05-24 (stale leftover publish) |
| Custom domain | none |

So: the dashboard you see online is **not** guaranteed to match `master`. A docs-only merge will not move the 2020 Pages copy. A chart edit on `master` will not go live until you fix the source.

### Make `master` the live site (recommended personal setup)

1. GitHub → this repo → **Settings → Pages**.
2. Set source to branch **`master`**, folder `/` (site root has `index.html`).
3. Save, wait for the Pages build (`status: built`).
4. Hard-refresh [https://sapphireran.github.io/pang990801.github.io/](https://sapphireran.github.io/pang990801.github.io/).
5. Optionally change the 儿童脚型 `<a href>` in `index.html` to that same URL so the nav does not 404.

### Or restore a `gh-pages` branch

If you want to keep the current Pages setting:

```bash
git checkout master
git checkout -b gh-pages
git push -u origin gh-pages
```

Then every publish is a fast-forward of `gh-pages` to the commit you want live. Do not invent a second unrelated tree.

### After any publish

1. Wait for the github-pages environment / Actions run.
2. Open the **sapphireran.github.io** URL, not pang990801.github.io.
3. Hard-refresh and re-run the [visual checklist](#quick-visual-checklist-after-any-htmljscss-change).

Docs-only PRs (`README.md`, `docs/*`) do not change chart pixels. They still belong on `master` so the next person (you) knows how the site is actually hosted.

## Quick visual checklist (after any HTML/JS/CSS change)

Use this before you call an edit done:

- [ ] Clock ticks
- [ ] Four nav links go where the labels say
- [ ] Scatter: both sexes, tooltips, toolbox save-image
- [ ] Age bars: girls, boys, difference line
- [ ] Radar: four ages toggle from the legend
- [ ] BMI: two lines + two rings
- [ ] Timeline pie: autoplay and click-to-jump
- [ ] No 404s for `css/index.css` or `js/index.js`

## What not to commit

- Company or classroom datasets that are not yours to publish
- Large replacement copies of `echarts.js` unless you intend to upgrade ECharts on purpose (the file is already multi-megabyte)
- Screenshots of other people’s identifiable feet
- Tokens, `.env`, or mail-server passwords — the 联系我们 link is a public `mailto:` only
