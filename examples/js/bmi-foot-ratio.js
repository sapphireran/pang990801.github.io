(function () {
  var status = ".status";

  function ring(center, highlight, remainder, color, caption) {
    return {
      type: "pie",
      center: center,
      radius: ["22%", "28%"],
      label: { position: "center" },
      data: [
        {
          value: highlight,
          name: caption,
          itemStyle: { color: color },
          label: {
            formatter: "{d} %",
            color: color,
            fontSize: 18
          }
        },
        {
          value: remainder,
          name: "占位",
          tooltip: { show: false },
          itemStyle: { color: "#45d08a" },
          label: { formatter: "\n" + caption, color: color }
        }
      ]
    };
  }

  FootExamples.loadDataset("bmi-foot-ratio")
    .then(function (data) {
      var chart = FootExamples.initChart(".chart");
      var slim = data.ringShares.slimFeet;
      var wide = data.ringShares.wideFeet;
      chart.setOption({
        backgroundColor: "rgba(33,64,112,0.22)",
        color: ["#FF69B4", "#3deaff"],
        title: [
          {
            text: "过胖脚与过瘦脚占比",
            left: "83%",
            top: "4%",
            textAlign: "center",
            textStyle: { color: "#fff", fontSize: 14 }
          }
        ],
        tooltip: { trigger: "axis" },
        legend: {
          right: "32%",
          textStyle: { color: "#fff" },
          data: ["女生脚胖瘦度", "男生脚胖瘦度"]
        },
        grid: { left: "4%", right: "34%", top: "16%", bottom: "8%", containLabel: true },
        xAxis: {
          name: "BMI",
          type: "category",
          boundaryGap: false,
          data: data.bmiAxis
        },
        yAxis: {
          name: "脚胖瘦度（脚长/脚宽）",
          min: 20,
          type: "value"
        },
        series: [
          {
            name: "女生脚胖瘦度",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            data: data.girlsPlumpness,
            lineStyle: { color: "#FF69B4" },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255,105,180, 0.7)" },
                { offset: 1, color: "rgba(255,105,180, 0.05)" }
              ])
            }
          },
          {
            name: "男生脚胖瘦度",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            data: data.boysPlumpness,
            lineStyle: { color: "#3deaff" },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(61,234,255, 0.4)" },
                { offset: 1, color: "rgba(61,234,255, 0.05)" }
              ])
            }
          },
          ring(["83%", "36%"], slim.highlighted, slim.remainder, "#dc832c", slim.label),
          ring(["83%", "76%"], wide.highlighted, wide.remainder, "#ff733f", wide.label)
        ]
      });
      FootExamples.bindResize(chart);
      FootExamples.setStatus(
        status,
        "Rings are independent shares (slim " +
          slim.highlighted +
          "/" +
          (slim.highlighted + slim.remainder) +
          ", wide " +
          wide.highlighted +
          "/" +
          (wide.highlighted + wide.remainder) +
          "), not a recount of the lines."
      );
    })
    .catch(function (err) {
      FootExamples.fail(status, err);
    });
})();
