(function () {
  var status = ".status";

  function seriesOption(name, color, areaName, points, refX) {
    return {
      name: name,
      type: "scatter",
      symbolSize: 5,
      itemStyle: { color: color },
      data: points,
      markArea: {
        silent: true,
        itemStyle: {
          color: "transparent",
          borderWidth: 1,
          borderType: "dashed"
        },
        data: [[{ name: areaName, xAxis: "min", yAxis: "min" }, { xAxis: "max", yAxis: "max" }]]
      },
      markPoint: {
        data: [
          { type: "max", name: "最大值" },
          { type: "min", name: "最小值" }
        ]
      },
      markLine: {
        data: [{ type: "average", name: "平均值" }, { xAxis: refX }]
      }
    };
  }

  FootExamples.loadDataset("height-shoe-size")
    .then(function (data) {
      var girls = FootExamples.pairsToScatter(data.series.girls, "heightCm", "shoeLengthCm");
      var boys = FootExamples.pairsToScatter(data.series.boys, "heightCm", "shoeLengthCm");
      var chart = FootExamples.initChart(".chart");
      chart.setOption({
        backgroundColor: "rgba(27,116,163,0.18)",
        tooltip: {
          formatter: function (params) {
            if (!params.value || params.value.length < 2) {
              return params.seriesName;
            }
            return (
              params.seriesName +
              "<br/>身高：" +
              params.value[0] +
              " cm<br/>鞋码：" +
              params.value[1] +
              " cm"
            );
          }
        },
        toolbox: {
          feature: { dataZoom: {}, brush: { type: ["rect", "polygon", "clear"] }, saveAsImage: {} }
        },
        brush: {},
        legend: { data: ["女性", "男性"], textStyle: { color: "#fff" }, top: 8 },
        grid: { left: "6%", right: "8%", bottom: "8%", containLabel: true },
        xAxis: {
          name: "身高",
          type: "value",
          scale: true,
          axisLabel: { formatter: "{value} cm" },
          splitLine: { show: false }
        },
        yAxis: {
          name: "鞋码",
          type: "value",
          scale: true,
          axisLabel: { formatter: "{value} cm" },
          splitLine: { show: false }
        },
        series: [
          seriesOption("女性", "#ff4f3b", "女性分布区间", girls, 115),
          seriesOption("男性", "#ffe01f", "男性分布区间", boys, 110)
        ]
      });
      FootExamples.bindResize(chart);
      var g = data.summary.girls;
      var b = data.summary.boys;
      FootExamples.setStatus(
        status,
        "Loaded " +
          g.n +
          " girl points and " +
          b.n +
          " boy points. Mean height " +
          g.heightCm.mean +
          " / " +
          b.heightCm.mean +
          " cm."
      );
    })
    .catch(function (err) {
      FootExamples.fail(status, err);
    });
})();
