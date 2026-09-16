ExampleCommon.onReady(function () {
  var data = ExampleCommon.requireData("tissueThickness");
  var chart = echarts.init(ExampleCommon.$("#thickness-chart"));
  ExampleCommon.bindChartResize(chart);

  function render(mode) {
    var series = [
      {
        name: "典型人群 mm",
        type: "bar",
        data: data.typical_mm,
        itemStyle: { color: "rgba(255,144,128,1)" },
      },
      {
        name: "糖尿病足人群 mm",
        type: "bar",
        data: data.diabetic_foot_mm,
        itemStyle: { color: "rgba(0,191,183,1)" },
      },
    ];
    if (mode === "with-diff") {
      series.push({
        name: "差值显示轨",
        type: "line",
        yAxisIndex: 1,
        smooth: false,
        symbol: "emptyCircle",
        symbolSize: 7,
        itemStyle: { color: "#28ffb3" },
        areaStyle: { color: "rgba(0,154,120,0.25)" },
        data: data.difference_um,
      });
    }
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        legend: { top: 8, textStyle: { color: "#d7f6ff" } },
        grid: { left: 52, right: 52, top: 56, bottom: 72 },
        dataZoom: [{ type: "slider", start: 0, end: 100, bottom: 18 }],
        xAxis: {
          type: "category",
          data: data.sites_zh,
          axisLabel: { color: "#d7f6ff", interval: 0, rotate: 30 },
          axisLine: { lineStyle: { color: "#90979c" } },
        },
        yAxis: [
          {
            type: "value",
            name: "mm",
            axisLabel: { color: "#d7f6ff" },
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
          },
          {
            type: "value",
            name: "显示差值",
            axisLabel: { color: "#28ffb3" },
            splitLine: { show: false },
          },
        ],
        series: series,
      },
      true
    );
  }

  var gaps = data.typical_mm.map(function (value, index) {
    return Number((data.diabetic_foot_mm[index] - value).toFixed(1));
  });
  ExampleCommon.setText("#kpi-sites", String(data.sites_zh.length));
  ExampleCommon.setText("#kpi-min-gap", Math.min.apply(null, gaps).toFixed(1) + " mm");
  ExampleCommon.setText("#kpi-max-gap", Math.max.apply(null, gaps).toFixed(1) + " mm");

  ExampleCommon.fillTable(
    ExampleCommon.$("#thickness-table"),
    ["位点", "典型 mm", "糖尿病足 mm", "mm 差", "文件中的差值轨"],
    data.rows.map(function (row, index) {
      return [
        row.site_zh,
        row.typical_mm,
        row.diabetic_foot_mm,
        gaps[index],
        row.difference_um,
      ];
    })
  );

  render("with-diff");
  ExampleCommon.wireToggles("#thickness-filter", render);
});
