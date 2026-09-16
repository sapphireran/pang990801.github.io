document.addEventListener("DOMContentLoaded", function () {
  FootTheme.fetchJson("data/tissue-thickness.json").then(function (data) {
    FootTheme.fillStats({
      "stat-sites": String(data.sites.length),
      "stat-normal": Math.min.apply(null, data.normal_adult_mm) + "–" + Math.max.apply(null, data.normal_adult_mm) + " mm",
      "stat-df": Math.min.apply(null, data.diabetic_adult_mm) + "–" + Math.max.apply(null, data.diabetic_adult_mm) + " mm"
    });

    var option = FootTheme.darkOption({
      title: { text: "软组织厚度草稿（14 个位点）", left: 16, top: 12, textStyle: { color: "#e8f4f8", fontSize: 16 } },
      tooltip: { trigger: "axis" },
      legend: { top: 16, data: ["成年普通 mm", "成年糖尿病足 mm", "独立差值序列"] },
      dataZoom: [{ type: "slider", start: 0, end: 100, height: 18, bottom: 8 }],
      xAxis: {
        type: "category",
        data: data.sites,
        axisLabel: { color: FootTheme.colors.axis, interval: 0 }
      },
      yAxis: {
        type: "value",
        axisLabel: { color: FootTheme.colors.axis },
        splitLine: { lineStyle: { color: FootTheme.colors.split } }
      },
      series: [
        {
          name: "成年普通 mm",
          type: "bar",
          barMaxWidth: 18,
          itemStyle: { color: FootTheme.colors.thickness[0] },
          data: data.normal_adult_mm
        },
        {
          name: "成年糖尿病足 mm",
          type: "bar",
          barMaxWidth: 18,
          itemStyle: { color: FootTheme.colors.thickness[1] },
          data: data.diabetic_adult_mm
        },
        {
          name: "独立差值序列",
          type: "line",
          symbol: "emptyCircle",
          symbolSize: 7,
          itemStyle: { color: FootTheme.colors.thickness[2] },
          data: data.difference_um
        }
      ]
    });
    FootTheme.mount("chart", option);
  });
});
