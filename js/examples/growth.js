(function () {
  var chart;
  var data;
  var modeSelect = document.getElementById("mode");
  var tableBody = document.getElementById("growth-rows");

  function rowsHtml(pack) {
    return pack.ages.map(function (age, i) {
      var f = pack.series.female[i];
      var m = pack.series.male[i];
      var d = pack.differenceFemaleMinusMale[i];
      var cls = d < 0 ? " style=\"color:#3deaff\"" : "";
      return "<tr><td>" + age + "</td><td>" + f.toFixed(2) + "</td><td>" +
        m.toFixed(2) + "</td><td" + cls + ">" + (d > 0 ? "+" : "") + d.toFixed(2) +
        "</td></tr>";
    }).join("");
  }

  function optionFor(mode) {
    var ages = data.ages;
    var female = data.series.female;
    var male = data.series.male;
    var diff = data.differenceFemaleMinusMale;
    var series = [];

    if (mode !== "diff") {
      if (mode !== "male") {
        series.push({
          name: "女生脚长",
          type: "bar",
          data: female,
          itemStyle: { color: "#12bac1" }
        });
      }
      if (mode !== "female") {
        series.push({
          name: "男生脚长",
          type: "bar",
          data: male,
          itemStyle: { color: "#319cf1" }
        });
      }
    }

    if (mode !== "female" && mode !== "male") {
      series.push({
        name: "女减男",
        type: "line",
        yAxisIndex: mode === "diff" ? 0 : 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 9,
        data: diff,
        itemStyle: { color: "#3deaff" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(61,234,255,0.35)" },
              { offset: 1, color: "rgba(61,234,255,0.02)" }
            ]
          }
        }
      });
    }

    return {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      legend: { textStyle: { color: "#d7e6f2" }, top: 8 },
      grid: { left: 48, right: 48, top: 48, bottom: 36 },
      xAxis: {
        type: "category",
        data: ages.map(function (a) { return a + "岁"; }),
        axisLine: { lineStyle: { color: "#65C6E7" } },
        axisLabel: { color: "#d7e6f2" }
      },
      yAxis: mode === "diff" ? [{
        type: "value",
        name: "差值 cm",
        axisLabel: { color: "#65C6E7" },
        splitLine: { lineStyle: { color: "rgba(101,198,231,0.2)" } }
      }] : [{
        type: "value",
        name: "脚长 cm",
        min: 12,
        axisLabel: { color: "#65C6E7", formatter: "{value} cm" },
        splitLine: { lineStyle: { color: "rgba(101,198,231,0.2)" } }
      }, {
        type: "value",
        name: "差值 cm",
        axisLabel: { color: "#65C6E7" },
        splitLine: { show: false }
      }],
      series: series
    };
  }

  function render() {
    chart.setOption(optionFor(modeSelect.value), true);
  }

  FootData.load("age-foot-length").then(function (pack) {
    data = pack;
    tableBody.innerHTML = rowsHtml(pack);
    chart = echarts.init(document.getElementById("growth-chart"), "dark");
    render();
    window.addEventListener("resize", function () { chart.resize(); });
    modeSelect.addEventListener("change", render);
  }).catch(function (err) {
    document.getElementById("growth-chart").textContent = err.message;
  });
})();
