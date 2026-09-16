document.addEventListener("DOMContentLoaded", function () {
  FootTheme.fetchJson("data/bmi-foot-shape.json").then(function (data) {
    FootTheme.fillStats({
      "stat-bmi": data.bmi[0] + "–" + data.bmi[data.bmi.length - 1],
      "stat-girl": data.female_length_width_ratio[0] + " → " + data.female_length_width_ratio[data.female_length_width_ratio.length - 1],
      "stat-boy": data.male_length_width_ratio[0] + " → " + data.male_length_width_ratio[data.male_length_width_ratio.length - 1]
    });

    var option = FootTheme.darkOption({
      title: { text: "BMI × 脚型指数", left: 16, top: 12, textStyle: { color: "#e8f4f8", fontSize: 16 } },
      tooltip: { trigger: "axis" },
      legend: { top: 16, data: ["女生", "男生"] },
      xAxis: {
        name: "BMI",
        type: "category",
        boundaryGap: false,
        data: data.bmi,
        axisLabel: { color: FootTheme.colors.axis }
      },
      yAxis: {
        name: "原图标签：脚长/脚宽",
        min: 20,
        axisLabel: { color: FootTheme.colors.axis },
        splitLine: { lineStyle: { color: FootTheme.colors.split } }
      },
      series: [
        {
          name: "女生",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: FootTheme.colors.girl },
          areaStyle: { color: "rgba(255, 107, 138, 0.18)" },
          data: data.female_length_width_ratio
        },
        {
          name: "男生",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: FootTheme.colors.boy },
          areaStyle: { color: "rgba(61, 234, 255, 0.14)" },
          data: data.male_length_width_ratio
        }
      ]
    });
    FootTheme.mount("chart", option);
  });
});
