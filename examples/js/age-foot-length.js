document.addEventListener("DOMContentLoaded", function () {
  FootTheme.fetchJson("data/age-foot-length.json").then(function (data) {
    var flipAt = null;
    for (var i = 0; i < data.female_minus_male_cm.length; i++) {
      if (data.female_minus_male_cm[i] < 0) {
        flipAt = data.ages[i];
        break;
      }
    }
    FootTheme.fillStats({
      "stat-ages": data.ages[0] + "–" + data.ages[data.ages.length - 1] + " 岁",
      "stat-girl-end": data.female_foot_length_cm[data.female_foot_length_cm.length - 1] + " cm",
      "stat-boy-end": data.male_foot_length_cm[data.male_foot_length_cm.length - 1] + " cm",
      "stat-flip": flipAt ? flipAt + " 岁起男生均值更高" : "该序列未翻号"
    });

    var option = FootTheme.darkOption({
      title: { text: "年龄 × 平均脚长", left: 16, top: 12, textStyle: { color: "#e8f4f8", fontSize: 16 } },
      tooltip: { trigger: "axis" },
      legend: { top: 16, data: ["女生脚长", "男生脚长", "女生 − 男生"] },
      xAxis: {
        type: "category",
        data: data.ages.map(function (a) { return a + "岁"; }),
        axisLabel: { color: FootTheme.colors.axis }
      },
      yAxis: [
        {
          type: "value",
          name: "脚长",
          min: 12,
          axisLabel: { formatter: "{value} cm", color: FootTheme.colors.axis },
          splitLine: { lineStyle: { color: FootTheme.colors.split } }
        },
        {
          type: "value",
          name: "差值",
          axisLabel: { formatter: "{value} cm", color: FootTheme.colors.axis },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: "女生脚长",
          type: "bar",
          barMaxWidth: 22,
          itemStyle: { color: FootTheme.colors.girl },
          data: data.female_foot_length_cm
        },
        {
          name: "男生脚长",
          type: "bar",
          barMaxWidth: 22,
          itemStyle: { color: FootTheme.colors.boy },
          data: data.male_foot_length_cm
        },
        {
          name: "女生 − 男生",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: FootTheme.colors.gap },
          areaStyle: { color: "rgba(61, 234, 255, 0.16)" },
          data: data.female_minus_male_cm
        }
      ]
    });
    FootTheme.mount("chart", option);
  });
});
