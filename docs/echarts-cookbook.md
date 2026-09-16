# ECharts cookbook (this repo)

Copy-paste patterns that match the existing personal dashboard. Options load from `examples/data/*.json` so you can restyle without hunting through `js/index.js`.

The gallery pages in [`examples/`](../examples/index.html) are the runnable form of these snippets. They use the checked-in `js/echarts.min.js`.

## Shared boot

```html
<div id="chart" style="width:100%;height:420px;"></div>
<script src="../js/echarts.min.js"></script>
<script>
  async function boot(jsonPath, buildOption) {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(jsonPath + " " + res.status);
    const data = await res.json();
    const chart = echarts.init(document.getElementById("chart"), "dark");
    chart.setOption(buildOption(data));
    window.addEventListener("resize", function () { chart.resize(); });
    return { chart, data };
  }
</script>
```

`examples/js/boot.js` is this helper plus a small stats module.

## Scatter: height vs shoe size

```js
function heightShoeOption(data) {
  return {
    tooltip: {
      formatter: function (p) {
        return p.seriesName + "<br/>身高 " + p.value[0] + " cm<br/>鞋码 " + p.value[1] + " cm";
      }
    },
    xAxis: { name: "身高", type: "value", scale: true, axisLabel: { formatter: "{value} cm" } },
    yAxis: { name: "鞋码", type: "value", scale: true, axisLabel: { formatter: "{value} cm" } },
    series: [
      { name: "女性", type: "scatter", symbolSize: 5, data: data.female.points },
      { name: "男性", type: "scatter", symbolSize: 5, data: data.male.points }
    ]
  };
}
```

Fit a line with `examples/js/stats.js` → `linearRegression(points)`. Draw it as a `line` series with two endpoints, `showSymbol: false`, so it does not steal the scatter tooltip.

## Cylinder bars + difference line

```js
function ageFootOption(data) {
  const cap = (values, offset) => ({
    z: 3,
    type: "pictorialBar",
    symbol: "diamond",
    symbolPosition: "end",
    symbolOffset: [offset, "-50%"],
    symbolSize: [21, 8],
    data: values,
    tooltip: { show: false }
  });
  return {
    tooltip: { trigger: "item" },
    xAxis: { type: "category", data: data.ages },
    yAxis: [
      { type: "value", min: 12, axisLabel: { formatter: "{value} cm" } },
      { type: "value", splitLine: { show: false } }
    ],
    series: [
      { name: "女生脚长（cm）", type: "bar", barWidth: 25, data: data.femaleFootLengthCm },
      cap(data.femaleFootLengthCm, -12.5),
      { name: "男生脚长（cm）", type: "bar", barWidth: 25, barGap: 0, data: data.maleFootLengthCm },
      cap(data.maleFootLengthCm, 12.5),
      {
        name: "女生脚长与男生脚长之差",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        data: data.femaleMinusMaleCm
      }
    ]
  };
}
```

Keep `barGap: 0` so the two cylinders sit as a pair. The diamond `symbolOffset` is half the bar width.

## Area lines + hole-style rings

```js
function ring(center, value, placeholder, color, caption) {
  return {
    type: "pie",
    center: center,
    radius: ["25%", "30%"],
    label: { position: "center" },
    data: [
      {
        value: value,
        itemStyle: { color: color },
        label: { formatter: "{d} %", color: color, fontSize: 18 }
      },
      {
        value: placeholder,
        tooltip: { show: false },
        itemStyle: { color: "#1b3a4a" },
        label: { formatter: "\n" + caption, color: color }
      }
    ]
  };
}
```

`{d}` is ECharts’ percent of the **pie’s own two slices**, not of the whole population. Changing `placeholder` changes the number on screen.

## Timeline pie

```js
function bilateralOption(data) {
  return {
    baseOption: {
      timeline: {
        axisType: "category",
        autoPlay: true,
        playInterval: 2000,
        data: data.ages.map(function (a) { return a.age; })
      },
      series: [{ type: "pie", radius: ["36%", "58%"], center: ["50%", "45%"] }]
    },
    options: data.ages.map(function (a) {
      return {
        series: [{
          data: [
            { name: "双脚相同", value: a.same },
            { name: "左脚比右脚大10-20%", value: a.left10to20 },
            { name: "左脚比右脚大20%以上", value: a.leftOver20 },
            { name: "右脚比左脚大20%以上", value: a.rightOver20 },
            { name: "右脚比左脚大10-20%", value: a.right10to20 }
          ]
        }]
      };
    })
  };
}
```

`echarts.init` + `setOption` with `baseOption` / `options` is what `js/index.js` already does. You do not need `echarts.init` per year.

## Radar

```js
function radarOption(data) {
  return {
    radar: {
      shape: "circle",
      indicator: data.axes.map(function (name) { return { text: name, max: 100 }; })
    },
    series: [{
      type: "radar",
      data: data.series.map(function (s) { return { name: s.age + "岁", value: s.values }; })
    }]
  };
}
```

Never mix these 0–100 scores onto a centimetre axis.

## Pressure lines

```js
function pressureOption(data) {
  return {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", boundaryGap: false, data: data.sites },
    yAxis: { type: "value", name: "Pa" },
    series: [
      { name: "正常人群", type: "line", smooth: true, data: data.typicalPa },
      { name: "糖尿病足人群", type: "line", smooth: true, data: data.diabeticFootPa }
    ]
  };
}
```

## Thickness bars + zoom

```js
function thicknessOption(data) {
  return {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    dataZoom: [{ type: "slider", start: 0, end: 100 }, { type: "inside" }],
    xAxis: { type: "category", data: data.sites },
    yAxis: { type: "value", name: "mm" },
    series: [
      { name: "正常人群(成年)数据:mm", type: "bar", data: data.typicalAdultMm },
      { name: "糖尿病足人群(成年)数据:mm", type: "bar", data: data.diabeticFootAdultMm },
      { name: "差值:um", type: "line", data: data.differenceUm }
    ]
  };
}
```

## Dark palette used by the examples

| Role | Hex |
| --- | --- |
| Page background | `#071422` |
| Card | `#0d2136` |
| Girl / warm series | `#ff4f3b` |
| Boy / cool series | `#3deaff` |
| Accent gold | `#f9cf67` |
| Grid text | `#c9d7e6` |

The live dashboard uses `echarts.init(..., "dark")` plus translucent `backgroundColor: rgba(33,64,112,0.3)` so the `images/bg.jpg` still shows through. Example pages paint a solid card instead, because they are meant to be read on a plain docs background.

## Common breaks

| Symptom | Likely cause |
| --- | --- |
| First chart draws, later ones do not | A `querySelector` missed. An IIFE throw aborts the rest of `js/index.js`. |
| Chart is a flat line at zero height | Parent has no height. Dashboard charts need the rem panel; examples need the inline `height`. |
| `fetch` fails with a CORS / file error | Opened as `file://`. Use `python3 -m http.server`. |
| Timeline does not play | You passed a normal `option` instead of `{ baseOption, options }`. |
| Percent on a ring looks “wrong” | You changed `placeholder` or expected a population percent. `{d}` is local to that pie. |
