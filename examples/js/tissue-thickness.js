(function () {
  var status = ".status";

  FootExamples.loadDataset("tissue-thickness")
    .then(function (data) {
      var chart = FootExamples.initChart(".chart");
      chart.setOption({
        backgroundColor: "rgba(255,255,255,0.03)",
        title: {
          text: data.title,
          left: "3%",
          top: 12,
          textStyle: { color: "#8fd6f0", fontSize: 18 }
        },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: {
          top: 44,
          left: "3%",
          textStyle: { color: "#d5e6ef" },
          data: ["正常人群(成年)数据:mm", "糖尿病足人群(成年)数据:mm", "差值:um"]
        },
        grid: { top: 100, left: "6%", right: "4%", bottom: 90, containLabel: true },
        dataZoom: [
          { show: true, height: 28, bottom: 24, start: 10, end: 80 },
          { type: "inside", start: 10, end: 80 }
        ],
        xAxis: {
          type: "category",
          data: data.sites,
          axisLabel: { interval: 0, color: "#c5d0d6" }
        },
        yAxis: {
          type: "value",
          splitLine: { show: false },
          axisLabel: { color: "#c5d0d6" }
        },
        series: [
          {
            name: "正常人群(成年)数据:mm",
            type: "bar",
            barMaxWidth: 32,
            itemStyle: { color: "rgba(255,144,128,1)" },
            label: { show: true, position: "insideTop", color: "#fff" },
            data: data.typicalAdultsMm
          },
          {
            name: "糖尿病足人群(成年)数据:mm",
            type: "bar",
            barMaxWidth: 32,
            itemStyle: { color: "rgba(0,191,183,1)" },
            label: { show: true, position: "top", color: "#d9fff8" },
            data: data.diabeticFootAdultsMm
          },
          {
            name: "差值:um",
            type: "line",
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 7,
            itemStyle: { color: "#28ffb3" },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(0,154,120,0.9)" },
                  { offset: 1, color: "rgba(0,0,0,0)" }
                ])
              }
            },
            data: data.differenceUm
          }
        ]
      });
      FootExamples.bindResize(chart);
      FootExamples.setStatus(
        status,
        "Difference line is the original illustrative series, not (diabetic − typical) converted to micrometers. Zoom opens on sites 2–11."
      );
    })
    .catch(function (err) {
      FootExamples.fail(status, err);
    });
})();
