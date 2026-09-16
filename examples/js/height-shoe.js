ExampleCommon.onReady(function () {
  var data = ExampleCommon.requireData("heightShoe");
  var chart = echarts.init(ExampleCommon.$("#height-shoe-chart"));
  ExampleCommon.bindChartResize(chart);

  function seriesFor(sex) {
    var points = sex === "female" ? data.female : data.male;
    return {
      name: sex === "female" ? "女童" : "男童",
      type: "scatter",
      symbolSize: 6,
      itemStyle: {
        color: sex === "female" ? "#ff6b7a" : "#ffe01f",
      },
      data: points,
    };
  }

  function render(filter) {
    var series = [];
    if (filter === "all" || filter === "female") {
      series.push(seriesFor("female"));
    }
    if (filter === "all" || filter === "male") {
      series.push(seriesFor("male"));
    }
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: {
          formatter: function (params) {
            return (
              params.seriesName +
              "<br/>身高 " +
              params.value[0] +
              " cm<br/>鞋码(脚长) " +
              params.value[1] +
              " cm"
            );
          },
        },
        legend: {
          top: 8,
          textStyle: { color: "#d7f6ff" },
        },
        grid: { left: 56, right: 28, top: 48, bottom: 48 },
        xAxis: {
          name: "身高 cm",
          nameTextStyle: { color: "#9bb3c9" },
          axisLine: { lineStyle: { color: "#65C6E7" } },
          axisLabel: { color: "#d7f6ff" },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
        },
        yAxis: {
          name: "鞋码 / 脚长 cm",
          nameTextStyle: { color: "#9bb3c9" },
          axisLine: { lineStyle: { color: "#65C6E7" } },
          axisLabel: { color: "#d7f6ff" },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
        },
        series: series,
      },
      true
    );
  }

  ExampleCommon.setText("#kpi-girl-n", String(data.summary.female_n));
  ExampleCommon.setText("#kpi-boy-n", String(data.summary.male_n));
  ExampleCommon.setText("#kpi-girl-height", data.summary.female_height_mean + " cm");
  ExampleCommon.setText("#kpi-boy-height", data.summary.male_height_mean + " cm");

  var tableRows = data.rows.map(function (row) {
    return [row.sex_zh, row.height_cm, row.shoe_length_cm];
  });
  ExampleCommon.fillTable(ExampleCommon.$("#height-shoe-table"), ["性别", "身高 cm", "鞋码 / 脚长 cm"], tableRows);

  render("all");
  ExampleCommon.wireToggles("#sex-filter", render);
});
