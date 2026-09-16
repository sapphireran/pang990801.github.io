ExampleCommon.onReady(function () {
  var data = ExampleCommon.requireData("bmiFootRatio");
  var chart = echarts.init(ExampleCommon.$("#bmi-chart"));
  ExampleCommon.bindChartResize(chart);

  function line(name, color, fill, values) {
    return {
      name: name,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      itemStyle: { color: color },
      areaStyle: { color: fill },
      data: values,
    };
  }

  function render(filter) {
    var series = [];
    if (filter === "all" || filter === "female") {
      series.push(line("女童脚胖瘦度", "#FF69B4", "rgba(255,105,180,0.18)", data.girls));
    }
    if (filter === "all" || filter === "male") {
      series.push(line("男童脚胖瘦度", "#3deaff", "rgba(61,234,255,0.18)", data.boys));
    }
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        legend: { top: 8, textStyle: { color: "#d7f6ff" } },
        grid: { left: 58, right: 24, top: 48, bottom: 40 },
        xAxis: {
          type: "category",
          name: "BMI",
          data: data.bmi,
          axisLabel: { color: "#d7f6ff" },
          axisLine: { lineStyle: { color: "#65C6E7" } },
        },
        yAxis: {
          type: "value",
          min: 20,
          name: "脚长/脚宽 显示值",
          axisLabel: { color: "#d7f6ff" },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
        },
        series: series,
      },
      true
    );
  }

  ExampleCommon.setText("#kpi-thin", data.thin_share_percent + "%");
  ExampleCommon.setText("#kpi-wide", data.wide_share_percent + "%");
  ExampleCommon.setText("#kpi-girl-end", data.girls[data.girls.length - 1]);
  ExampleCommon.setText("#kpi-boy-end", data.boys[data.boys.length - 1]);

  ExampleCommon.fillTable(
    ExampleCommon.$("#bmi-table"),
    ["BMI", "女童 脚胖瘦度", "男童 脚胖瘦度"],
    data.rows.map(function (row) {
      return [row.bmi, row.girl_length_width_ratio, row.boy_length_width_ratio];
    })
  );

  render("all");
  ExampleCommon.wireToggles("#bmi-filter", render);
});
