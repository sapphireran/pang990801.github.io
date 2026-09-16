document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    FootTheme.fetchJson("data/height-shoe-female.json"),
    FootTheme.fetchJson("data/height-shoe-male.json")
  ]).then(function (pair) {
    var female = pair[0];
    var male = pair[1];
    var f = FootTheme.stats(female, "height_cm");
    var m = FootTheme.stats(male, "height_cm");
    var fs = FootTheme.stats(female, "shoe_cm");
    var ms = FootTheme.stats(male, "shoe_cm");
    FootTheme.fillStats({
      "stat-n": String(f.n + m.n),
      "stat-girl-height": f.min + "–" + f.max + " cm（均 " + f.mean + "）",
      "stat-boy-height": m.min + "–" + m.max + " cm（均 " + m.mean + "）",
      "stat-girl-shoe": fs.min + "–" + fs.max + " cm（均 " + fs.mean + "）",
      "stat-boy-shoe": ms.min + "–" + ms.max + " cm（均 " + ms.mean + "）"
    });

    var option = FootTheme.darkOption({
      title: { text: "身高 × 鞋码散点", left: 16, top: 12, textStyle: { color: "#e8f4f8", fontSize: 16 } },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return params.seriesName + "<br/>身高 " + params.value[0] + " cm<br/>鞋码 " + params.value[1] + " cm";
        }
      },
      toolbox: {
        feature: {
          dataZoom: {},
          brush: { type: ["rect", "polygon", "clear"] },
          saveAsImage: { name: "height-shoe" }
        }
      },
      brush: {},
      legend: { top: 16, textStyle: { color: "#e8f4f8" }, data: ["女生", "男生"] },
      xAxis: {
        name: "身高",
        type: "value",
        scale: true,
        axisLabel: { formatter: "{value} cm", color: FootTheme.colors.axis },
        splitLine: { lineStyle: { color: FootTheme.colors.split } }
      },
      yAxis: {
        name: "鞋码（按原图以 cm 显示）",
        type: "value",
        scale: true,
        axisLabel: { formatter: "{value} cm", color: FootTheme.colors.axis },
        splitLine: { lineStyle: { color: FootTheme.colors.split } }
      },
      series: [
        {
          name: "女生",
          type: "scatter",
          symbolSize: 6,
          itemStyle: { color: FootTheme.colors.girlScatter },
          data: female.map(function (p) { return [p.height_cm, p.shoe_cm]; }),
          markLine: {
            silent: true,
            data: [{ type: "average", name: "均值" }, { xAxis: 115 }]
          }
        },
        {
          name: "男生",
          type: "scatter",
          symbolSize: 6,
          itemStyle: { color: FootTheme.colors.boyScatter },
          data: male.map(function (p) { return [p.height_cm, p.shoe_cm]; }),
          markLine: {
            silent: true,
            data: [{ type: "average", name: "均值" }, { xAxis: 110 }]
          }
        }
      ]
    });
    FootTheme.mount("chart", option);
  });
});
