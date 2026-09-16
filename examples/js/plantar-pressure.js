(function () {
  var status = ".status";

  FootExamples.loadDataset("plantar-pressure")
    .then(function (data) {
      var typical = data.series.typicalAdults;
      var diabetic = data.series.diabeticFootAdults;
      var chart = FootExamples.initChart(".chart");
      chart.setOption({
        backgroundColor: "rgba(150,232,235,0.08)",
        color: ["#a60bde", "#ff733f"],
        title: [
          {
            text: data.title + " (Pa)",
            left: "2%",
            top: "4%",
            textStyle: { color: "#d8c6ff", fontSize: 16 }
          },
          {
            text: "系列对照",
            left: "84%",
            top: "4%",
            textAlign: "center",
            textStyle: { color: "#d8c6ff", fontSize: 14 }
          }
        ],
        tooltip: { trigger: "axis" },
        legend: {
          top: "5%",
          left: "28%",
          textStyle: { color: "#d8c6ff" },
          data: ["正常人群", "糖尿病足人群"]
        },
        grid: { left: "4%", right: "32%", top: "16%", bottom: "8%", containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.sites,
          axisLabel: { color: "#c196eb" }
        },
        yAxis: {
          type: "value",
          name: "Pa",
          axisLabel: { color: "#c996eb" },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } }
        },
        series: [
          {
            name: "正常人群",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            data: typical
          },
          {
            name: "糖尿病足人群",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            data: diabetic
          },
          {
            type: "pie",
            center: ["84%", "42%"],
            radius: ["22%", "28%"],
            label: { position: "center" },
            data: [
              {
                value: typical.reduce(function (a, b) {
                  return a + b;
                }, 0),
                name: "正常人群合计",
                itemStyle: { color: "#a60bde" },
                label: { formatter: "{d} %", color: "#a60bde", fontSize: 18 }
              },
              {
                value: diabetic.reduce(function (a, b) {
                  return a + b;
                }, 0),
                name: "糖尿病足合计",
                itemStyle: { color: "#87CEFA" },
                label: { formatter: "\n合计对照", color: "#a60bde" }
              }
            ]
          }
        ]
      });
      FootExamples.bindResize(chart);
      FootExamples.setStatus(
        status,
        "Personal sketch from draw1.js. The leftover “潍V” legend item is omitted because it had no series."
      );
    })
    .catch(function (err) {
      FootExamples.fail(status, err);
    });
})();
