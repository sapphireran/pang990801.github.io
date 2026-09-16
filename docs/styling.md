# Styling notes

Two visual systems share this repo.

1. **Cockpit** — `css/index.css` + `images/` + `flexible.js`. Full-bleed dark dashboard.
2. **Notes & examples** — `docs/css/docs.css` and `examples/css/examples.css`. Scrollable documents that borrow the cockpit palette without the rem scaler.

## Cockpit tokens (from `css/index.css`)

| Token | Value | Where |
| --- | --- | --- |
| Page background | `#000` + `images/bg.jpg` cover | `body` |
| Panel fill | `rgba(255, 255, 255, 0.04)` + scanline PNG | `.panel` |
| Panel border | `1px solid rgba(25, 186, 139, 0.17)` | `.panel` |
| Corner ticks | `#02a6b5` 10×10 L-shapes | `::before` / `::after` and footer mirrors |
| Heading | `#fff`, 0.25rem, weight 400 | `.panel h2` |
| Clock | `rgba(255, 255, 255, 0.7)` | `header .showTime` |
| Nav text | `#fff` at 0.8 opacity, text-shadow `#00225b` | `.index_nav a` |

Chart-internal colors are **not** in the stylesheet. They live in each option object:

| Series | Typical hex |
| --- | --- |
| Girls scatter / area | `#ff4f3b`, `#FF69B4` |
| Boys scatter / area | `#ffe01f`, `#3deaff` |
| Age-gap line | `#3deaff` |
| Radar 9 / 10 / 11 / 12 | `#00c2ff`, `#f9cf67`, `#32CD32`, `#e92b77` |
| Pressure normal / diabetic | `#a60bde`, `#ff733f` |
| Thickness bars | `rgba(255,144,128,1)`, `rgba(0,191,183,1)` |

## Rem layout

`flexible.js` sets the root font-size from the viewport. Almost every cockpit dimension is rem:

| Selector | Height |
| --- | --- |
| `header` | 1.25rem |
| `.panel` | 7rem (CSS) / 3.875rem (Less, stale) |
| `.panel .chart` | 6rem |
| `.map` | 10.125rem |

If a chart looks clipped, check the CSS/Less drift first. The live file is `css/index.css`.

The 1024px media query forces `html { font-size: 42px }`. Below that width the cockpit is cramped; examples are the better way to read a single chart on a small window.

## Docs / examples system

Shared ideas, two stylesheets so a notes page and a chart page can diverge:

- Dark navy page (`#07111d`)
- Cyan accent (`#2fd3c5`)
- Card surface (`#101b2b`)
- Readable body copy (`#d5e3ef`, 17–18px, 1.65 line-height)
- Max width ~1080px for prose, full-bleed chart well for examples

Docs pages are HTML so GitHub Pages can serve them with the same chrome as the examples. Markdown files stay next to them for readers who open the repo in an editor or on github.com.

## Fonts

`font/DS-DIGIT.TTF` is the electronic face used by the clock family. The cockpit also references `液晶数字.TTF` in an `@font-face` that is not in the tree; the browser falls back. Docs and examples use the system UI stack:

```css
font-family: "Segoe UI", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
```

Do not load the digital face on long-form notes.

## Motion

Cockpit CSS still defines `rotate` / `rotate1` for the old map ornaments. Those keyframes are unused while `china.js` / `myMap.js` stay commented out. Example pages do not animate the chrome; ECharts timeline autoplay is the only motion.

## Editing safely

- Keep cockpit changes in `css/index.css` (and update Less if you still compile it).
- Keep notes/examples changes in their own stylesheets.
- Do not point example pages at `css/index.css`. That file assumes `flexible.js` and a 1920-class canvas.
