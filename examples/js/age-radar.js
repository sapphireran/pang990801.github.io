(function () {
  var status = ".status";
  var palette = [
    { line: "#00c2ff", name: "9岁" },
    { line: "#f9cf67", name: "10岁" },
    { line: "#32CD32", name: "11岁" },
    { line: "#e92b77", name: "12岁" }
  ];

  function area(color) {
    return {
      normal: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            { offset: 0, color: color },
            { offset: 0.5, color: "rgba(0,0,0,0)" },
            { offset: 1, color: color }
          ]
        },
        opacity: 1
      }
    };
  }

  FootExamples.loadDataset("age-radar")
    .then(function (data) {
      var chart = FootExamples.initChart(".chart");
      chart.setOption({
        backgroundColor: "rgba(0,0,0,0.15)",
        color: palette.map(function (item) {
          return item.line;
        }),
        legend: {
          bottom: 12,
          textStyle: { color: "#fff" },
          data: palette.map(function (item) {
            return item.name;
          })
        },
        radar: {
          indicator: data.indicators.map(function (item) {
            return { name: item.labelZh, max: 100 };
          }),
          shape: "circle",
          center: ["50%", "48%"],
          radius: "62%",
          startAngle: 90,
          splitNumber: 3,
          name: {
            formatter: "{value}",
            textStyle: { color: "#fff", fontSize: 16, fontWeight: 450 }
          },
          splitArea: { show: true, areaStyle: { color: "rgba(0,0,0,0)" } },
          axisLine: { lineStyle: { color: "#BEBEBE" } },
          splitLine: { lineStyle: { color: "#BEBEBE", width: 1 } }
        },
        series: [
          {
            name: "雷达图",
            type: "radar",
            itemStyle: {
              emphasis: { lineStyle: { width: 4 } }
            },
            data: data.series.map(function (row, i) {
              return {
                name: palette[i].name,
                value: row.values,
                symbolSize: 3,
                areaStyle: area(palette[i].line),
                lineStyle: { normal: { color: palette[i].line, width: 2 } },
                itemStyle: {
                  normal: { borderColor: palette[i].line, borderWidth: 2.5 }
                }
              };
            })
          }
        ]
      });
      FootExamples.bindResize(chart);
      FootExamples.setStatus(
        status,
        "Axes are normalized 0–100. Age-12 shoe/foot spokes are the evaluated 71 / 71 from the live 77-6 / 79-8 expressions."
      );
    })
    .catch(function (err) {
      FootExamples.fail(status, err);
    });
})();
