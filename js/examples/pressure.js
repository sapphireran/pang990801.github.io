(function () {
  var chart;

  FootData.load("plantar-pressure").then(function (pack) {
    chart = echarts.init(document.getElementById("pressure-chart"), "dark");
    var typicalShare = Math.round(100 * pack.sourceShare.highlighted / (pack.sourceShare.highlighted + pack.sourceShare.placeholder));
    document.getElementById("pressure-note").textContent =
      "右侧环图沿用原稿占位算法，示意“正常人群”约 " + typicalShare + "%。（位点没有解剖名称。）";

    chart.setOption({
      backgroundColor: "transparent",
      color: ["#a60bde", "#ff733f"],
      tooltip: { trigger: "axis" },
      legend: { top: 8, textStyle: { color: "#d7e6f2" }, data: ["正常人群", "糖尿病足人群"] },
      grid: { left: 48, right: "34%", top: 56, bottom: 36 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: pack.sites,
        axisLabel: { color: "#c196eb" },
        axisLine: { lineStyle: { color: "#fff" } }
      },
      yAxis: {
        type: "value",
        name: "Pa",
        axisLabel: { color: "#c996eb" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } }
      },
      series: [
        { name: "正常人群", type: "line", smooth: true, symbol: "circle", symbolSize: 8, data: pack.series.typicalAdult },
        { name: "糖尿病足人群", type: "line", smooth: true, symbol: "circle", symbolSize: 8, data: pack.series.diabeticFoot },
        {
          type: "pie",
          center: ["84%", "42%"],
          radius: ["28%", "36%"],
          label: { color: "#a60bde" },
          data: [
            { value: pack.sourceShare.highlighted, name: pack.sourceShare.labelZh, itemStyle: { color: "#a60bde" } },
            { value: pack.sourceShare.placeholder, name: "占位", tooltip: { show: false }, itemStyle: { color: "#87CEFA" }, label: { formatter: "正常人群" } }
          ]
        }
      ]
    });
    window.addEventListener("resize", function () { chart.resize(); });
  }).catch(function (err) {
    document.getElementById("pressure-chart").textContent = err.message;
  });
})();
