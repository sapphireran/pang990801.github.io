# Left / right timeline

The homepage pie titled 儿童双脚比例 is the only chart that plays by itself. This note unpacks the counts so the animation is not a black box.

## Categories

Five slices, always in this color order on the dashboard:

| Slice | Meaning | Color in `js/index.js` |
| --- | --- | --- |
| 双脚相同 | Pair counted as the same size | `#56c979` |
| 左脚比右脚大10-20% | Left 10–20% longer | `#5CAFF2` |
| 左脚比右脚大20%以上 | Left more than 20% longer | `#B6A2DF` |
| 右脚比左脚大20%以上 | Right more than 20% longer | `#a96ec9` |
| 右脚比左脚大10-20% | Right 10–20% longer | `#2DC7C9` |

"Same" is a class, not a millimetre tolerance documented in the file. Nothing in the repo defines whether 3 mm counts as same.

## Formula

For age index `i` where age `2` is `i = 0`:

```text
left_10_20     = round(36 - 13 * ln(i + 1))
left_over_20   = round(17 -  6 * ln(i + 1))
right_over_20  = round(11 -  4 * ln(i + 1))
right_10_20    = round(27 - 10 * ln(i + 1))
same           = 63 + left_10_20 + left_over_20 + right_over_20 + right_10_20
```

`Math.log` in the browser is the natural log. The extract script uses `math.log` the same way so CSV rows match the pie.

## Current counts

| Age | Same | L 10–20 | L >20 | R >20 | R 10–20 |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 2 | 154 | 36 | 17 | 11 | 27 |
| 3 | 131 | 27 | 13 | 8 | 20 |
| 4 | 118 | 22 | 10 | 7 | 16 |
| 5 | 108 | 18 | 9 | 5 | 13 |
| 6 | 101 | 15 | 7 | 5 | 11 |
| 7 | 95 | 13 | 6 | 4 | 9 |
| 8 | 90 | 11 | 5 | 3 | 8 |
| 9 | 86 | 9 | 5 | 3 | 6 |
| 10 | 81 | 7 | 4 | 2 | 5 |
| 11 | 78 | 6 | 3 | 2 | 4 |
| 12 | 75 | 5 | 3 | 1 | 3 |
| 13 | 72 | 4 | 2 | 1 | 2 |
| 14 | 70 | 3 | 2 | 1 | 1 |

Same-size is already the majority at age 2 (154 / 245 ≈ 63%) and is 70 / 77 ≈ 91% by age 14. The four mismatch terms shrink while the `+ 63` floor stays put, so the pie never tells a story where mismatch wins.

## Why left slices stay larger

The left pair of constants `(36, 17)` is larger than the right pair `(27, 11)`. The animation will always look slightly left-heavy. That is not a laterality finding.

If a future personal table replaces this formula, delete the log terms and feed real counts into `optionsData`. Until then, the example page caption says the bias is baked in.

## Timeline behaviour

- `autoPlay: true`
- `playInterval: '2000'`
- `axisType: 'category'`
- Checkpoint color `#3dd4ff`

Hovering a year pauses nothing by itself; the playhead keeps moving. Click a year on the axis to jump. The example page keeps autoplay so it feels like the dashboard, and it also prints the table so a paused reading is possible.

## Related files

- Implementation: `js/index.js` (fourth IIFE)
- Dictionary: [data-dictionary.md](data-dictionary.md)
- Example: [`../examples/left-right-asymmetry.html`](../examples/left-right-asymmetry.html)
- Data: [`../examples/data/left-right-asymmetry.csv`](../examples/data/left-right-asymmetry.csv)
