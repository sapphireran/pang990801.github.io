(function () {
  var chart;

  FootData.load("tissue-thickness").then(function (pack) {
    chart = echarts.init(document.getElementById("thickness-chart"), "dark");
    var sites = [];
    for (var i = 1; i <= pack.siteCount; i += 1) {
      sites.push(pack.sitePrefixZh + i);
    }
    document.getElementById("thickness-note").textContent =
      "柱为毫米，绿色差值线按原稿图例标成微米。两条量纲不能直接相减核对。";

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        top: 8,
        textStyle: { color: "#d7e6f2" },
        data: ["正常人群 mm", "糖尿病足人群 mm", "差值 um"]
      },
      grid: { left: 48, right: 24, top: 56, bottom: 72 },
      dataZoom: [{ type: "slider", start: 0, end: 100, bottom: 18, height: 18 }],
      xAxis: {
        type: "category",
        data: sites,
        axisLabel: { color: "#d7e6f2", interval: 0 },
        axisLine: { lineStyle: { color: "#90979c" } }
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#d7e6f2" },
        splitLine: { show: false }
      },
      series: [
        {
          name: "正常人群 mm",
          type: "bar",
          data: pack.series.typicalAdultMm,
          itemStyle: { color: "rgba(255,144,128,1)" }
        },
        {
          name: "糖尿病足人群 mm",
          type: "bar",
          data: pack.series.diabeticFootMm,
          itemStyle: { color: "rgba(0,191,183,1)" }
        },
        {
          name: "差值 um",
          type: "line",
          data: pack.series.differenceUm,
          symbol: "emptyCircle",
          itemStyle: { color: "#28ffb3" }
        }
      ]
    });
    window.addEventListener("resize", function () { chart.resize(); });
  }).catch(function (err) {
    document.getElementById("thickness-chart").textContent = err.message;
  });
})();
