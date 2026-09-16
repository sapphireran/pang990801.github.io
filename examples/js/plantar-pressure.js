document.addEventListener("DOMContentLoaded", function () {
  FootTheme.fetchJson("data/plantar-pressure.json").then(function (data) {
    FootTheme.fillStats({
      "stat-sites": String(data.sites.length),
      "stat-unit": data.unit,
      "stat-normal-peak": String(Math.max.apply(null, data.normal)),
      "stat-df-peak": String(Math.max.apply(null, data.diabetic_foot))
    });

    var option = FootTheme.darkOption({
      title: { text: "足底压力草稿（7 个位点）", left: 16, top: 12, textStyle: { color: "#e8f4f8", fontSize: 16 } },
      tooltip: { trigger: "axis" },
      legend: { top: 16, data: ["示意·普通", "示意·糖尿病足"] },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.sites,
        axisLabel: { color: FootTheme.colors.axis }
      },
      yAxis: {
        type: "value",
        name: data.unit + "（标题单位，未校准）",
        axisLabel: { color: FootTheme.colors.axis },
        splitLine: { lineStyle: { color: FootTheme.colors.split } }
      },
      series: [
        {
          name: "示意·普通",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: FootTheme.colors.pressure[0] },
          data: data.normal
        },
        {
          name: "示意·糖尿病足",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: FootTheme.colors.pressure[1] },
          data: data.diabetic_foot
        }
      ]
    });
    FootTheme.mount("chart", option);
  });
});
