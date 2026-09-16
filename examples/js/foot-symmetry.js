document.addEventListener("DOMContentLoaded", function () {
  FootTheme.fetchJson("data/foot-symmetry.json").then(function (data) {
    var names = ["双脚相同", "左脚大 10–20%", "左脚大 20%+", "右脚大 20%+", "右脚大 10–20%"];
    var keys = ["same", "left_10_20", "left_over_20", "right_over_20", "right_10_20"];
    FootTheme.fillStats({
      "stat-model": data.model,
      "stat-ages": data.series[0].age_label + " → " + data.series[data.series.length - 1].age_label
    });

    var options = data.series.map(function (row) {
      return {
        series: [{
          data: keys.map(function (k, i) {
            return { name: names[i], value: row[k] };
          })
        }]
      };
    });

    var option = {
      baseOption: FootTheme.darkOption({
        title: { text: "左右脚类别时间轴（示意公式）", left: 16, top: 8, textStyle: { color: "#e8f4f8", fontSize: 16 } },
        timeline: {
          axisType: "category",
          autoPlay: true,
          playInterval: 2000,
          data: data.series.map(function (s) { return s.age_label; }),
          bottom: 8,
          label: { color: FootTheme.colors.axis },
          lineStyle: { color: FootTheme.colors.accent },
          checkpointStyle: { color: FootTheme.colors.accent }
        },
        tooltip: { trigger: "item" },
        color: FootTheme.colors.pie,
        series: [{
          type: "pie",
          radius: ["36%", "58%"],
          center: ["50%", "46%"],
          label: { color: "#e8f4f8" }
        }]
      }),
      options: options
    };
    FootTheme.mount("chart", option);
  });
});
