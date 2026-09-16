ExampleCommon.onReady(function () {
  var data = ExampleCommon.requireData("ageFootLength");
  var chart = echarts.init(ExampleCommon.$("#age-length-chart"));
  ExampleCommon.bindChartResize(chart);

  function render(mode) {
    var series = [
      {
        name: "女童脚长",
        type: "bar",
        data: data.girls,
        itemStyle: { color: "#12bac1" },
      },
      {
        name: "男童脚长",
        type: "bar",
        data: data.boys,
        itemStyle: { color: "#319cf1" },
      },
    ];
    if (mode === "with-diff") {
      series.push({
        name: "女童 − 男童",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: { color: "#3deaff" },
        areaStyle: { color: "rgba(61,234,255,0.18)" },
        data: data.girl_minus_boy,
      });
    }
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        legend: { top: 8, textStyle: { color: "#d7f6ff" } },
        grid: { left: 56, right: 56, top: 48, bottom: 40 },
        xAxis: {
          type: "category",
          data: data.ages,
          name: "年龄",
          axisLabel: { color: "#d7f6ff" },
          axisLine: { lineStyle: { color: "#65C6E7" } },
        },
        yAxis: [
          {
            type: "value",
            min: 12,
            name: "脚长 cm",
            axisLabel: { color: "#d7f6ff", formatter: "{value} cm" },
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
          },
          {
            type: "value",
            name: "差值 cm",
            axisLabel: { color: "#3deaff" },
            splitLine: { show: false },
          },
        ],
        series: series,
      },
      true
    );
  }

  var crossover = data.rows.find(function (row) {
    return row.girl_minus_boy_cm < 0;
  });
  ExampleCommon.setText("#kpi-start-gap", data.girl_minus_boy[0] + " cm");
  ExampleCommon.setText("#kpi-end-gap", data.girl_minus_boy[data.girl_minus_boy.length - 1] + " cm");
  ExampleCommon.setText("#kpi-crossover", crossover ? crossover.age_years + " 岁" : "无");

  ExampleCommon.fillTable(
    ExampleCommon.$("#age-length-table"),
    ["年龄", "女童 cm", "男童 cm", "女 − 男 cm"],
    data.rows.map(function (row) {
      return [row.age_years, row.girl_foot_length_cm, row.boy_foot_length_cm, row.girl_minus_boy_cm];
    })
  );

  render("with-diff");
  ExampleCommon.wireToggles("#diff-filter", render);
});
