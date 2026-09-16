ExampleCommon.onReady(function () {
  var data = ExampleCommon.requireData("plantarPressure");
  var chart = echarts.init(ExampleCommon.$("#pressure-chart"));
  ExampleCommon.bindChartResize(chart);

  function render(filter) {
    var series = [];
    if (filter === "all" || filter === "typical") {
      series.push({
        name: "典型人群",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: { color: "#b6a2de" },
        data: data.typical,
      });
    }
    if (filter === "all" || filter === "diabetic") {
      series.push({
        name: "糖尿病足人群",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: { color: "#ff733f" },
        data: data.diabetic_foot,
      });
    }
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        legend: { top: 8, textStyle: { color: "#d7f6ff" } },
        grid: { left: 52, right: 24, top: 48, bottom: 40 },
        xAxis: {
          type: "category",
          data: data.sites_zh,
          axisLabel: { color: "#d7f6ff" },
          axisLine: { lineStyle: { color: "#65C6E7" } },
        },
        yAxis: {
          type: "value",
          name: "Pa",
          axisLabel: { color: "#d7f6ff" },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
        },
        series: series,
      },
      true
    );
  }

  var maxTypical = Math.max.apply(null, data.typical);
  var maxDiabetic = Math.max.apply(null, data.diabetic_foot);
  ExampleCommon.setText("#kpi-typical-peak", maxTypical + " Pa @ " + data.sites_zh[data.typical.indexOf(maxTypical)]);
  ExampleCommon.setText("#kpi-diabetic-peak", maxDiabetic + " Pa @ " + data.sites_zh[data.diabetic_foot.indexOf(maxDiabetic)]);
  ExampleCommon.setText("#kpi-invert", "位点五");

  ExampleCommon.fillTable(
    ExampleCommon.$("#pressure-table"),
    ["位点", "典型 Pa", "糖尿病足 Pa", "差值 Pa"],
    data.rows.map(function (row) {
      return [row.site_zh, row.typical_pa, row.diabetic_foot_pa, row.difference_pa];
    })
  );

  render("all");
  ExampleCommon.wireToggles("#pressure-filter", render);
});
