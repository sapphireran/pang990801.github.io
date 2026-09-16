/**
 * Option builders for the personal example pages.
 * Data comes from exampleData; these functions only assemble ECharts options.
 */
(function (global) {
  var h = global.chartHelpers;

  function scatterHeightShoe() {
    var d = global.exampleData.heightShoe;
    return {
      backgroundColor: "rgba(27,116,163,0.18)",
      tooltip: {
        show: true,
        formatter: function (params) {
          if (params.value && params.value.length > 1) {
            return params.seriesName + "<br/>身高：" + h.fmt(params.value[0], 2) + " cm<br/>鞋码：" + h.fmt(params.value[1], 2) + " cm";
          }
          return params.seriesName + "：" + params.value;
        },
        axisPointer: { type: "cross", lineStyle: { type: "dashed", width: 1 } }
      },
      toolbox: {
        feature: {
          dataZoom: {},
          brush: { type: ["rect", "polygon", "clear"] },
          saveAsImage: {}
        }
      },
      brush: {},
      legend: { data: ["女童", "男童"], left: "center", textStyle: { color: "#fff" } },
      grid: { left: "6%", right: "6%", bottom: "8%", top: "12%", containLabel: true },
      xAxis: [{
        name: d.xName,
        type: "value",
        scale: true,
        axisLabel: { formatter: "{value} cm" },
        splitLine: { show: false }
      }],
      yAxis: [{
        name: d.yName,
        type: "value",
        scale: true,
        axisLabel: { formatter: "{value} cm" },
        splitLine: { show: false }
      }],
      series: [
        seriesScatter("女童", d.female, global.exampleData.palette.female, 115),
        seriesScatter("男童", d.male, global.exampleData.palette.male, 110)
      ]
    };
  }

  function seriesScatter(name, data, color, refX) {
    return {
      name: name,
      type: "scatter",
      symbolSize: 5,
      itemStyle: { color: color },
      data: data,
      markArea: {
        silent: true,
        itemStyle: { color: "transparent", borderWidth: 1, borderType: "dashed" },
        data: [[{ name: name + "分布", xAxis: "min", yAxis: "min" }, { xAxis: "max", yAxis: "max" }]]
      },
      markPoint: { data: [{ type: "max", name: "最大" }, { type: "min", name: "最小" }] },
      markLine: {
        data: [{ type: "average", name: "均值" }, { xAxis: refX }]
      }
    };
  }

  function ageFootLength() {
    var d = global.exampleData.ageFoot;
    var barWidth = 22;
    var colors = [
      h.linearGradient(echarts, [
        { offset: 0, color: "#28f0f5" },
        { offset: 1, color: "#077175" }
      ]),
      h.linearGradient(echarts, [
        { offset: 0, color: "#0172e2" },
        { offset: 1, color: "#0f299a" }
      ])
    ];
    return {
      backgroundColor: "rgba(33,64,112,0.22)",
      tooltip: { trigger: "axis" },
      legend: { right: 24, textStyle: { color: "#fff" } },
      grid: { left: "6%", right: "6%", top: "16%", bottom: "10%", containLabel: true },
      xAxis: [{
        type: "category",
        data: d.ages,
        name: "年龄（岁）",
        axisLine: { lineStyle: { color: "#65C6E7" } }
      }],
      yAxis: [
        {
          type: "value",
          min: 12,
          name: "脚长 cm",
          axisLabel: { formatter: "{value} cm", color: "#65C6E7" },
          splitLine: { lineStyle: { color: "rgba(101,198,231,0.25)" } }
        },
        {
          type: "value",
          name: "女 − 男",
          axisLabel: { color: "#65C6E7" },
          splitLine: { show: false }
        }
      ],
      series: [
        { z: 1, name: "女童脚长", type: "bar", barWidth: barWidth, data: d.female, itemStyle: { color: colors[0] } },
        pictorialCap(d.female, -11, "#12bac1"),
        { z: 1, name: "男童脚长", type: "bar", barGap: 0, barWidth: barWidth, data: d.male, itemStyle: { color: colors[1] } },
        pictorialCap(d.male, 11, "#319cf1"),
        {
          name: "女童 − 男童",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          showAllSymbol: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#3deaff" },
          areaStyle: {
            color: h.linearGradient(echarts, [
              { offset: 0, color: "rgba(61,234,255,0.45)" },
              { offset: 1, color: "rgba(61,234,255,0.02)" }
            ])
          },
          data: d.gap
        }
      ]
    };
  }

  function pictorialCap(data, offsetX, color) {
    return {
      z: 3,
      type: "pictorialBar",
      symbolPosition: "end",
      symbol: "diamond",
      symbolOffset: [offsetX, "-50%"],
      symbolSize: [18, 8],
      itemStyle: { borderColor: color, borderWidth: 2, color: color },
      tooltip: { show: false },
      data: data
    };
  }

  function bmiFootShape() {
    var d = global.exampleData.bmiShape;
    return {
      backgroundColor: "rgba(33,64,112,0.22)",
      color: ["#FF69B4", "#3deaff"],
      title: [{
        text: "过胖 / 过瘦示意",
        left: "83%",
        top: "4%",
        textAlign: "center",
        textStyle: { color: "#fff", fontSize: 13 }
      }],
      tooltip: { trigger: "axis" },
      legend: { right: "28%", textStyle: { color: "#fff" }, data: ["女童胖瘦度", "男童胖瘦度"] },
      grid: { left: "4%", right: "34%", top: "16%", bottom: "8%", containLabel: true },
      xAxis: { name: "BMI", type: "category", boundaryGap: false, data: d.bmi },
      yAxis: { name: "胖瘦度（展示值）", min: 20, type: "value" },
      series: [
        lineArea("女童胖瘦度", d.female, "#FF69B4", "rgba(255,105,180,0.55)"),
        lineArea("男童胖瘦度", d.male, "#3deaff", "rgba(61,234,255,0.35)"),
        ringPie(["83%", "36%"], d.rings.thin, "#dc832c", "#45d08a"),
        ringPie(["83%", "74%"], d.rings.heavy, "#ff733f", "#45d08a")
      ]
    };
  }

  function lineArea(name, data, color, fill) {
    return {
      name: name,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      lineStyle: { color: color },
      areaStyle: {
        color: h.linearGradient(echarts, [
          { offset: 0, color: fill },
          { offset: 1, color: "rgba(0,0,0,0)" }
        ])
      },
      data: data
    };
  }

  function ringPie(center, ring, color, restColor) {
    return {
      type: "pie",
      center: center,
      radius: ["22%", "28%"],
      label: { position: "center" },
      tooltip: { trigger: "item" },
      data: [
        {
          value: ring.value,
          name: ring.label,
          itemStyle: { color: color },
          label: { formatter: "{d} %", color: color, fontSize: 16 }
        },
        {
          value: ring.rest,
          name: "其余",
          tooltip: { show: false },
          itemStyle: { color: restColor },
          label: { formatter: "\n" + ring.label, color: color }
        }
      ]
    };
  }

  function footSymmetry() {
    var d = global.exampleData.symmetry;
    var options = d.series.map(function (row) {
      return { series: { data: row.data } };
    });
    return {
      baseOption: {
        backgroundColor: "rgba(49,32,112,0.22)",
        timeline: {
          playInterval: 2000,
          axisType: "category",
          autoPlay: true,
          symbol: "circle",
          symbolSize: 8,
          data: d.ages,
          lineStyle: { color: "#1f79ff", width: 2 },
          checkpointStyle: { color: "#3dd4ff", borderColor: "#1f79ff" },
          label: { color: "#8ec7ff" }
        },
        tooltip: { trigger: "item" },
        color: ["#56c979", "#5CAFF2", "#B6A2DF", "#a96ec9", "#2DC7C9"],
        legend: { top: 8, textStyle: { color: "#fff" } },
        series: [{
          type: "pie",
          radius: ["34%", "58%"],
          center: ["50%", "46%"],
          label: { fontSize: 13 }
        }]
      },
      options: options
    };
  }

  function radarGrowth() {
    var d = global.exampleData.radarGrowth;
    var colors = global.exampleData.palette.radar;
    return {
      backgroundColor: "rgba(8,16,28,0.2)",
      legend: {
        bottom: 8,
        textStyle: { color: "#fff" },
        data: d.series.map(function (s) { return s.name; })
      },
      radar: {
        indicator: d.indicators,
        shape: "circle",
        center: ["50%", "50%"],
        radius: "62%",
        startAngle: 90,
        splitNumber: 3,
        name: { color: "#fff", fontSize: 13 },
        splitArea: { areaStyle: { color: "rgba(0,0,0,0)" } },
        axisLine: { lineStyle: { color: "#BEBEBE" } },
        splitLine: { lineStyle: { color: "#BEBEBE" } }
      },
      tooltip: {},
      series: [{
        type: "radar",
        data: d.series.map(function (row, i) {
          return {
            name: row.name,
            value: row.value,
            symbolSize: 4,
            lineStyle: { color: colors[i], width: 2 },
            itemStyle: { color: colors[i], borderColor: colors[i], borderWidth: 2 },
            areaStyle: { color: colors[i], opacity: 0.18 }
          };
        })
      }]
    };
  }

  function plantarPressure() {
    var d = global.exampleData.plantarPressure;
    return {
      backgroundColor: "#0e2230",
      color: ["#a60bde", "#ff733f"],
      title: { text: d.title + "（Pa）", left: 8, top: 8, textStyle: { color: "#d4c4ff", fontSize: 14 } },
      tooltip: { trigger: "axis" },
      legend: { top: 8, right: 12, textStyle: { color: "#d4c4ff" }, data: ["正常人群", "糖尿病足人群"] },
      grid: { left: "6%", right: "6%", top: 56, bottom: 28, containLabel: true },
      xAxis: { type: "category", boundaryGap: false, data: d.sites, axisLabel: { color: "#c196eb" } },
      yAxis: { type: "value", axisLabel: { color: "#c996eb" }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.15)" } } },
      series: [
        { name: "正常人群", type: "line", smooth: true, symbol: "circle", symbolSize: 8, data: d.normal },
        { name: "糖尿病足人群", type: "line", smooth: true, symbol: "circle", symbolSize: 8, data: d.diabetic }
      ]
    };
  }

  function plantarThickness() {
    var d = global.exampleData.plantarThickness;
    return {
      backgroundColor: "#10202b",
      title: { text: d.title, left: 8, top: 8, textStyle: { color: "#8fd4ef", fontSize: 14 } },
      tooltip: { trigger: "axis" },
      legend: { top: 8, right: 8, textStyle: { color: "#d7e6ef" } },
      grid: { left: "6%", right: "6%", top: 64, bottom: 56, containLabel: true },
      dataZoom: [{ type: "slider", height: 18, bottom: 12, start: 0, end: 100 }],
      xAxis: { type: "category", data: d.sites },
      yAxis: { type: "value", name: "mm / 差值原值" },
      series: [
        {
          name: "正常人群 mm",
          type: "bar",
          data: d.normalMm,
          itemStyle: { color: "rgba(255,144,128,1)" }
        },
        {
          name: "糖尿病足人群 mm",
          type: "bar",
          data: d.diabeticMm,
          itemStyle: { color: "rgba(0,191,183,1)" }
        },
        {
          name: "差值（源码原值）",
          type: "line",
          data: d.delta,
          itemStyle: { color: "#28ffb3" }
        }
      ]
    };
  }

  function mountStandard(chartSel, notesSel, option, notes) {
    var chart = h.createChart(chartSel, "dark");
    chart.setOption(option);
    h.bindChartResize(chart);
    if (notesSel) h.mountNotes(notesSel, notes);
    return chart;
  }

  global.exampleCharts = {
    scatterHeightShoe: scatterHeightShoe,
    ageFootLength: ageFootLength,
    bmiFootShape: bmiFootShape,
    footSymmetry: footSymmetry,
    radarGrowth: radarGrowth,
    plantarPressure: plantarPressure,
    plantarThickness: plantarThickness,
    mountStandard: mountStandard
  };
})(window);
