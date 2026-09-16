(function () {
  var status = ".status";
  var barWidth = 22;
  var colors = [
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#28f0f5" },
        { offset: 1, color: "#077175" }
      ]
    },
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#0172e2" },
        { offset: 1, color: "#0f299a" }
      ]
    }
  ];

  FootExamples.loadDataset("age-foot-length")
    .then(function (data) {
      var chart = FootExamples.initChart(".chart");
      chart.setOption({
        backgroundColor: "rgba(33,64,112,0.22)",
        tooltip: { trigger: "axis" },
        legend: { right: 24, top: 8, textStyle: { color: "#fff" } },
        grid: { left: "6%", right: "6%", bottom: "8%", containLabel: true },
        xAxis: {
          type: "category",
          name: "年龄",
          data: data.ages,
          axisLine: { lineStyle: { color: "#65C6E7" } }
        },
        yAxis: [
          {
            type: "value",
            name: "脚长",
            min: 12,
            axisLabel: { formatter: "{value} cm", color: "#65C6E7" },
            splitLine: { lineStyle: { color: "rgba(101,198,231,0.25)" } }
          },
          {
            type: "value",
            name: "女−男",
            axisLabel: { formatter: "{value} cm", color: "#65C6E7" },
            splitLine: { show: false }
          }
        ],
        series: [
          {
            z: 1,
            name: "女生脚长（cm）",
            type: "bar",
            barWidth: barWidth,
            data: data.girlsFootLengthCm,
            itemStyle: { color: colors[0] }
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [-11, "-50%"],
            symbolSize: [18, 8],
            tooltip: { show: false },
            data: data.girlsFootLengthCm,
            itemStyle: { color: "#12bac1", borderColor: "#12bac1" }
          },
          {
            z: 1,
            name: "男生脚长（cm）",
            type: "bar",
            barGap: 0,
            barWidth: barWidth,
            data: data.boysFootLengthCm,
            itemStyle: { color: colors[1] }
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [11, "-50%"],
            symbolSize: [18, 8],
            tooltip: { show: false },
            data: data.boysFootLengthCm,
            itemStyle: { color: "#319cf1", borderColor: "#319cf1" }
          },
          {
            name: "女生脚长与男生脚长之差",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            showAllSymbol: true,
            symbol: "circle",
            symbolSize: 9,
            data: data.girlsMinusBoysCm,
            itemStyle: { color: "#3deaff" },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                  { offset: 0, color: "rgba(61,234,255, 0.55)" },
                  { offset: 1, color: "rgba(61,234,255, 0.05)" }
                ])
              }
            }
          }
        ]
      });
      FootExamples.bindResize(chart);
      var cross = data.ages.find(function (age, i) {
        return data.girlsMinusBoysCm[i] < 0;
      });
      FootExamples.setStatus(
        status,
        "Difference line first turns negative at age " + cross + " on this sample."
      );
    })
    .catch(function (err) {
      FootExamples.fail(status, err);
    });
})();
