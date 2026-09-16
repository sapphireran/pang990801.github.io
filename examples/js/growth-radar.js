document.addEventListener("DOMContentLoaded", function () {
  FootTheme.fetchJson("data/growth-radar.json").then(function (data) {
    FootTheme.fillStats({
      "stat-ages": data.series.map(function (s) { return s.age; }).join(" / ") + " 岁",
      "stat-scale": data.scale,
      "stat-spokes": String(data.indicators.length)
    });

    var option = FootTheme.darkOption({
      title: { text: "9–12 岁相对生长雷达", left: 16, top: 12, textStyle: { color: "#e8f4f8", fontSize: 16 } },
      tooltip: { trigger: "item" },
      legend: { bottom: 8, data: data.series.map(function (s) { return s.age + "岁"; }) },
      radar: {
        indicator: data.indicators,
        shape: "circle",
        splitNumber: 4,
        axisName: { color: "#e8f4f8", fontSize: 13 },
        splitLine: { lineStyle: { color: "rgba(190,190,190,0.35)" } },
        splitArea: { areaStyle: { color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"] } },
        axisLine: { lineStyle: { color: "rgba(190,190,190,0.35)" } }
      },
      series: [{
        type: "radar",
        data: data.series.map(function (s, i) {
          return {
            name: s.age + "岁",
            value: s.values,
            lineStyle: { color: FootTheme.colors.radar[i] },
            itemStyle: { color: FootTheme.colors.radar[i] },
            areaStyle: { color: FootTheme.colors.radar[i], opacity: 0.18 }
          };
        })
      }]
    });
    FootTheme.mount("chart", option);
  });
});
