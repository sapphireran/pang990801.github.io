# Personal lab pages

Interactive pages that read the extracted JSON in [`../../data/`](../../data/README.md). They are not copies of the five dashboard IIFEs (those live on another personal branch). These pages add filters, a regression residual view, a formula playground, and leftover-file analysis.

Serve from the **repository root**:

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/examples/lab/

| Page | What you can do |
| --- | --- |
| [index.html](index.html) | Gallery |
| [explorer.html](explorer.html) | Filter / sort the 398 height×shoe rows, export CSV |
| [correlation.html](correlation.html) | OLS line + residual histogram by sex |
| [growth-story.html](growth-story.html) | Age crossover, BMI series, radar scores in one sitting |
| [small-multiples.html](small-multiples.html) | Four radar ages plus the age bars |
| [symmetry-lab.html](symmetry-lab.html) | Re-run the `Math.log` generator; drag coefficients |
| [unit-converter.html](unit-converter.html) | cm → Mondopoint / rough EU, placed on the scatter range |
| [leftover-compare.html](leftover-compare.html) | `draw1.js` vs `draw2.js` with the um-mismatch table |
| [color-lab.html](color-lab.html) | Dashboard palette swatches |
| [print-report.html](print-report.html) | One-page summary meant for Print → PDF |

Shared assets: [css/lab.css](css/lab.css), [js/lab.js](js/lab.js). Charts load `../../js/echarts.min.js` only.
