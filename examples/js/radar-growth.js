ExampleCommon.onReady(function () {
  var data = ExampleCommon.requireData("radarProfiles");
  var chart = echarts.init(ExampleCommon.$("#radar-chart"));
  ExampleCommon.bindChartResize(chart);
  var colors = {
    9: "#00c2ff",
    10: "#f9cf67",
    11: "#32CD32",
    12: "#e92b77",
  };

  function selectedAges() {
    return Array.prototype.slice
      .call(document.querySelectorAll("#radar-filter button.is-active"))
      .map(function (button) {
        return button.getAttribute("data-value");
      });
  }

  function render() {
    var ages = selectedAges();
    if (!ages.length) {
      ages = ["9", "10", "11", "12"];
    }
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: {},
        legend: { bottom: 0, textStyle: { color: "#d7f6ff" } },
        radar: {
          indicator: data.axes_zh.map(function (name) {
            return { name: name, max: 100 };
          }),
          shape: "circle",
          radius: "68%",
          axisName: { color: "#e8f4ff", fontSize: 14 },
          splitLine: { lineStyle: { color: "rgba(190,190,190,0.45)" } },
          splitArea: { areaStyle: { color: "transparent" } },
          axisLine: { lineStyle: { color: "rgba(190,190,190,0.45)" } },
        },
        series: [
          {
            type: "radar",
            data: ages.map(function (age) {
              return {
                name: age + "岁",
                value: data.profiles[age],
                itemStyle: { color: colors[age] },
                areaStyle: { color: colors[age], opacity: 0.18 },
              };
            }),
          },
        ],
      },
      true
    );
  }

  var gain = data.profiles["12"].map(function (value, index) {
    return value - data.profiles["9"][index];
  });
  var heelIndex = data.axes_en.indexOf("heel_girth");
  var statureIndex = data.axes_en.indexOf("stature");
  ExampleCommon.setText("#kpi-stature-gain", "+" + gain[statureIndex]);
  ExampleCommon.setText("#kpi-heel-gain", "+" + gain[heelIndex]);
  ExampleCommon.setText("#kpi-ages", "9–12");

  ExampleCommon.fillTable(
    ExampleCommon.$("#radar-table"),
    ["年龄"].concat(data.axes_zh),
    data.rows.map(function (row) {
      return [row.age_years].concat(
        data.axes_en.map(function (key) {
          return row[key];
        })
      );
    })
  );

  document.querySelector("#radar-filter").addEventListener("click", function (event) {
    var button = event.target.closest("button[data-value]");
    if (!button) {
      return;
    }
    button.classList.toggle("is-active");
    if (!selectedAges().length) {
      button.classList.add("is-active");
    }
    render();
  });

  render();
});
