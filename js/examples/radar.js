(function () {
  var chart;
  var data;
  var boxes = Array.prototype.slice.call(document.querySelectorAll("input[name=age]"));
  var colors = { 9: "#00c2ff", 10: "#f9cf67", 11: "#32CD32", 12: "#e92b77" };

  function selectedAges() {
    return boxes.filter(function (b) { return b.checked; }).map(function (b) { return Number(b.value); });
  }

  function render() {
    var ages = selectedAges();
    var indicators = data.indicators.map(function (ind) {
      return { name: ind.labelZh, max: 100 };
    });
    var seriesData = data.series.filter(function (row) {
      return ages.indexOf(row.age) !== -1;
    }).map(function (row) {
      return {
        name: row.age + "岁",
        value: row.values,
        itemStyle: { color: colors[row.age] },
        areaStyle: { color: colors[row.age], opacity: 0.28 },
        lineStyle: { width: 2 }
      };
    });

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {},
      legend: { bottom: 0, textStyle: { color: "#d7e6f2" } },
      radar: {
        indicator: indicators,
        shape: "circle",
        splitNumber: 4,
        axisName: { color: "#fff" },
        splitLine: { lineStyle: { color: "rgba(190,190,190,0.35)" } },
        splitArea: { areaStyle: { color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"] } },
        axisLine: { lineStyle: { color: "rgba(190,190,190,0.35)" } }
      },
      series: [{ type: "radar", data: seriesData }]
    }, true);
  }

  FootData.load("age-radar-profiles").then(function (pack) {
    data = pack;
    chart = echarts.init(document.getElementById("radar-chart"), "dark");
    render();
    window.addEventListener("resize", function () { chart.resize(); });
    boxes.forEach(function (box) { box.addEventListener("change", render); });
  }).catch(function (err) {
    document.getElementById("radar-chart").textContent = err.message;
  });
})();
