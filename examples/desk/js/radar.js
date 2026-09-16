(function () {
  var radar = Desk.data().radar;
  var chart = Desk.init("#radar-chart");
  var ages = Object.keys(radar.series);
  var colors = [Desk.teal, Desk.amber, "#8fbf88", Desk.rose];

  chart.setOption({
    backgroundColor: "transparent",
    legend: { textStyle: { color: Desk.cream }, bottom: 0 },
    tooltip: {},
    radar: {
      indicator: radar.indicators.map(function (name) {
        return { name: name, max: 100 };
      }),
      axisName: { color: Desk.cream },
      splitLine: { lineStyle: { color: "#3c4058" } },
      splitArea: { areaStyle: { color: ["rgba(232,165,75,0.04)", "rgba(232,165,75,0.10)"] } },
      axisLine: { lineStyle: { color: "#3c4058" } }
    },
    series: [{
      type: "radar",
      data: ages.map(function (age, i) {
        return {
          name: age,
          value: radar.series[age],
          lineStyle: { color: colors[i] },
          itemStyle: { color: colors[i] },
          areaStyle: { color: colors[i], opacity: 0.12 }
        };
      })
    }]
  });

  var head = document.querySelector("#radar-table thead");
  head.innerHTML =
    "<tr><th>年龄</th>" +
    radar.indicators.map(function (name) { return "<th>" + name + "</th>"; }).join("") +
    "</tr>";
  var body = document.querySelector("#radar-table tbody");
  body.innerHTML = ages
    .map(function (age) {
      return (
        "<tr><td>" +
        age +
        "</td>" +
        radar.series[age].map(function (v) { return "<td>" + v + "</td>"; }).join("") +
        "</tr>"
      );
    })
    .join("");

  document.getElementById("radar-note").textContent = radar.note;
})();
